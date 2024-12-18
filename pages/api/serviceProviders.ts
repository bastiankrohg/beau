import { NextApiRequest, NextApiResponse } from 'next';
import { ServiceProvider } from 'lib/models/ServiceProvider';
import { Service } from 'lib/models/Service';
import { Op } from 'sequelize';
import { authenticate } from 'lib/middleware/authMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          return getServiceProviderById(req, res, query.id as string);
        } else if (query.search) {
          return getFilteredServiceProviders(req, res);
        } else {
          return getAllServiceProviders(req, res);
        }

      case 'POST':
        await authenticate(req, res);
        return createServiceProvider(req, res);

      case 'PUT':
        await authenticate(req, res);
        if (!query.id) {
          return res.status(400).json({ message: 'ID is required for updating a ServiceProvider.' });
        }
        return updateServiceProvider(req, res, query.id as string);

      case 'DELETE':
        await authenticate(req, res);
        if (!query.id) {
          return res.status(400).json({ message: 'ID is required for deleting a ServiceProvider.' });
        }
        return deleteServiceProvider(req, res, query.id as string);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}

// Create a new ServiceProvider
async function createServiceProvider(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, certification, bio, location, profile_picture } = req.body;

  try {
    const serviceProvider = await ServiceProvider.create({
      user_id,
      certification,
      bio,
      location,
      profile_picture,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: 'ServiceProvider created successfully', serviceProvider });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating ServiceProvider', error });
  }
}

// Get all ServiceProviders
async function getAllServiceProviders(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceProviders = await ServiceProvider.findAll();
    return res.json(serviceProviders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching ServiceProviders', error });
  }
}

// Get a single ServiceProvider by ID
async function getServiceProviderById(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const serviceProvider = await ServiceProvider.findByPk(id);
    if (!serviceProvider) return res.status(404).json({ message: 'ServiceProvider not found' });

    return res.json(serviceProvider);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching ServiceProvider', error });
  }
}

// Fetch filtered ServiceProviders based on customer search criteria
async function getFilteredServiceProviders(req: NextApiRequest, res: NextApiResponse) {
  const { location, minRating, maxRating, certified, priceMin, priceMax } = req.query;

  try {
    const filter: any = {};

    if (location) filter.location = { [Op.like]: `%${location}%` };

    if (minRating || maxRating) {
      filter.rating = {
        [Op.gte]: minRating ? parseFloat(minRating as string) : 0,
        [Op.lte]: maxRating ? parseFloat(maxRating as string) : 5,
      };
    }

    if (certified) filter.certification = certified === 'true';

    if (priceMin || priceMax) {
      // Ensure priceMin and priceMax are parsed as numbers
      const parsedPriceMin = priceMin ? parseFloat(priceMin as string) : 0;
      const parsedPriceMax = priceMax ? parseFloat(priceMax as string) : 1000;

      const services = await Service.findAll({
        where: {
          price: {
            [Op.gte]: parsedPriceMin,
            [Op.lte]: parsedPriceMax,
          },
        },
        include: [{ model: ServiceProvider, as: 'provider' }],
      });

      const providerIds = services.map((service: Service) => service.provider_id);
      filter.provider_id = { [Op.in]: providerIds };
    }

    const serviceProviders = await ServiceProvider.findAll({
      where: filter,
      include: [{ model: Service, as: 'services' }],
    });

    return res.json(serviceProviders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching filtered serviceProviders', error });
  }
}

// Update a ServiceProvider by ID
async function updateServiceProvider(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { certification, bio, location, profile_picture } = req.body;

  try {
    const serviceProvider = await ServiceProvider.findByPk(id);
    if (!serviceProvider) return res.status(404).json({ message: 'ServiceProvider not found' });

    serviceProvider.certification = certification ?? serviceProvider.certification;
    serviceProvider.bio = bio ?? serviceProvider.bio;
    serviceProvider.location = location ?? serviceProvider.location;
    serviceProvider.profile_picture = profile_picture ?? serviceProvider.profile_picture;
    serviceProvider.updated_at = new Date();

    await serviceProvider.save();
    return res.json({ message: 'ServiceProvider updated successfully', serviceProvider });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating ServiceProvider', error });
  }
}

// Delete a ServiceProvider by ID
async function deleteServiceProvider(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const serviceProvider = await ServiceProvider.findByPk(id);
    if (!serviceProvider) return res.status(404).json({ message: 'ServiceProvider not found' });

    await serviceProvider.destroy();
    return res.json({ message: 'ServiceProvider deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting ServiceProvider', error });
  }
}
