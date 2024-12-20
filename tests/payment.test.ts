import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/payments';
import sequelize from 'sequelize/db';
import { User } from 'sequelize/models/User';
import { ServiceProvider } from 'sequelize/models/ServiceProvider';
import { Service } from 'sequelize/models/Service';
import { Booking } from 'sequelize/models/Booking';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('Payment API', () => {
  let token: string;
  let bookingId: string;
  let paymentId: string;

  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password_hash: 'hashedpassword',
      role: 'customer',
    });

    // Create a test service provider
    const serviceProvider = await ServiceProvider.create({
      user_id: user.user_id,
      certification: true,
      bio: 'Experienced Barber',
      location: 'Downtown',
      profile_picture: 'profile.jpg',
    });

    // Create a test service
    const service = await Service.create({
      name: 'Haircut',
      description: 'A basic haircut service',
      price: 20.0,
      provider_id: serviceProvider.provider_id,
    });

    // Create a test booking
    const booking = await Booking.create({
      user_id: user.user_id,
      service_id: service.service_id,
      provider_id: serviceProvider.provider_id,
      status: 'pending',
      appointment_time: new Date(),
      location: 'Customer Location',
    });

    bookingId = booking.booking_id;

    // Generate a JWT token
    token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new payment', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        booking_id: bookingId,
        amount: 20.0,
        payment_method: 'card',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Payment created successfully');
    expect(data.payment).toHaveProperty('payment_id');
    paymentId = data.payment.payment_id;
  });

  it('should fetch all payments for the authenticated user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should fetch a single payment by ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: paymentId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.payment_id).toBe(paymentId);
  });

  it('should update the payment status', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: paymentId },
      body: { status: 'completed' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.payment.status).toBe('completed');
  });
});
