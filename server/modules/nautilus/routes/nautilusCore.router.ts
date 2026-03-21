import { z } from "zod";
import { publicProcedure, router } from "../../../_core/trpc";
import * as bridge from "../../../bridge_client";

/**
 * Nautilus Core Router
 * All data comes from the persistent FastAPI bridge (bridge_client.ts)
 * instead of spawning subprocess python3 processes.
 */
export const nautilusCoreRouter = router({
  getSystemStatus: publicProcedure.query(async () => {
    try {
      return await bridge.getSystemStatus();
    } catch {
      return { status: "error", message: "Bridge unavailable" };
    }
  }),

  getSystemMetrics: publicProcedure.query(async () => {
    try {
      return await bridge.getSystemMetrics();
    } catch {
      return { error: "Bridge unavailable" };
    }
  }),

  getTradingMetrics: publicProcedure.query(async () => {
    try {
      return await bridge.getTradingMetrics();
    } catch {
      return { error: "Bridge unavailable" };
    }
  }),

  getAllComponents: publicProcedure.query(async () => {
    try {
      return await bridge.getAllComponents();
    } catch {
      return [];
    }
  }),

  getComponentStatus: publicProcedure
    .input(z.object({ component: z.string() }))
    .query(async ({ input }) => {
      try {
        return await bridge.getComponent(input.component);
      } catch {
        return { error: "Component not found or bridge unavailable" };
      }
    }),

  restartComponent: publicProcedure
    .input(z.object({ component: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await bridge.restartComponent(input.component);
      } catch (e: unknown) {
        return { success: false, message: String(e) };
      }
    }),

  stopComponent: publicProcedure
    .input(z.object({ component: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await bridge.stopComponent(input.component);
      } catch (e: unknown) {
        return { success: false, message: String(e) };
      }
    }),

  startComponent: publicProcedure
    .input(z.object({ component: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await bridge.startComponent(input.component);
      } catch (e: unknown) {
        return { success: false, message: String(e) };
      }
    }),

  emergencyStopAll: publicProcedure.mutation(async () => {
    try {
      return await bridge.emergencyStopAll();
    } catch (e: unknown) {
      return { success: false, message: String(e) };
    }
  }),

  getLogs: publicProcedure
    .input(
      z.object({
        component: z.string().optional(),
        level: z.string().default("INFO"),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      try {
        return await bridge.getLogs(input);
      } catch {
        return [];
      }
    }),

  getAllFeatures: publicProcedure.query(async () => {
    try {
      return await bridge.getAllFeatures();
    } catch {
      return { features: [], total: 0 };
    }
  }),

  getFeatureStatusSummary: publicProcedure.query(async () => {
    try {
      return await bridge.getFeatureSummary();
    } catch {
      return { available: 0, configured: 0, requires_config: 0, requires_data: 0 };
    }
  }),

  checkBridgeHealth: publicProcedure.query(async () => {
    try {
      return await bridge.checkBridgeHealth();
    } catch {
      return { status: "unreachable", nautilus_available: false };
    }
  }),
});
