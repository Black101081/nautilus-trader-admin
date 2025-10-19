import { eq, desc, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  systemLogs,
  auditTrail,
  apiKeys,
  riskLimits,
  liveTrades,
  positions,
  performanceMetrics,
  strategies,
  backtests,
} from "../drizzle/schema";
import { randomBytes } from "crypto";

// ============ System Logs ============

export async function createSystemLog(data: {
  level: "info" | "warning" | "error" | "critical";
  category?: string;
  message: string;
  metadata?: any;
  userId?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const id = randomBytes(16).toString("hex");
  await db.insert(systemLogs).values({
    id,
    level: data.level,
    category: data.category,
    message: data.message,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    userId: data.userId,
  });

  return id;
}

export async function getSystemLogs(filters?: {
  level?: string;
  category?: string;
  userId?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  try {
    let results;
    if (filters?.level) {
      results = await db.select().from(systemLogs)
        .where(eq(systemLogs.level, filters.level as any))
        .orderBy(desc(systemLogs.createdAt))
        .limit(filters?.limit || 100);
    } else {
      results = await db.select().from(systemLogs)
        .orderBy(desc(systemLogs.createdAt))
        .limit(filters?.limit || 100);
    }

    return results.map((log) => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    }));
  } catch (error) {
    console.error('getSystemLogs error:', error);
    return [];
  }
}

// ============ Audit Trail ============

export async function createAuditLog(data: {
  userId: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const id = randomBytes(16).toString("hex");
  await db.insert(auditTrail).values({
    id,
    userId: data.userId,
    action: data.action,
    resource: data.resource,
    resourceId: data.resourceId,
    details: data.details ? JSON.stringify(data.details) : null,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  });

  return id;
}

export async function getAuditTrail(filters?: {
  userId?: string;
  action?: string;
  resource?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  try {
    let results;
    if (filters?.userId) {
      results = await db.select().from(auditTrail)
        .where(eq(auditTrail.userId, filters.userId))
        .orderBy(desc(auditTrail.createdAt))
        .limit(filters?.limit || 100);
    } else {
      results = await db.select().from(auditTrail)
        .orderBy(desc(auditTrail.createdAt))
        .limit(filters?.limit || 100);
    }

    return results.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    }));
  } catch (error) {
    console.error('getAuditTrail error:', error);
    return [];
  }
}

// ============ Risk Limits ============

export async function createRiskLimit(data: {
  userId?: string;
  type: "daily_loss" | "position_size" | "max_drawdown" | "concentration";
  value: string;
  enabled?: "yes" | "no";
}) {
  const db = await getDb();
  if (!db) return null;

  const id = randomBytes(16).toString("hex");
  await db.insert(riskLimits).values({
    id,
    userId: data.userId,
    type: data.type,
    value: data.value,
    enabled: data.enabled || "yes",
  });

  return id;
}

export async function getRiskLimits(userId?: string) {
  const db = await getDb();
  if (!db) return [];

  if (userId) {
    return await db.select().from(riskLimits).where(eq(riskLimits.userId, userId));
  }

  return await db.select().from(riskLimits);
}

export async function updateRiskLimit(id: string, data: { value?: string; enabled?: "yes" | "no" }) {
  const db = await getDb();
  if (!db) return false;

  await db.update(riskLimits).set(data).where(eq(riskLimits.id, id));
  return true;
}

// ============ Live Trades ============

export async function createLiveTrade(data: {
  userId: string;
  strategyId?: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: string;
  entryPrice: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const id = randomBytes(16).toString("hex");
  await db.insert(liveTrades).values({
    id,
    userId: data.userId,
    strategyId: data.strategyId,
    symbol: data.symbol,
    side: data.side,
    quantity: data.quantity,
    entryPrice: data.entryPrice,
    status: "open",
  });

  return id;
}

export async function closeLiveTrade(id: string, exitPrice: string, pnl: string) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(liveTrades)
    .set({
      exitPrice,
      pnl,
      status: "closed",
      exitTime: new Date(),
    })
    .where(eq(liveTrades.id, id));

  return true;
}

