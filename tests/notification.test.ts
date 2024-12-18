import { createMocks } from 'node-mocks-http';
import handler from 'pages/api/notifications';
import sequelize from 'lib/db';
import { User } from 'lib/models/User';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  user_id: string;
  role: string;
}

describe('Notification API', () => {
  let token: string;
  let notificationId: string;

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

    // Generate a JWT token
    token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new notification', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        user_id: (jwt.decode(token) as DecodedToken).user_id,
        message: 'This is a test notification',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Notification created successfully');
    expect(data.notification).toHaveProperty('notification_id');
    notificationId = data.notification.notification_id;
  });

  it('should fetch all notifications for the authenticated user', async () => {
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

  it('should mark a notification as read', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: notificationId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.notification.status).toBe('read');
  });

  it('should delete a notification', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      query: { id: notificationId },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Notification deleted successfully');
  });
});
