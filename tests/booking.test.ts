import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/bookings';
import sequelize from 'sequelize/db';
import { User } from 'sequelize/models/User';
import { ServiceProvider } from 'sequelize/models/ServiceProvider';
import { Service } from 'sequelize/models/Service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('Booking API', () => {
  let token: string;
  let serviceId: string;
  let providerId: string;
  let bookingId: string;

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

    providerId = serviceProvider.provider_id;

    // Create a test service
    const service = await Service.create({
      name: 'Haircut',
      description: 'A basic haircut service',
      price: 20.0,
      provider_id: providerId,
    });

    serviceId = service.service_id;

    // Generate a JWT token
    token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new booking', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        service_id: serviceId,
        provider_id: providerId,
        appointment_time: new Date(),
        location: 'Customer Location',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Booking created successfully');
    expect(data.booking).toHaveProperty('booking_id');
    bookingId = data.booking.booking_id;
  });

  it('should fetch all bookings for the authenticated user', async () => {
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

  it('should fetch a single booking by ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: bookingId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.booking_id).toBe(bookingId);
  });

  it('should update the booking status', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: bookingId },
      body: { status: 'confirmed' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.booking.status).toBe('confirmed');
  });

  it('should cancel the booking', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: bookingId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.booking.status).toBe('cancelled');
  });
});
