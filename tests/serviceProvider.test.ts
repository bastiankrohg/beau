import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/serviceProviders';
import sequelize from 'sequelize/db';
import { User } from 'sequelize/models/User';
import { ServiceProvider } from 'sequelize/models/ServiceProvider';
import { Service } from 'sequelize/models/Service';
import jwt from 'jsonwebtoken';

describe('ServiceProvider API', () => {
  let token: string;
  let serviceProviderId: string;

  beforeAll(async () => {
    // Sync the database
    await sequelize.sync({ force: true });  // Reset database before tests

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password_hash: 'hashedpassword',
      role: 'provider',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Generate a JWT token
    token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Create a test service provider
    const serviceProvider = await ServiceProvider.create({
      user_id: user.user_id,
      certification: true,
      bio: 'Experienced Barber',
      location: 'Downtown',
      profile_picture: 'profile.jpg',
      created_at: new Date(),
      updated_at: new Date(),
    });

    serviceProviderId = serviceProvider.provider_id;

    // Create a test service
    await Service.create({
      name: 'Haircut',
      description: 'A basic haircut',
      price: 30,
      provider_id: serviceProviderId,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new ServiceProvider', async () => {
    const decoded = jwt.decode(token) as jwt.JwtPayload | null;
  
    if (!decoded || typeof decoded !== 'object' || !decoded.user_id) {
      throw new Error('Invalid token payload');
    }
  
    const { req, res } = createMocks({
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        user_id: decoded.user_id, // Safely access user_id
        certification: true,
        bio: 'New Provider',
        location: 'City Center',
        profile_picture: 'new_profile.jpg',
      },
    });
  
    await handler(req, res);
  
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('ServiceProvider created successfully');
    expect(data.serviceProvider.bio).toBe('New Provider');
  });
  

  it('should fetch all ServiceProviders', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should fetch a single ServiceProvider by ID', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: serviceProviderId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.bio).toBe('Experienced Barber');
  });

  it('should fetch ServiceProviders by location', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { search: 'true', location: 'Downtown' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].location).toContain('Downtown');
  });

  it('should update a ServiceProvider', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: serviceProviderId },
      body: { bio: 'Updated Bio' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('ServiceProvider updated successfully');
    expect(data.serviceProvider.bio).toBe('Updated Bio');
  });

  it('should delete a ServiceProvider', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: serviceProviderId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('ServiceProvider deleted successfully');
  });
});
