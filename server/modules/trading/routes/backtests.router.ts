import { z } from "zod";
import { nanoid } from "nanoid";
import { publicProcedure, router } from "../../../_core/trpc";
import * as db from "../../../db";
import * as bridge from "../../../bridge_client";

/**
 * Backtests Router
 * Handles backtest CRUD and execution.
 * Backtest runs now go through bridge_client → FastAPI bridge
 * instead of spawning a Python subprocess per request.
 */
export const backtestsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllBacktests();
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getBacktest(input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        strategyId: z.string().optional(),
        strategyName: z.string(),
        instrument: z.string(),
        startingBalance: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const id = nanoid();
      await db.createBacktest({
        id,
        ...input,
        status: "running",
        createdBy: "system",
      });
      return { id };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["running", "completed", "failed"]).optional(),
        endingBalance: z.string().optional(),
        totalTrades: z.string().optional(),
        winRate: z.string().optional(),
        profitLoss: z.string().optional(),
        results: z.string().optional(),
        logs: z.string().optional(),
        error: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const updateData: Record<string, unknown> = { ...updates };
      if (updates.status === "completed" || updates.status === "failed") {
        updateData.completedAt = new Date();
      }
      await db.updateBacktest(id, updateData);
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.deleteBacktest(input.id);
      return { success: true };
    }),

  /**
   * Run a backtest via the persistent FastAPI bridge.
   * Creates a DB record, calls bridge, and updates the record on completion.
   */
  run: publicProcedure
    .input(
      z.object({
        strategyId: z.string().optional(),
        strategyName: z.string(),
        instrument: z.string(),
        startingBalance: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const backtestId = nanoid();

      await db.createBacktest({
        id: backtestId,
        strategyId: input.strategyId,
        strategyName: input.strategyName,
        instrument: input.instrument,
        startingBalance: input.startingBalance,
        status: "running",
        createdBy: "system",
      });

      // Fire-and-forget: call bridge asynchronously, update DB when done
      bridge
        .runBacktest({
          strategy_name: input.strategyName,
          instrument: input.instrument,
          starting_balance: parseFloat(input.startingBalance),
          start_date: input.startDate,
          end_date: input.endDate,
        })
        .then(async (result) => {
          const r = result as Record<string, unknown>;
          const nested = (r.result ?? {}) as Record<string, unknown>;
          await db.updateBacktest(backtestId, {
            status: r.success ? "completed" : "failed",
            endingBalance: String(nested.ending_balance ?? input.startingBalance),
            totalTrades: String(nested.total_trades ?? "0"),
            winRate: String(nested.win_rate ?? "0"),
            profitLoss: String(nested.profit_loss ?? "0"),
            results: JSON.stringify(result),
            completedAt: new Date(),
          });
        })
        .catch(async (err) => {
          await db.updateBacktest(backtestId, {
            status: "failed",
            error: String(err),
            completedAt: new Date(),
          });
        });

      return { id: backtestId };
    }),
});
