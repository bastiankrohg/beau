import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/adminLogs'; // Import your API handler
import sequelize from 'lib/db';
import { User } from 'lib/models/User';
import jwt from 'jsonwebtoken';

describe('AdminLog API', () => {
  let token: string;

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true });

    // Create a test admin user
    const admin = await User.create({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password_hash: 'hashedpassword',
      role: 'admin',
    });

    // Generate a JWT token
    token = jwt.sign({ user_id: admin.user_id, role: admin.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new admin log', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { action: 'Created a new user' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Admin log created successfully');
    expect(data.adminLog).toHaveProperty('log_id');
  });

  it('should fetch all admin logs', async () => {
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
});
