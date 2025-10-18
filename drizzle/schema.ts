import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// System Logs for Admin Monitoring
export const systemLogs = mysqlTable("system_logs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  level: mysqlEnum("level", ["info", "warning", "error", "critical"]).notNull(),
  category: varchar("category", { length: 64 }),
  message: text("message").notNull(),
  metadata: text("metadata"), // JSON string
  userId: varchar("userId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Audit Trail for Compliance
export const auditTrail = mysqlTable("audit_trail", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  resource: varchar("resource", { length: 128 }),
  resourceId: varchar("resourceId", { length: 64 }),
  details: text("details"), // JSON string
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// API Keys for programmatic access
export const apiKeys = mysqlTable("api_keys", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  keyHash: varchar("keyHash", { length: 128 }).notNull(),
  permissions: text("permissions"), // JSON array
  lastUsedAt: timestamp("lastUsedAt"),
  expiresAt: timestamp("expiresAt"),
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Risk Limits
export const riskLimits = mysqlTable("risk_limits", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }),
  type: mysqlEnum("type", ["daily_loss", "position_size", "max_drawdown", "concentration"]).notNull(),
  value: varchar("value", { length: 64 }).notNull(),
  enabled: mysqlEnum("enabled", ["yes", "no"]).default("yes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Live Trades
export const liveTrades = mysqlTable("live_trades", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  strategyId: varchar("strategyId", { length: 64 }),
  symbol: varchar("symbol", { length: 32 }).notNull(),
  side: mysqlEnum("side", ["buy", "sell"]).notNull(),
  quantity: varchar("quantity", { length: 64 }).notNull(),
  entryPrice: varchar("entryPrice", { length: 64 }).notNull(),
  exitPrice: varchar("exitPrice", { length: 64 }),
  pnl: varchar("pnl", { length: 64 }),
  status: mysqlEnum("status", ["open", "closed", "cancelled"]).default("open"),
  entryTime: timestamp("entryTime").defaultNow(),
  exitTime: timestamp("exitTime"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Positions
export const positions = mysqlTable("positions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  strategyId: varchar("strategyId", { length: 64 }),
  symbol: varchar("symbol", { length: 32 }).notNull(),
  quantity: varchar("quantity", { length: 64 }).notNull(),
  avgPrice: varchar("avgPrice", { length: 64 }).notNull(),
  currentPrice: varchar("currentPrice", { length: 64 }),
  unrealizedPnl: varchar("unrealizedPnl", { length: 64 }),
  realizedPnl: varchar("realizedPnl", { length: 64 }),
  updatedAt: timestamp("updatedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Performance Metrics
export const performanceMetrics = mysqlTable("performance_metrics", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  strategyId: varchar("strategyId", { length: 64 }),
  period: mysqlEnum("period", ["daily", "weekly", "monthly", "all_time"]).notNull(),
  totalReturn: varchar("totalReturn", { length: 64 }),
  sharpeRatio: varchar("sharpeRatio", { length: 64 }),
  sortinoRatio: varchar("sortinoRatio", { length: 64 }),
  maxDrawdown: varchar("maxDrawdown", { length: 64 }),
  winRate: varchar("winRate", { length: 64 }),
  profitFactor: varchar("profitFactor", { length: 64 }),
  totalTrades: varchar("totalTrades", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type SystemLog = typeof systemLogs.$inferSelect;
export type AuditTrail = typeof auditTrail.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type RiskLimit = typeof riskLimits.$inferSelect;
export type LiveTrade = typeof liveTrades.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;

export const strategies = mysqlTable("strategies", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  code: text("code").notNull(),
  parameters: text("parameters"), // JSON string
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = typeof strategies.$inferInsert;

// Backtests table
export const backtests = mysqlTable("backtests", {
  id: varchar("id", { length: 64 }).primaryKey(),
  strategyId: varchar("strategyId", { length: 64 }),
  strategyName: varchar("strategyName", { length: 255 }).notNull(),
  instrument: varchar("instrument", { length: 64 }).notNull(),
  startingBalance: varchar("startingBalance", { length: 64 }).notNull(),
  endingBalance: varchar("endingBalance", { length: 64 }),
  totalTrades: varchar("totalTrades", { length: 32 }),
  winRate: varchar("winRate", { length: 32 }),
  profitLoss: varchar("profitLoss", { length: 64 }),
  status: mysqlEnum("status", ["running", "completed", "failed"]).default("running").notNull(),
  results: text("results"), // JSON string
  logs: text("logs"),
  error: text("error"),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  completedAt: timestamp("completedAt"),
});

export type Backtest = typeof backtests.$inferSelect;
export type InsertBacktest = typeof backtests.$inferInsert;
