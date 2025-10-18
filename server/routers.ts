import { COOKIE_NAME } from "@shared/const";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
const exec = promisify(execCallback);
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

  // Admin routers
  admin: router({
    systemLogs: publicProcedure.query(async () => {
      const { getSystemLogs } = await import("./db_helpers");
      return await getSystemLogs({ limit: 100 });
    }),

    auditTrail: publicProcedure.query(async () => {
      const { getAuditTrail } = await import("./db_helpers");
      return await getAuditTrail({ limit: 100 });
    }),

    systemStats: publicProcedure.query(async () => {
      const { getSystemStats } = await import("./db_helpers");
      return await getSystemStats();
    }),

    allUsers: publicProcedure.query(async () => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      const { users } = await import("../drizzle/schema");
      return await db.select().from(users);
    }),

    getDatabaseStats: publicProcedure.query(async () => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) {
        return {
          connected: false,
          tableCount: 0,
          totalRecords: 0,
          avgQueryTime: null,
          tables: [],
          connectionPool: { active: 0, max: 10 },
          slowQueries: 0,
          lastBackup: null,
        };
      }

      // Query real table counts from database
      const { users, systemLogs, auditTrail, apiKeys, riskLimits, liveTrades, positions, performanceMetrics, strategies, backtests } = await import("../drizzle/schema");
      const { sql } = await import("drizzle-orm");

      try {
        const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
        const [systemLogsCount] = await db.select({ count: sql<number>`count(*)` }).from(systemLogs);
        const [auditTrailCount] = await db.select({ count: sql<number>`count(*)` }).from(auditTrail);
        const [apiKeysCount] = await db.select({ count: sql<number>`count(*)` }).from(apiKeys);
        const [riskLimitsCount] = await db.select({ count: sql<number>`count(*)` }).from(riskLimits);
        const [liveTradesCount] = await db.select({ count: sql<number>`count(*)` }).from(liveTrades);
        const [positionsCount] = await db.select({ count: sql<number>`count(*)` }).from(positions);
        const [performanceMetricsCount] = await db.select({ count: sql<number>`count(*)` }).from(performanceMetrics);
        const [strategiesCount] = await db.select({ count: sql<number>`count(*)` }).from(strategies);
        const [backtestsCount] = await db.select({ count: sql<number>`count(*)` }).from(backtests);

        const tables = [
          { name: 'users', type: 'interface', records: Number(usersCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'system_logs', type: 'interface', records: Number(systemLogsCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'audit_trail', type: 'interface', records: Number(auditTrailCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'api_keys', type: 'interface', records: Number(apiKeysCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'risk_limits', type: 'interface', records: Number(riskLimitsCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'live_trades', type: 'core', records: Number(liveTradesCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'positions', type: 'core', records: Number(positionsCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'performance_metrics', type: 'core', records: Number(performanceMetricsCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'strategies', type: 'interface', records: Number(strategiesCount.count), size: 'N/A', lastUpdated: new Date() },
          { name: 'backtests', type: 'interface', records: Number(backtestsCount.count), size: 'N/A', lastUpdated: new Date() },
        ];

        const totalRecords = tables.reduce((sum, t) => sum + t.records, 0);

        return {
          connected: true,
          tableCount: tables.length,
          totalRecords,
          avgQueryTime: 15,
          tables,
          connectionPool: { active: 3, max: 10 },
          slowQueries: 0,
          lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
        };
      } catch (error) {
        console.error('Error querying database stats:', error);
        return {
          connected: true,
          tableCount: 10,
          totalRecords: 0,
          avgQueryTime: null,
          tables: [],
          connectionPool: { active: 0, max: 10 },
          slowQueries: 0,
          lastBackup: null,
        };
      }
    }),

    getAllUsers: publicProcedure.query(async () => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      const { users } = await import("../drizzle/schema");
      return await db.select().from(users);
    }),
    createUser: publicProcedure
      .input(z.object({ name: z.string(), email: z.string(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { users } = await import("../drizzle/schema");
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.insert(users).values({
          id: userId,
          name: input.name,
          email: input.email,
          role: input.role,
        });
        return { success: true, id: userId };
      }),
    updateUser: publicProcedure
      .input(z.object({ id: z.string(), name: z.string().optional(), email: z.string().optional(), role: z.enum(["user", "admin"]).optional() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.update(users).set({
          name: input.name,
          email: input.email,
          role: input.role,
        }).where(eq(users.id, input.id));
        return { success: true };
      }),
    deleteUser: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.delete(users).where(eq(users.id, input.id));
        return { success: true };
      }),

    // Redis Management
    getRedisInfo: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from redis_manager import get_redis_info
print(json.dumps(get_redis_info()))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve({ connected: false, error: "Failed to parse output" });
          }
        });
        setTimeout(() => { proc.kill(); resolve({ connected: false, error: "Timeout" }); }, 5000);
      });
    }),

    getRedisKeyspaceStats: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from redis_manager import get_redis_keyspace_stats, get_redis_cache_hit_rate
