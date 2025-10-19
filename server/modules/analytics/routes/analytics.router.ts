import { z } from "zod";
import { publicProcedure, router } from "../../../_core/trpc";

/**
 * Analytics Router
 * Handles performance metrics and analytics data
 */
export const analyticsRouter = router({
  /**
   * Get performance metrics
   * Supports filtering by user, strategy, and time period
   */
  metrics: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        strategyId: z.string().optional(),
        period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { getPerformanceMetrics } = await import("../../../db_helpers");
      return await getPerformanceMetrics(input);
    }),

  /**
   * Create a new performance metric entry
   */
  createMetric: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        strategyId: z.string().optional(),
        period: z.enum(["daily", "weekly", "monthly", "all_time"]),
        totalReturn: z.string().optional(),
        sharpeRatio: z.string().optional(),
        sortinoRatio: z.string().optional(),
        maxDrawdown: z.string().optional(),
        winRate: z.string().optional(),
        profitFactor: z.string().optional(),
        totalTrades: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { createPerformanceMetric } = await import("../../../db_helpers");
      return await createPerformanceMetric(input);
    }),
});

