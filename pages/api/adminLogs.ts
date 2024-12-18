import { NextApiRequest, NextApiResponse } from 'next';
import { AdminLog } from 'lib/models/AdminLog';
import { authenticate } from 'lib/middleware/authMiddleware'; // Authentication middleware

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    // Middleware for authentication
    await authenticate(req, res);
    if (!req.user_id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user_id.' });
    }

    // Handle specific admin log operations by ID
    if (id && typeof id === 'string') {
      switch (req.method) {
        case 'GET': {
          // Get an AdminLog by ID
          const adminLog = await AdminLog.findByPk(id);
          if (!adminLog || adminLog.admin_id !== req.user_id) {
            return res.status(404).json({ message: 'Admin log not found or access denied' });
          }
          return res.status(200).json(adminLog);
        }
        default:
          res.setHeader('Allow', ['GET']);
          return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    }

    // Handle general admin log operations
    switch (req.method) {
      case 'POST': {
        // Create a new AdminLog
        const { action } = req.body;
        const adminLog = await AdminLog.create({
          admin_id: req.user_id,
          action,
          timestamp: new Date(),
        });
        return res.status(201).json({ message: 'Admin log created successfully', adminLog });
      }
      case 'GET': {
        // Get all AdminLogs for the authenticated user
        const adminLogs = await AdminLog.findAll({
          where: { admin_id: req.user_id },
          order: [['timestamp', 'DESC']],
        });
        return res.status(200).json(adminLogs);
      }
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error });
  }
}