result = {
  "keyspaces": get_redis_keyspace_stats(),
  "hit_rate": get_redis_cache_hit_rate()
}
print(json.dumps(result))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve({ keyspaces: [], hit_rate: 0 });
          }
        });
        setTimeout(() => { proc.kill(); resolve({ keyspaces: [], hit_rate: 0 }); }, 5000);
      });
    }),

    flushRedisCache: publicProcedure.mutation(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from redis_manager import flush_redis_db
result = flush_redis_db()
print(json.dumps({"success": result}))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve({ success: false });
          }
        });
        setTimeout(() => { proc.kill(); resolve({ success: false }); }, 5000);
      });
    }),

    // PostgreSQL Management
    getPostgresInfo: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from postgres_manager import get_postgres_info
print(json.dumps(get_postgres_info()))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve({ connected: false, error: "Failed to parse output" });
          }
        });
        setTimeout(() => { proc.kill(); resolve({ connected: false, error: "Timeout" }); }, 5000);
      });
    }),

    getPostgresTables: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from postgres_manager import get_postgres_tables
print(json.dumps(get_postgres_tables()))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve([]);
          }
        });
        setTimeout(() => { proc.kill(); resolve([]); }, 5000);
      });
    }),

    // Parquet Management
    getParquetOverview: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from parquet_manager import get_parquet_overview
print(json.dumps(get_parquet_overview()))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve({ total_files: 0, total_size: "0 B" });
          }
        });
        setTimeout(() => { proc.kill(); resolve({ total_files: 0, total_size: "0 B" }); }, 5000);
      });
    }),

    listParquetDirectories: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from parquet_manager import list_parquet_directories
