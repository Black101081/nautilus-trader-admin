import { COOKIE_NAME } from "@shared/const";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  nautilus: router({
    version: publicProcedure.query(async () => {
      return new Promise((resolve, reject) => {
        const pythonPath = "python3.11";
        const scriptPath = path.join(__dirname, "nautilus_api.py");
        const proc = spawn(pythonPath, ["-c", "import nautilus_trader; print(nautilus_trader.__version__)"]);
        
        let output = "";
        let error = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.stderr.on("data", (data) => {
          error += data.toString();
        });
        
        proc.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true, version: output.trim() });
          } else {
            resolve({ success: false, error: error || "Unknown error" });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          reject(new Error("Timeout"));
        }, 5000);
      });
    }),
    
    systemInfo: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const scriptPath = path.join(__dirname, "nautilus_api.py");
        const code = `
import json
from nautilus_api import get_system_info
print(json.dumps(get_system_info()))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: __dirname,
          env: { ...process.env, PYTHONPATH: __dirname }
        });
        
        let output = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.on("close", () => {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            resolve({ success: false, error: "Failed to parse output" });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          resolve({ success: false, error: "Timeout" });
        }, 5000);
      });
    }),
    
    runBacktest: publicProcedure.mutation(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
from nautilus_api import run_simple_backtest
print(json.dumps(run_simple_backtest()))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: __dirname,
          env: { ...process.env, PYTHONPATH: __dirname }
        });
        
        let output = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.on("close", () => {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            resolve({ success: false, error: "Failed to parse output", raw: output });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          resolve({ success: false, error: "Timeout" });
        }, 10000);
      });
    }),
    
    listIndicators: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
from nautilus_api import list_available_indicators
print(json.dumps(list_available_indicators()))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: __dirname,
          env: { ...process.env, PYTHONPATH: __dirname }
        });
        
        let output = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.on("close", () => {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            resolve({ success: false, error: "Failed to parse output" });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          resolve({ success: false, error: "Timeout" });
        }, 5000);
      });
    }),
  }),

  strategies: router({
    list: publicProcedure.query(async () => {
      const allStrategies = await db.getStrategies("system");
      return allStrategies;
    }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getStrategy(input.id);
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        code: z.string(),
        parameters: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createStrategy({
          id,
          ...input,
          createdBy: "system",
        });
        return { id };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        code: z.string().optional(),
        parameters: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateStrategy(id, { ...updates, updatedAt: new Date() });
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteStrategy(input.id);
        return { success: true };
      }),
  }),

  backtests: router({
    list: publicProcedure.query(async () => {
      return await db.getAllBacktests();
    }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getBacktest(input.id);
      }),

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

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteBacktest(input.id);
        return { success: true };
      }),

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
        const code = `
import json
from nautilus_api import run_simple_backtest
result = run_simple_backtest()
print(json.dumps(result))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: path.join(__dirname),
          env: { ...process.env, PYTHONPATH: __dirname }
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
  }),
});

export type AppRouter = typeof appRouter;
