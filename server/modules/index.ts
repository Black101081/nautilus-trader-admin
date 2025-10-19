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
export { adminRouter } from "./admin";

// Trading module routers
export { tradingRouter, strategiesRouter, backtestsRouter, riskRouter } from "./trading";

// Nautilus module routers
export { nautilusRouter, nautilusCoreRouter } from "./nautilus";

