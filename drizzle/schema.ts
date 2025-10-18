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

// Strategies table
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
