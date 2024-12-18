import { NextApiRequest, NextApiResponse } from 'next';
import { Booking } from '../../lib/models/Booking';
import { authenticate } from '../../lib/middleware/authMiddleware'; // Authentication middleware

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    // Middleware for authentication
    await authenticate(req, res);
    if (!req.user_id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user_id.' });
    }

    // Handle specific booking operations by ID
    if (id && typeof id === 'string') {
      switch (req.method) {
        case 'GET': {
          // Get a booking by ID
          const booking = await Booking.findByPk(id);
          if (!booking || booking.user_id !== req.user_id) {
            return res.status(404).json({ message: 'Booking not found or access denied' });
          }
          return res.status(200).json(booking);
        }
        case 'PUT': {
          // Update booking status
          const { status } = req.body;
          const booking = await Booking.findByPk(id);
          if (!booking || booking.user_id !== req.user_id) {
            return res.status(404).json({ message: 'Booking not found or access denied' });
          }
          booking.status = status;
          booking.updated_at = new Date();
          await booking.save();
          return res.status(200).json({ message: 'Booking status updated successfully', booking });
        }
        case 'DELETE': {
          // Cancel a booking
          const booking = await Booking.findByPk(id);
          if (!booking || booking.user_id !== req.user_id) {
            return res.status(404).json({ message: 'Booking not found or access denied' });
          }
          booking.status = 'cancelled';
          booking.updated_at = new Date();
          await booking.save();
          return res.status(200).json({ message: 'Booking cancelled successfully', booking });
        }
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    }

    // Handle general booking operations
    switch (req.method) {
      case 'POST': {
        // Create a new Booking
        const { service_id, provider_id, appointment_time, location } = req.body;
        const booking = await Booking.create({
          user_id: req.user_id,
          service_id,
          provider_id,
          appointment_time,
          location,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        });
        return res.status(201).json({ message: 'Booking created successfully', booking });
      }
      case 'GET': {
        // Get all bookings for the authenticated user
        const bookings = await Booking.findAll({ where: { user_id: req.user_id } });
        return res.status(200).json(bookings);
      }
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error });
  }
}
