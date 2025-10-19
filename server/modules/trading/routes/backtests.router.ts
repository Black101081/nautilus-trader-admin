import { z } from "zod";
import { nanoid } from "nanoid";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { publicProcedure, router } from "../../../_core/trpc";
import * as db from "../../../db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Backtests Router
 * Handles backtest management and execution
 */
export const backtestsRouter = router({
  /**
   * List all backtests
   */
  list: publicProcedure.query(async () => {
    return await db.getAllBacktests();
  }),

  /**
   * Get a specific backtest by ID
   */
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getBacktest(input.id);
    }),

  /**
   * Create a new backtest
   */
  create: publicProcedure
    .input(z.object({
      strategyId: z.string().optional(),
      strategyName: z.string(),
      instrument: z.string(),
      startingBalance: z.string(),
    }))
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

  /**
   * Update an existing backtest
   */
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["running", "completed", "failed"]).optional(),
      endingBalance: z.string().optional(),
      totalTrades: z.string().optional(),
      winRate: z.string().optional(),
      profitLoss: z.string().optional(),
      results: z.string().optional(),
      logs: z.string().optional(),
      error: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const updateData: any = { ...updates };
      if (updates.status === "completed" || updates.status === "failed") {
        updateData.completedAt = new Date();
      }
      await db.updateBacktest(id, updateData);
      return { success: true };
    }),

  /**
   * Delete a backtest
   */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.deleteBacktest(input.id);
      return { success: true };
    }),

  /**
   * Run a backtest
   */
  run: publicProcedure
    .input(z.object({
      strategyId: z.string().optional(),
      strategyName: z.string(),
      instrument: z.string(),
      startingBalance: z.string(),
    }))
    .mutation(async ({ input }) => {
      const backtestId = nanoid();
      
      // Create backtest record
      await db.createBacktest({
        id: backtestId,
        ...input,
        status: "running",
        createdBy: "system",
      });

      // Run backtest in background
      const pythonPath = "python3.11";
      const serverDir = path.join(__dirname, "../../../");
      const code = `
import json
from nautilus_api import run_simple_backtest
result = run_simple_backtest()
print(json.dumps(result))
`;
      const proc = spawn(pythonPath, ["-c", code], {
        cwd: serverDir,
        env: { ...process.env, PYTHONPATH: serverDir }
      });
      
      let output = "";
      let logs = "";
      
      proc.stdout.on("data", (data) => {
        output += data.toString();
        logs += data.toString();
      });
      
      proc.stderr.on("data", (data) => {
        logs += data.toString();
      });
      
      proc.on("close", async (code) => {
        try {
          const result = JSON.parse(output);
          if (result.success) {
            await db.updateBacktest(backtestId, {
              status: "completed",
              endingBalance: result.starting_balance,
              totalTrades: "0",
              results: JSON.stringify(result),
              logs,
              completedAt: new Date(),
            });
          } else {
            await db.updateBacktest(backtestId, {
              status: "failed",
              error: result.error,
              logs,
              completedAt: new Date(),
            });
          }
        } catch (e) {
          await db.updateBacktest(backtestId, {
            status: "failed",
            error: "Failed to parse output",
            logs,
            completedAt: new Date(),
          });
        }
      });

      return { id: backtestId };
    }),
});