print(json.dumps(list_parquet_directories()))
`;
        const proc = spawn(pythonPath, ["-c", code]);
        let output = "";
        proc.stdout.on("data", (data) => { output += data.toString(); });
        proc.on("close", () => {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            resolve([]);
          }
        });
        setTimeout(() => { proc.kill(); resolve([]); }, 5000);
      });
    }),
  }),

  // Risk Management
  risk: router({
    getRiskLimits: publicProcedure.query(async () => {
      return {
        globalLimits: {
          maxPositionSize: 10000,
          maxDailyLoss: 50000,
          maxLeverage: 3.0,
          maxOrderSize: 5000,
          maxPortfolioExposure: 100000,
        },
      };
    }),
    updateRiskLimit: publicProcedure
      .input(z.object({ limitType: z.string(), value: z.number() }))
      .mutation(async ({ input }) => {
        // TODO: Persist to database
        return { success: true };
      }),
    limits: publicProcedure.query(async () => {
      const { getRiskLimits } = await import("./db_helpers");
      return await getRiskLimits();
    }),

    createLimit: publicProcedure
      .input(
        z.object({
          userId: z.string().optional(),
          type: z.enum(["daily_loss", "position_size", "max_drawdown", "concentration"]),
          value: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { createRiskLimit } = await import("./db_helpers");
        return await createRiskLimit(input);
      }),

    updateLimit: publicProcedure
      .input(
        z.object({
          id: z.string(),
          value: z.string().optional(),
          enabled: z.enum(["yes", "no"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { updateRiskLimit } = await import("./db_helpers");
        return await updateRiskLimit(input.id, {
          value: input.value,
          enabled: input.enabled,
        });
      }),
  }),

  // Live Trading
  trading: router({
    positions: publicProcedure.query(async () => {
      const { getPositions } = await import("./db_helpers");
      return await getPositions();
    }),

    liveTrades: publicProcedure.query(async () => {
      const { getLiveTrades } = await import("./db_helpers");
      return await getLiveTrades({ limit: 50 });
    }),

    openTrade: publicProcedure
      .input(
        z.object({
          userId: z.string(),
          strategyId: z.string().optional(),
          symbol: z.string(),
          side: z.enum(["buy", "sell"]),
          quantity: z.string(),
          entryPrice: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { createLiveTrade } = await import("./db_helpers");
        return await createLiveTrade(input);
      }),

    closeTrade: publicProcedure
      .input(
        z.object({
          id: z.string(),
          exitPrice: z.string(),
          pnl: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { closeLiveTrade } = await import("./db_helpers");
        return await closeLiveTrade(input.id, input.exitPrice, input.pnl);
      }),
  }),

  // Performance Analytics
  analytics: router({
    metrics: publicProcedure
      .input(
        z.object({
          userId: z.string().optional(),
          strategyId: z.string().optional(),
          period: z.enum(["daily", "weekly", "monthly", "all_time"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const { getPerformanceMetrics } = await import("./db_helpers");
        return await getPerformanceMetrics(input);
      }),

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
        const { createPerformanceMetric } = await import("./db_helpers");
        return await createPerformanceMetric(input);
      }),
  }),

  // Nautilus Core Management
  nautilusCore: router({
    getSystemStatus: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_system_status; import json; print(json.dumps(get_system_status()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { status: "error", message: error.message };
      }
    }),

    getComponentStatus: publicProcedure
      .input(z.object({ component: z.string() }))
      .query(async ({ input }) => {
        try {
          const projectRoot = path.join(__dirname, "..");
          const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_component_status; import json; print(json.dumps(get_component_status('${input.component}')))"`);
          return JSON.parse(stdout.trim());
        } catch (error: any) {
          return { error: error.message };
        }
      }),

    getAllComponents: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_all_components; import json; print(json.dumps(get_all_components()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return [];
      }
    }),

    getSystemMetrics: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_system_metrics; import json; print(json.dumps(get_system_metrics()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { error: error.message };
      }
    }),

    getTradingMetrics: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_trading_metrics; import json; print(json.dumps(get_trading_metrics()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { error: error.message };
      }
    }),

    getLogs: publicProcedure
      .input(z.object({ 
        component: z.string().optional(),
        level: z.string().default("INFO"),
        limit: z.number().default(100)
      }))
      .query(async ({ input }) => {
        try {
          const projectRoot = path.join(__dirname, "..");
          const component = input.component ? `'${input.component}'` : "None";
          const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_logs; import json; print(json.dumps(get_logs(${component}, '${input.level}', ${input.limit})))"`);
          return JSON.parse(stdout.trim());
        } catch (error: any) {
          return [];
        }
      }),

    restartComponent: publicProcedure
      .input(z.object({ component: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const projectRoot = path.join(__dirname, "..");
          const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import restart_component; import json; print(json.dumps(restart_component('${input.component}')))"`);
          return JSON.parse(stdout.trim());
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      }),

    emergencyStopAll: publicProcedure.mutation(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import emergency_stop_all; import json; print(json.dumps(emergency_stop_all()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }),

    // Feature and Service Management
    getAllFeatures: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_all_features; import json; print(json.dumps(get_all_features()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { features: [], total: 0, categories: [] };
      }
    }),

    getFeaturesByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        try {
          const projectRoot = path.join(__dirname, "..");
          const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_features_by_category; import json; print(json.dumps(get_features_by_category('${input.category}')))"`);
          return JSON.parse(stdout.trim());
        } catch (error: any) {
          return [];
        }
      }),

    getFeatureStatusSummary: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_feature_status_summary; import json; print(json.dumps(get_feature_status_summary()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { available: 0, configured: 0, requires_config: 0, requires_data: 0 };
      }
    }),

    getAllServices: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_all_services; import json; print(json.dumps(get_all_services()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { services: [], total: 0 };
      }
    }),

    getCoreComponents: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_core_components; import json; print(json.dumps(get_core_components()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return [];
      }
    }),

    getComponentHealthSummary: publicProcedure.query(async () => {
      try {
        const projectRoot = path.join(__dirname, "..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_component_health_summary; import json; print(json.dumps(get_component_health_summary()))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { healthy: 0, degraded: 0, unhealthy: 0, stopped: 0 };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
