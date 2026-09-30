import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Verifies the JWT issued by auth-service. The gateway holds the same
// JWT_SECRET, so it can check tokens locally without calling auth-service.
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
