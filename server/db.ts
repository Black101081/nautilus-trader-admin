import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, strategies, backtests, InsertStrategy, InsertBacktest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Strategy queries
export async function createStrategy(strategy: InsertStrategy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(strategies).values(strategy);
}

export async function getStrategies(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(strategies).where(eq(strategies.createdBy, userId));
}

export async function getStrategy(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(strategies).where(eq(strategies.id, id)).limit(1);
  return result[0];
}

export async function updateStrategy(id: string, updates: Partial<InsertStrategy>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(strategies).set(updates).where(eq(strategies.id, id));
}

export async function deleteStrategy(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(strategies).where(eq(strategies.id, id));
}

// Backtest queries
export async function createBacktest(backtest: InsertBacktest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(backtests).values(backtest);
}

export async function getBacktests(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(backtests).where(eq(backtests.createdBy, userId));
}

export async function getAllBacktests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(backtests);
}

export async function getBacktest(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(backtests).where(eq(backtests.id, id)).limit(1);
  return result[0];
}

export async function updateBacktest(id: string, updates: Partial<InsertBacktest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(backtests).set(updates).where(eq(backtests.id, id));
}

export async function deleteBacktest(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(backtests).where(eq(backtests.id, id));
}
