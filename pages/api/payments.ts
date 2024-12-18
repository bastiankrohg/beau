import { NextApiRequest, NextApiResponse } from 'next';
import { Payment } from '../../lib/models/Payment'; // Adjust import paths
import { Booking } from '../../lib/models/Booking'; // Adjust import paths

// Helper to authenticate and get user_id (mock example; replace with your auth logic)
const getUserIdFromRequest = (req: NextApiRequest): string | null => {
  // Replace this with your actual authentication logic
  return req.headers['x-user-id'] as string || null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user_id = getUserIdFromRequest(req);
  if (!user_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method, query, body } = req;

  try {
    switch (method) {
      // Create a new Payment
      case 'POST': {
        const { booking_id, amount, payment_method } = body;

        // Validate the booking exists
        const booking = await Booking.findByPk(booking_id);
        if (!booking || booking.user_id !== user_id) {
          return res.status(404).json({ message: 'Booking not found or access denied' });
        }

        const payment = await Payment.create({
          booking_id,
          amount,
          payment_method,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        });

        return res.status(201).json({ message: 'Payment created successfully', payment });
      }

      // Get all Payments for the authenticated user
      case 'GET': {
        if (query.id) {
          // Get a Payment by ID
          const { id } = query;

          if (typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid ID format' });
          }

          const payment = await Payment.findByPk(id, {
            include: [{ model: Booking, as: 'booking' }],
          });

          if (!payment || !payment.booking || payment.booking.user_id !== user_id) {
            return res.status(404).json({ message: 'Payment not found or access denied' });
          }

          return res.json(payment);
        } else {
          // Get all Payments
          const payments = await Payment.findAll({
            include: [{ model: Booking, as: 'booking', where: { user_id } }],
          });

          if (!payments || payments.length === 0) {
            return res.status(404).json({ message: 'No payments found' });
          }

          return res.json(payments);
        }
      }

      // Process a Payment
      case 'POST': {
        if (query.process) {
          const { booking_id, payment_method_id } = body;

          // Replace with actual payment service logic
          const payment = "placeholder"; // await processPayment(booking_id, payment_method_id);

          return res.status(200).json({ message: 'Payment processed successfully', payment });
        }
        break;
      }

      // Update Payment Status
      case 'PUT': {
        const { id } = query;
        const { status } = body;

        if (typeof id !== 'string') {
          return res.status(400).json({ message: 'Invalid ID format' });
        }

        const payment = await Payment.findByPk(id);
        if (!payment) {
          return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        payment.updated_at = new Date();
        await payment.save();

        return res.json({ message: 'Payment status updated successfully', payment });
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling payments:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
