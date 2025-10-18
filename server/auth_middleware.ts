import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'trader' | 'viewer';
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Express middleware to authenticate requests
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Get token from Authorization header or cookie
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to check user role
 */
export function requireRole(...roles: Array<'admin' | 'trader' | 'viewer'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JWTPayload;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: user.role
      });
    }

    next();
  };
}

/**
 * tRPC context middleware to add user to context
 */
export function createAuthContext(req: Request) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies?.token;

  if (!token) {
    return { user: null };
  }

  try {
    const user = verifyToken(token);
    return { user };
  } catch (error) {
    return { user: null };
  }
}

/**
 * Helper to check if user is authenticated in tRPC context
 */
export function requireAuth(ctx: { user: JWTPayload | null }) {
  if (!ctx.user) {
    throw new Error('Authentication required');
  }
  return ctx.user;
}

/**
 * Helper to check if user has required role in tRPC context
 */
export function requireAuthRole(
  ctx: { user: JWTPayload | null },
  ...roles: Array<'admin' | 'trader' | 'viewer'>
) {
  const user = requireAuth(ctx);
  
  if (!roles.includes(user.role)) {
    throw new Error(`Insufficient permissions. Required: ${roles.join(' or ')}, Current: ${user.role}`);
  }
  
  return user;
}

