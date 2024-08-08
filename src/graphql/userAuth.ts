import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtsecret } from '..';
 // Adjust the path to your JWT secret

interface AuthenticatedRequest extends Request {
  user?: any; // Define the user type based on your application's user object
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
    const decoded = jwt.verify(token, jwtsecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token!' });
  }
};

export default authenticateToken;
