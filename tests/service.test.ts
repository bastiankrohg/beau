import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/services';
import sequelize from 'sequelize/db';
import { Service } from 'sequelize/models/Service';
import { ServiceProvider } from 'sequelize/models/ServiceProvider';
import { User } from 'sequelize/models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('Service API', () => {
  let token: string;
  let serviceId: string;
  let providerId: string;

  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });  // Reset database before tests

    // Create a test user and service provider
    const user = await User.create({
      name: 'Test Provider',
      email: 'testprovider@example.com',
      password_hash: 'hashedpassword',
      role: 'provider',
    });

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

  it('should create a new service', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        name: 'Shave',
        description: 'A clean shave service',
        price: 15.0,
        provider_id: providerId,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Service created successfully');
    expect(data.service.name).toBe('Shave');
  });

  it('should fetch all services', async () => {
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

  it('should fetch a single service by ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: serviceId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.name).toBe('Haircut');
  });

  it('should update a service', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: serviceId },
      body: {
        name: 'Updated Haircut',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Service updated successfully');
    expect(data.service.name).toBe('Updated Haircut');
  });

  it('should delete a service', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: serviceId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Service deleted successfully');
  });
});
