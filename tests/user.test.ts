import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/users'; // Adjust the path to your Next.js API handler
import { User } from 'lib/models/User'; // User model
import sequelize from 'lib/db'; // Your Sequelize instance
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('User API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password_hash: await bcrypt.hash('testpassword', 10),
      role: 'customer',
      created_at: new Date(),
      updated_at: new Date(),
    });

    userId = user.user_id;

    // Generate a JWT token
    token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await sequelize.close(); // Clean up database connection
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { operation: 'register' },
        body: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'newpassword',
          role: 'customer',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('User registered successfully');
      expect(data.user.email).toBe('newuser@example.com');
    });

    it('should return error if email already exists', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { operation: 'register' },
        body: {
          name: 'Test User',
          email: 'testuser@example.com', // Already exists
          password: 'password',
          role: 'customer',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Email already in use');
    });
  });

  describe('POST /api/users/login', () => {
    it('should log in an existing user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { operation: 'login' },
        body: {
          email: 'testuser@example.com',
          password: 'testpassword',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Login successful');
      expect(data.token).toBeDefined();
    });

    it('should return error if password is incorrect', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: { operation: 'login' },
        body: {
          email: 'testuser@example.com',
          password: 'wrongpassword',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Invalid password');
    });
  });

  describe('GET /api/users/me', () => {
    it('should fetch the current logged-in user', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.email).toBe('testuser@example.com');
    });

    it('should return 401 if no token is provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('No token provided.');
    });

    it('should return 401 if token is invalid', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: { Authorization: 'Bearer invalidtoken' },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Invalid token.');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update the current user profile', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          name: 'Updated User',
          phone_number: '1234567890',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('User updated successfully');
      expect(data.user.name).toBe('Updated User');
    });
  });

  describe('DELETE /api/users/me', () => {
    it('should delete the current user account', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('User deleted successfully');
    });
  });
});
