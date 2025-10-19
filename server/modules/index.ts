/**
 * Modules Index
 * Central export point for all modular routers
 * 
 * This file exports routers from the new modular structure.
 * Modules are organized by domain:
 * - auth: Authentication and session management
 * - analytics: Performance metrics and reporting
 * - trading: Trading operations (positions, orders, trades)
 * - admin: Administrative functions
 * - nautilus: Nautilus Trader integration
 */

// Export modular routers
export { authRouter } from "./auth";
export { analyticsRouter } from "./analytics";

// TODO: Migrate remaining routers from ../routers.ts
// - tradingRouter (positions, orders, trades)
// - adminRouter (system management)
// - nautilusRouter (Nautilus integration)
// - strategiesRouter (strategy management)
// - backtestsRouter (backtesting)
// - riskRouter (risk management)

