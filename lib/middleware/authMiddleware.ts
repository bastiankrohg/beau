import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

declare module 'next' {
  interface NextApiRequest {
      user_id?: string;
      role?: string;
  }
}

export const authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided.' });
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string; role: string };
    req.user_id = decoded.user_id; // Add user_id to the request object
    req.role = decoded.role; // Add role to the request object
    return true;
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
    return false;
  }
};
