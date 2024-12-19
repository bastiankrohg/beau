import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'sequelize/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate } from 'lib/middleware/authMiddleware';

// Main handler for user operations
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers, body } = req;

  switch (method) {
    case 'POST':
      if (headers.operation === 'register') return registerUser(req, res);
      if (headers.operation === 'login') return loginUser(req, res);
      return res.status(400).json({ message: 'Invalid operation' });

    case 'GET':
      await authenticate(req, res); // Ensure authenticated for sensitive routes
      return getCurrentUser(req, res);

    case 'PUT':
      await authenticate(req, res);
      return updateUser(req, res);

    case 'DELETE':
      await authenticate(req, res);
      return deleteUser(req, res);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// User operations

async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password, phone_number, address, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password_hash,
      phone_number,
      address,
      role,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user', error });
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
}

async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await User.findByPk(req.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user details', error });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { name, phone_number, address } = req.body;

  try {
    const user = await User.findByPk(req.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.address = address || user.address;
    user.updated_at = new Date();

    await user.save();
    return res.json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user details', error });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await User.findByPk(req.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error });
  }
}
