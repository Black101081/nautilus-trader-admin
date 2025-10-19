/**
 * Modular App Router
 * 
 * This is the new modular version of appRouter that uses the modules/ structure.
 * It gradually replaces the monolithic routers.ts file.
 * 
 * Migration status:
 * - ✅ auth: Migrated to modules/auth
 * - ✅ analytics: Migrated to modules/analytics
 * - ⏳ trading: TODO
 * - ⏳ admin: TODO
 * - ⏳ nautilus: TODO
 * - ⏳ strategies: TODO
 * - ⏳ backtests: TODO
 * - ⏳ risk: TODO
 */

import { router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";

// Import modular routers
import { authRouter, analyticsRouter } from "./modules";

// Import legacy routers (to be migrated)
import { appRouter as legacyRouter } from "./routers";

/**
 * Modular App Router
 * Combines new modular routers with legacy routers
 */
export const appRouter = router({
  // System router (core functionality)
  system: systemRouter,
  
  // ✅ Modular routers (new structure)
  auth: authRouter,
  analytics: analyticsRouter,
  
  // ⏳ Legacy routers (to be migrated)
  nautilus: legacyRouter.nautilus,
  strategies: legacyRouter.strategies,
  backtests: legacyRouter.backtests,
  admin: legacyRouter.admin,
  risk: legacyRouter.risk,
  trading: legacyRouter.trading,
  nautilusCore: legacyRouter.nautilusCore,
});

export type AppRouter = typeof appRouter;

