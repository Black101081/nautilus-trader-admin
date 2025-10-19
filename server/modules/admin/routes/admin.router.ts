import { z } from "zod";
import { spawn } from "child_process";
import { publicProcedure, router } from "../../../_core/trpc";

/**
 * Admin Router
 * Handles administrative functions: system logs, audit trail, database stats, users
 */
export const adminRouter = router({
  /**
   * Get system logs
   */
  systemLogs: publicProcedure.query(async () => {
    const { getSystemLogs } = await import("../../../db_helpers");
    return await getSystemLogs({ limit: 100 });
  }),

  /**
   * Get audit trail
   */
  auditTrail: publicProcedure.query(async () => {
    const { getAuditTrail } = await import("../../../db_helpers");
    return await getAuditTrail({ limit: 100 });
  }),

  /**
   * Get system statistics
   */
  systemStats: publicProcedure.query(async () => {
    const { getSystemStats } = await import("../../../db_helpers");
    return await getSystemStats();
  }),

  /**
   * Get all users
   */
  allUsers: publicProcedure.query(async () => {
    const { getDb } = await import("../../../db");
    const db = await getDb();
    if (!db) return [];
    const { users } = await import("../../../../drizzle/schema");
    return await db.select().from(users);
  }),

  /**
   * Get database statistics
   */
  getDatabaseStats: publicProcedure.query(async () => {
    const { getDb } = await import("../../../db");
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

    const { users, systemLogs, auditTrail, apiKeys, riskLimits, liveTrades, positions, performanceMetrics, strategies, backtests } = await import("../../../../drizzle/schema");
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
        { name: 'live_trades', type: 'interface', records: Number(liveTradesCount.count), size: 'N/A', lastUpdated: new Date() },
        { name: 'positions', type: 'interface', records: Number(positionsCount.count), size: 'N/A', lastUpdated: new Date() },
        { name: 'performance_metrics', type: 'interface', records: Number(performanceMetricsCount.count), size: 'N/A', lastUpdated: new Date() },
        { name: 'strategies', type: 'interface', records: Number(strategiesCount.count), size: 'N/A', lastUpdated: new Date() },
        { name: 'backtests', type: 'interface', records: Number(backtestsCount.count), size: 'N/A', lastUpdated: new Date() },
      ];

      const totalRecords = tables.reduce((sum, table) => sum + table.records, 0);

      return {
        connected: true,
        tableCount: tables.length,
        totalRecords,
        avgQueryTime: '< 10ms',
        tables,
        connectionPool: { active: 1, max: 10 },
        slowQueries: 0,
        lastBackup: new Date(),
      };
    } catch (error) {
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
  }),

  /**
   * Get PostgreSQL data directories
   */
  getPostgresDataDirs: publicProcedure.query(async () => {
    return new Promise((resolve) => {
      const pythonPath = "python3.11";
      const code = `
import json
import sys
sys.path.append('/home/ubuntu/nautilus-trader-demo/server')
from postgres_manager import list_postgres_directories
print(json.dumps(list_postgres_directories()))
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

  /**
   * Get Parquet data directories
   */
  getParquetDataDirs: publicProcedure.query(async () => {
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
});

