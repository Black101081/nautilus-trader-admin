import { z } from 'zod';

/**
 * Common validation schemas
 */

// Instrument ID validation
export const instrumentIdSchema = z.string()
  .min(1, 'Instrument ID is required')
  .regex(/^[A-Z0-9\/\-\.]+$/, 'Invalid instrument ID format')
  .max(50, 'Instrument ID too long');

// Order side validation
export const orderSideSchema = z.enum(['BUY', 'SELL'], {
  errorMap: () => ({ message: 'Order side must be BUY or SELL' })
});

// Position side validation
export const positionSideSchema = z.enum(['LONG', 'SHORT'], {
  errorMap: () => ({ message: 'Position side must be LONG or SHORT' })
});

// Order type validation
export const orderTypeSchema = z.enum(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'], {
  errorMap: () => ({ message: 'Invalid order type' })
});

// Order status validation
export const orderStatusSchema = z.enum(['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELED', 'REJECTED'], {
  errorMap: () => ({ message: 'Invalid order status' })
});

// Position status validation
export const positionStatusSchema = z.enum(['OPEN', 'CLOSED'], {
  errorMap: () => ({ message: 'Position status must be OPEN or CLOSED' })
});

// Positive number validation
export const positiveNumberSchema = z.number()
  .positive('Must be a positive number')
  .finite('Must be a finite number');

// Non-negative number validation
export const nonNegativeNumberSchema = z.number()
  .nonnegative('Must be a non-negative number')
  .finite('Must be a finite number');

// Price validation
export const priceSchema = positiveNumberSchema;

// Quantity validation
export const quantitySchema = positiveNumberSchema;

// Timestamp validation
export const timestampSchema = z.string()
  .datetime({ message: 'Invalid timestamp format' })
  .or(z.date());

/**
 * Trading endpoint validation schemas
 */

// Get positions query schema
export const getPositionsSchema = z.object({
  status: positionStatusSchema.optional(),
  instrument_id: instrumentIdSchema.optional(),
  side: positionSideSchema.optional(),
  limit: z.number().int().positive().max(1000).optional().default(100),
  offset: z.number().int().nonnegative().optional().default(0),
}).optional();

// Get orders query schema
export const getOrdersSchema = z.object({
  status: orderStatusSchema.optional(),
  instrument_id: instrumentIdSchema.optional(),
  side: orderSideSchema.optional(),
  order_type: orderTypeSchema.optional(),
  limit: z.number().int().positive().max(1000).optional().default(100),
  offset: z.number().int().nonnegative().optional().default(0),
  from_date: timestampSchema.optional(),
  to_date: timestampSchema.optional(),
}).optional();

// Get trades query schema
export const getTradesSchema = z.object({
  instrument_id: instrumentIdSchema.optional(),
  side: orderSideSchema.optional(),
  limit: z.number().int().positive().max(1000).optional().default(100),
  offset: z.number().int().nonnegative().optional().default(0),
  from_date: timestampSchema.optional(),
  to_date: timestampSchema.optional(),
}).optional();

// Open trade schema
export const openTradeSchema = z.object({
  instrument_id: instrumentIdSchema,
  side: orderSideSchema,
  order_type: orderTypeSchema,
  quantity: quantitySchema,
  price: priceSchema.optional(), // Required for LIMIT orders
  stop_price: priceSchema.optional(), // Required for STOP orders
  time_in_force: z.enum(['GTC', 'IOC', 'FOK', 'DAY']).optional().default('GTC'),
  reduce_only: z.boolean().optional().default(false),
}).refine(
  (data) => {
    // LIMIT orders must have price
    if (data.order_type === 'LIMIT' && !data.price) {
      return false;
    }
    // STOP orders must have stop_price
    if ((data.order_type === 'STOP' || data.order_type === 'STOP_LIMIT') && !data.stop_price) {
      return false;
    }
    // STOP_LIMIT orders must have both price and stop_price
    if (data.order_type === 'STOP_LIMIT' && (!data.price || !data.stop_price)) {
      return false;
    }
    return true;
  },
  {
    message: 'Invalid order parameters for order type',
  }
);

// Close trade schema
export const closeTradeSchema = z.object({
  position_id: z.string().min(1, 'Position ID is required'),
  quantity: quantitySchema.optional(), // If not provided, close entire position
  order_type: orderTypeSchema.optional().default('MARKET'),
  price: priceSchema.optional(), // For LIMIT close orders
});

// Modify order schema
export const modifyOrderSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  quantity: quantitySchema.optional(),
  price: priceSchema.optional(),
  stop_price: priceSchema.optional(),
}).refine(
  (data) => {
    // At least one field must be provided
    return data.quantity || data.price || data.stop_price;
  },
  {
    message: 'At least one field (quantity, price, or stop_price) must be provided',
  }
);

// Cancel order schema
export const cancelOrderSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
});

/**
 * Risk management validation schemas
 */

// Risk limits schema
export const riskLimitsSchema = z.object({
  max_position_size: positiveNumberSchema.optional(),
  max_leverage: positiveNumberSchema.max(100).optional(),
  max_concentration: z.number().min(0).max(1).optional(), // 0-1 (0-100%)
  max_daily_loss: positiveNumberSchema.optional(),
  max_drawdown: positiveNumberSchema.optional(),
});

// Update risk limits schema
export const updateRiskLimitsSchema = riskLimitsSchema.partial().refine(
  (data) => {
    // At least one field must be provided
    return Object.keys(data).length > 0;
  },
  {
    message: 'At least one risk limit must be provided',
  }
);

/**
 * User management validation schemas
 */

// User registration schema
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['admin', 'trader', 'viewer']).default('viewer'),
  name: z.string().min(1, 'Name is required').max(100),
});

// User login schema
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Update user schema
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['admin', 'trader', 'viewer']).optional(),
  active: z.boolean().optional(),
}).refine(
  (data) => {
    // At least one field must be provided
    return Object.keys(data).length > 0;
  },
  {
    message: 'At least one field must be provided',
  }
);

/**
 * Helper function to validate data against schema
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw error;
  }
}

/**
 * Helper function to safely validate data (returns result object)
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: messages };
    }
    return { success: false, error: 'Validation failed' };
  }
}

