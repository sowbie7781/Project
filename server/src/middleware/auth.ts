import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No valid token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'skillpath_default_jwt_secret_college';

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      res.status(401).json({ success: false, message: 'User session invalid or user no longer exists.' });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    return Promise.resolve();
  }
  next();
  return Promise.resolve();
};
