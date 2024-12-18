import { NextApiRequest, NextApiResponse } from 'next';
import { Notification } from '../../lib/models/Notification';
import { authenticate } from '../../lib/middleware/authMiddleware'; // Custom middleware for authentication

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    // Middleware for authentication
    await authenticate(req, res);
    if (!req.user_id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user_id.' });
    }

    // Handle specific notification operations by ID
    if (id && typeof id === 'string') {
      switch (req.method) {
        case 'PATCH': {
          // Mark a Notification as Read
          const notification = await Notification.findByPk(id);
          if (!notification || notification.user_id !== req.user_id) {
            return res.status(404).json({ message: 'Notification not found or access denied' });
          }
          notification.status = 'read';
          await notification.save();
          return res.status(200).json({ message: 'Notification marked as read', notification });
        }
        case 'DELETE': {
          // Delete a Notification
          const notification = await Notification.findByPk(id);
          if (!notification || notification.user_id !== req.user_id) {
            return res.status(404).json({ message: 'Notification not found or access denied' });
          }
          await notification.destroy();
          return res.status(200).json({ message: 'Notification deleted successfully' });
        }
        default:
          res.setHeader('Allow', ['PATCH', 'DELETE']);
          return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    }

    // Handle general notification operations
    switch (req.method) {
      case 'POST': {
        // Create a new Notification
        const { user_id, message } = req.body;
        const notification = await Notification.create({
          user_id,
          message,
          status: 'unread',
          created_at: new Date(),
        });
        return res.status(201).json({ message: 'Notification created successfully', notification });
      }
      case 'GET': {
        // Get all Notifications for the authenticated user
        const notifications = await Notification.findAll({
          where: { user_id: req.user_id },
          order: [['created_at', 'DESC']],
        });
        return res.status(200).json(notifications);
      }
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error });
  }
}
