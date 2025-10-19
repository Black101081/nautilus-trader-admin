/**
 * Modular App Router
 * 
 * This is the new modular version of appRouter that uses the modules/ structure.
 * All routers have been successfully migrated from the monolithic routers.ts file.
 * 
 * Migration status:
 * - ✅ auth: Migrated to modules/auth
 * - ✅ analytics: Migrated to modules/analytics
 * - ✅ trading: Migrated to modules/trading
 * - ✅ admin: Migrated to modules/admin
 * - ✅ nautilus: Migrated to modules/nautilus
 * - ✅ strategies: Migrated to modules/trading
 * - ✅ backtests: Migrated to modules/trading
 * - ✅ risk: Migrated to modules/trading
 * - ✅ nautilusCore: Migrated to modules/nautilus
 */

import { router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";

// Import all modular routers
import { 
  authRouter, 
  analyticsRouter, 
  tradingRouter, 
  adminRouter,
  nautilusRouter,
  strategiesRouter,
  backtestsRouter,
  riskRouter,
  nautilusCoreRouter
} from "./modules";

/**
 * Modular App Router
 * Combines new modular routers with legacy routers
 */
export const appRouter = router({
  // System router (core functionality)
  system: systemRouter,
  
  // ✅ All routers (modular structure)
  auth: authRouter,
  analytics: analyticsRouter,
  trading: tradingRouter,
  admin: adminRouter,
  nautilus: nautilusRouter,
  strategies: strategiesRouter,
  backtests: backtestsRouter,
  risk: riskRouter,
  nautilusCore: nautilusCoreRouter,
});

export type AppRouter = typeof appRouter;

