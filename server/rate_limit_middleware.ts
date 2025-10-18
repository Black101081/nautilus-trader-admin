import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiting configuration
 */

// General API rate limit (100 requests per 15 minutes)
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Strict rate limit for authentication endpoints (5 requests per 15 minutes)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Account temporarily locked. Please try again in 15 minutes.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Trading endpoints rate limit (30 requests per minute)
export const tradingRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 trading requests per minute
  message: 'Too many trading requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many trading requests. Please wait before placing more orders.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Data query rate limit (200 requests per 15 minutes)
export const dataQueryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 data queries per windowMs
  message: 'Too many data queries, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many data queries. Please reduce your request frequency.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// WebSocket connection rate limit (10 connections per 5 minutes)
export const websocketRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 WebSocket connections per windowMs
  message: 'Too many WebSocket connections, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Connection limit exceeded',
      message: 'Too many WebSocket connections. Please close existing connections.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Custom rate limiter based on user ID (for authenticated requests)
 */
export const createUserRateLimit = (maxRequests: number, windowMinutes: number) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      // Use user ID from JWT token if available, otherwise fall back to IP
      const user = (req as any).user;
      return user?.userId || req.ip || 'unknown';
    },
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: `You have exceeded your rate limit of ${maxRequests} requests per ${windowMinutes} minutes.`,
        retryAfter: res.getHeader('Retry-After'),
      });
    },
  });
};

/**
 * Rate limit configuration by endpoint type
 */
export const rateLimitConfig = {
  // Public endpoints
  public: generalRateLimit,
  
  // Authentication endpoints
  auth: authRateLimit,
  
  // Trading operations
  trading: tradingRateLimit,
  
  // Data queries
  data: dataQueryRateLimit,
  
  // WebSocket connections
  websocket: websocketRateLimit,
  
  // Custom user-based limits
  userBased: {
    standard: createUserRateLimit(1000, 60), // 1000 requests per hour
    premium: createUserRateLimit(5000, 60),  // 5000 requests per hour
    admin: createUserRateLimit(10000, 60),   // 10000 requests per hour
  },
};

/**
 * Helper to get rate limit based on user role
 */
export function getRateLimitByRole(role?: 'admin' | 'trader' | 'viewer') {
  switch (role) {
    case 'admin':
      return rateLimitConfig.userBased.admin;
    case 'trader':
      return rateLimitConfig.userBased.premium;
    case 'viewer':
    default:
      return rateLimitConfig.userBased.standard;
  }
}

