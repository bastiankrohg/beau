import { NextApiRequest, NextApiResponse } from 'next';
import { Review } from 'sequelize/models/Review';
import { authenticate } from 'lib/middleware/authMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, providerId } = req.query;

    // Middleware for authentication (only applied for specific routes)
    if (['POST', 'DELETE'].includes(req.method || '')) {
      await authenticate(req, res);
      if (!req.user_id) {
        return res.status(401).json({ message: 'Unauthorized: Missing user_id.' });
      }
    }

    // Handle routes with specific review IDs
    if (id && typeof id === 'string') {
      switch (req.method) {
        case 'GET': {
          // Get a Review by ID
          const review = await Review.findByPk(id, {
            include: [
              { model: Review.associations.user.target, as: 'user' },
              { model: Review.associations.provider.target, as: 'provider' },
            ],
          });
          if (!review) {
            return res.status(404).json({ message: 'Review not found' });
          }
          return res.status(200).json(review);
        }
        case 'DELETE': {
          // Delete a Review
          const review = await Review.findByPk(id);
          if (!review || review.user_id !== req.user_id) {
            return res.status(404).json({ message: 'Review not found or access denied' });
          }
          await review.destroy();
          return res.status(200).json({ message: 'Review deleted successfully' });
        }
        default:
          res.setHeader('Allow', ['GET', 'DELETE']);
          return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    }

    // Handle routes for provider-specific reviews
    if (providerId && typeof providerId === 'string') {
      switch (req.method) {
        case 'GET': {
          // Get Reviews for a specific ServiceProvider
          const reviews = await Review.findAll({
            where: { provider_id: providerId },
            include: [{ model: Review.associations.user.target, as: 'user' }],
          });
          return res.status(200).json(reviews);
        }
        default:
          res.setHeader('Allow', ['GET']);
          return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    }

    // Handle routes for all reviews
    switch (req.method) {
      case 'GET': {
        // Get all Reviews
        const reviews = await Review.findAll({
          include: [
            { model: Review.associations.user.target, as: 'user' },
            { model: Review.associations.provider.target, as: 'provider' },
          ],
        });
        return res.status(200).json(reviews);
      }
      case 'POST': {
        // Create a new Review
        const { user_id, provider_id, rating, comment } = req.body;    
        const review = await Review.create({
          user_id,
          provider_id,
          rating,
          comment,
          created_at: new Date(),
        });
        return res.status(201).json({ message: 'Review created successfully', review });
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error });
  }
}