export async function getLiveTrades(filters?: {
  userId?: string;
  strategyId?: string;
  status?: "open" | "closed" | "cancelled";
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(liveTrades);

  const conditions = [];
  if (filters?.userId) conditions.push(eq(liveTrades.userId, filters.userId));
  if (filters?.strategyId) conditions.push(eq(liveTrades.strategyId, filters.strategyId));
  if (filters?.status) conditions.push(eq(liveTrades.status, filters.status));

  if (conditions.length > 0) {
    return await db.select().from(liveTrades).where(and(...conditions)).orderBy(desc(liveTrades.createdAt)).limit(filters?.limit || 100);
  }

  return await db.select().from(liveTrades).orderBy(desc(liveTrades.createdAt)).limit(filters?.limit || 100);
}

// ============ Positions ============

export async function upsertPosition(data: {
  userId: string;
  strategyId?: string;
  symbol: string;
  quantity: string;
  avgPrice: string;
  currentPrice?: string;
  unrealizedPnl?: string;
  realizedPnl?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  // Check if position exists
  const existing = await db
    .select()
    .from(positions)
    .where(
      and(
        eq(positions.userId, data.userId),
        eq(positions.symbol, data.symbol),
        data.strategyId ? eq(positions.strategyId, data.strategyId) : sql`1=1`
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing position
    await db
      .update(positions)
      .set({
        quantity: data.quantity,
        avgPrice: data.avgPrice,
        currentPrice: data.currentPrice,
        unrealizedPnl: data.unrealizedPnl,
        realizedPnl: data.realizedPnl,
        updatedAt: new Date(),
      })
      .where(eq(positions.id, existing[0].id));

    return existing[0].id;
  } else {
    // Create new position
    const id = randomBytes(16).toString("hex");
    await db.insert(positions).values({
      id,
      ...data,
    });

    return id;
  }
}

export async function getPositions(filters?: {
  userId?: string;
  strategyId?: string;
  symbol?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(positions);

  const conditions = [];
  if (filters?.userId) conditions.push(eq(positions.userId, filters.userId));
  if (filters?.strategyId) conditions.push(eq(positions.strategyId, filters.strategyId));
  if (filters?.symbol) conditions.push(eq(positions.symbol, filters.symbol));

  if (conditions.length > 0) {
    return await db.select().from(positions).where(and(...conditions)).orderBy(desc(positions.updatedAt));
  }

  return await db.select().from(positions).orderBy(desc(positions.updatedAt));
}

export async function deletePosition(id: string) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(positions).where(eq(positions.id, id));
  return true;
}

// ============ Performance Metrics ============

export async function createPerformanceMetric(data: {
  userId: string;
  strategyId?: string;
  period: "daily" | "weekly" | "monthly" | "all_time";
  totalReturn?: string;
  sharpeRatio?: string;
  sortinoRatio?: string;
  maxDrawdown?: string;
  winRate?: string;
  profitFactor?: string;
  totalTrades?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const id = randomBytes(16).toString("hex");
  await db.insert(performanceMetrics).values({
    id,
    ...data,
  });

  return id;
}

export async function getPerformanceMetrics(filters?: {
  userId?: string;
  strategyId?: string;
  period?: "daily" | "weekly" | "monthly" | "all_time";
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(performanceMetrics);

  const conditions = [];
  if (filters?.userId) conditions.push(eq(performanceMetrics.userId, filters.userId));
  if (filters?.strategyId) conditions.push(eq(performanceMetrics.strategyId, filters.strategyId));
  if (filters?.period) conditions.push(eq(performanceMetrics.period, filters.period));

  if (conditions.length > 0) {
    return await db.select().from(performanceMetrics).where(and(...conditions)).orderBy(desc(performanceMetrics.createdAt)).limit(filters?.limit || 50);
  }

  return await db.select().from(performanceMetrics).orderBy(desc(performanceMetrics.createdAt)).limit(filters?.limit || 50);
}

// ============ System Stats ============

export async function getSystemStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalStrategies: 0, totalBacktests: 0, totalLiveTrades: 0, openPositions: 0, systemLogsCount: 0 };

  try {
    const [
      totalUsers,
      totalStrategies,
      totalBacktests,
      totalLiveTrades,
      openPositions,
      systemLogsCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(systemLogs).then((r) => r[0]?.count || 0),
      db.select({ count: sql<number>`count(*)` }).from(strategies).then((r) => r[0]?.count || 0),
      db.select({ count: sql<number>`count(*)` }).from(backtests).then((r) => r[0]?.count || 0),
      db.select({ count: sql<number>`count(*)` }).from(liveTrades).then((r) => r[0]?.count || 0),
      db
        .select({ count: sql<number>`count(*)` })
        .from(positions)
        .then((r) => r[0]?.count || 0),
      db
        .select({ count: sql<number>`count(*)` })
        .from(systemLogs)
        .where(eq(systemLogs.level, "error"))
        .then((r) => r[0]?.count || 0),
    ]);

    return {
      totalUsers,
      totalStrategies,
      totalBacktests,
      totalLiveTrades,
      openPositions,
      systemLogsCount,
    };
  } catch (error) {
    console.error('getSystemStats error:', error);
    return { totalUsers: 0, totalStrategies: 0, totalBacktests: 0, totalLiveTrades: 0, openPositions: 0, systemLogsCount: 0 };
  }
}

