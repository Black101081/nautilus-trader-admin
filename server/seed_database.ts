import { config } from "dotenv";
import { randomBytes } from "crypto";

// Load environment variables
config();
import { getDb } from "./db";
import {
  users,
  strategies,
  backtests,
  liveTrades,
  positions,
  performanceMetrics,
  systemLogs,
  auditTrail,
  apiKeys,
  riskLimits,
} from "../drizzle/schema";

// Helper to generate random ID
const genId = () => randomBytes(16).toString("hex");

// Helper to generate random number in range
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate random float
const randFloat = (min: number, max: number, decimals = 2) =>
  (Math.random() * (max - min) + min).toFixed(decimals);

// Helper to generate random date in past N days
const randDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - randInt(0, daysAgo));
  return date;
};

// Trading symbols
const SYMBOLS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
  "AUD/JPY",
  "BTC/USD",
  "ETH/USD",
  "AAPL",
  "GOOGL",
  "MSFT",
  "TSLA",
  "AMZN",
  "META",
];

// Strategy names based on Nautilus Trader examples
const STRATEGY_NAMES = [
  "EMACross",
  "OrderBookImbalance",
  "VolatilityMarketMaker",
  "MeanReversion",
  "TrendFollowing",
  "StatisticalArbitrage",
  "MarketMaking",
  "MomentumStrategy",
  "BreakoutStrategy",
  "GridTrading",
  "ScalpingStrategy",
  "SwingTrading",
  "PairsTrading",
  "DeltaNeutral",
  "HighFrequencyTrading",
];

async function seedUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding users...");

  const userRecords = [
    {
      id: genId(),
      name: "Admin User",
      email: "admin@nautilus.io",
      loginMethod: "email",
      role: "admin" as const,
      createdAt: randDate(365),
      lastSignedIn: randDate(1),
    },
    {
      id: genId(),
      name: "John Trader",
      email: "john@nautilus.io",
      loginMethod: "email",
      role: "user" as const,
      createdAt: randDate(180),
      lastSignedIn: randDate(1),
    },
    {
      id: genId(),
      name: "Sarah Quant",
      email: "sarah@nautilus.io",
      loginMethod: "email",
      role: "user" as const,
      createdAt: randDate(120),
      lastSignedIn: randDate(2),
    },
    {
      id: genId(),
      name: "Mike Algo",
      email: "mike@nautilus.io",
      loginMethod: "email",
      role: "user" as const,
      createdAt: randDate(90),
      lastSignedIn: randDate(3),
    },
  ];

  await db.insert(users).values(userRecords);
  console.log(`✓ Created ${userRecords.length} users`);
  return userRecords;
}

async function seedStrategies(userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding strategies...");

  const strategyRecords = STRATEGY_NAMES.map((name, i) => ({
    id: genId(),
    name,
    description: `${name} strategy using Nautilus Trader framework`,
    code: `# ${name} Strategy\n\nclass ${name}(Strategy):\n    def on_start(self):\n        pass\n    \n    def on_data(self, data):\n        pass`,
    parameters: JSON.stringify({
      fast_period: randInt(5, 20),
      slow_period: randInt(20, 50),
      risk_per_trade: parseFloat(randFloat(0.01, 0.03, 3)),
      max_positions: randInt(3, 10),
    }),
    createdBy: userRecords[randInt(1, userRecords.length - 1)].id,
    createdAt: randDate(90),
    updatedAt: randDate(30),
  }));

  await db.insert(strategies).values(strategyRecords);
  console.log(`✓ Created ${strategyRecords.length} strategies`);
  return strategyRecords;
}

async function seedBacktests(strategyRecords: any[], userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding backtests...");

  const backtestRecords = [];
  
  for (let i = 0; i < 50; i++) {
    const strategy = strategyRecords[randInt(0, strategyRecords.length - 1)];
    const startingBalance = parseFloat(randFloat(10000, 100000, 2));
    const profitLoss = parseFloat(randFloat(-5000, 15000, 2));
    const endingBalance = startingBalance + profitLoss;
    const totalTrades = randInt(50, 500);
    const winningTrades = randInt(Math.floor(totalTrades * 0.3), Math.floor(totalTrades * 0.7));
    const winRate = ((winningTrades / totalTrades) * 100).toFixed(2);

    backtestRecords.push({
      id: genId(),
      strategyId: strategy.id,
      strategyName: strategy.name,
      instrument: SYMBOLS[randInt(0, SYMBOLS.length - 1)],
      startingBalance: startingBalance.toFixed(2),
      endingBalance: endingBalance.toFixed(2),
      totalTrades: totalTrades.toString(),
      winRate: winRate,
      profitLoss: profitLoss.toFixed(2),
      status: ["completed", "completed", "completed", "failed"][randInt(0, 3)] as any,
      results: JSON.stringify({
        sharpe_ratio: parseFloat(randFloat(0.5, 3.0, 2)),
        sortino_ratio: parseFloat(randFloat(0.7, 3.5, 2)),
        max_drawdown: parseFloat(randFloat(5, 25, 2)),
        profit_factor: parseFloat(randFloat(1.0, 2.5, 2)),
        winning_trades: winningTrades,
        losing_trades: totalTrades - winningTrades,
      }),
      logs: `Backtest started at ${new Date().toISOString()}\nProcessing ${totalTrades} trades...\nCompleted successfully`,
      error: null,
      createdBy: userRecords[randInt(1, userRecords.length - 1)].id,
      createdAt: randDate(60),
      completedAt: randDate(59),
    });
  }

  await db.insert(backtests).values(backtestRecords);
  console.log(`✓ Created ${backtestRecords.length} backtests`);
  return backtestRecords;
}

async function seedLiveTrades(strategyRecords: any[], userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding live trades...");

  const tradeRecords = [];

  for (let i = 0; i < 200; i++) {
    const strategy = strategyRecords[randInt(0, strategyRecords.length - 1)];
    const symbol = SYMBOLS[randInt(0, SYMBOLS.length - 1)];
    const side = ["buy", "sell"][randInt(0, 1)] as any;
    const quantity = randFloat(0.1, 10, 2);
    const entryPrice = randFloat(1.0, 150.0, 5);
    const isOpen = i < 20; // 20 open trades
    
    let exitPrice = null;
    let pnl = null;
    let status: any = "open";
    let exitTime = null;

    if (!isOpen) {
      const priceChange = parseFloat(randFloat(-5, 5, 5));
      exitPrice = (parseFloat(entryPrice) + priceChange).toFixed(5);
      const pnlCalc = side === "buy" 
        ? (parseFloat(exitPrice) - parseFloat(entryPrice)) * parseFloat(quantity)
        : (parseFloat(entryPrice) - parseFloat(exitPrice)) * parseFloat(quantity);
      pnl = pnlCalc.toFixed(2);
      status = ["closed", "closed", "cancelled"][randInt(0, 2)];
      exitTime = randDate(30);
    }

    tradeRecords.push({
      id: genId(),
      userId: userRecords[randInt(1, userRecords.length - 1)].id,
      strategyId: strategy.id,
      symbol,
      side,
      quantity,
      entryPrice,
      exitPrice,
      pnl,
      status,
      entryTime: randDate(45),
      exitTime,
      createdAt: randDate(45),
    });
  }

  await db.insert(liveTrades).values(tradeRecords);
  console.log(`✓ Created ${tradeRecords.length} live trades`);
  return tradeRecords;
}

async function seedPositions(strategyRecords: any[], userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding positions...");

  const positionRecords = [];

  for (let i = 0; i < 15; i++) {
    const strategy = strategyRecords[randInt(0, strategyRecords.length - 1)];
    const symbol = SYMBOLS[randInt(0, SYMBOLS.length - 1)];
    const quantity = randFloat(0.5, 20, 2);
    const avgPrice = randFloat(1.0, 150.0, 5);
    const currentPrice = (parseFloat(avgPrice) + parseFloat(randFloat(-2, 2, 5))).toFixed(5);
    const unrealizedPnl = ((parseFloat(currentPrice) - parseFloat(avgPrice)) * parseFloat(quantity)).toFixed(2);

    positionRecords.push({
      id: genId(),
      userId: userRecords[randInt(1, userRecords.length - 1)].id,
      strategyId: strategy.id,
      symbol,
      quantity,
      avgPrice,
      currentPrice,
      unrealizedPnl,
      realizedPnl: randFloat(-500, 1500, 2),
      updatedAt: randDate(1),
      createdAt: randDate(30),
    });
  }

  await db.insert(positions).values(positionRecords);
  console.log(`✓ Created ${positionRecords.length} positions`);
  return positionRecords;
}

async function seedPerformanceMetrics(strategyRecords: any[], userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding performance metrics...");

  const metricRecords = [];
  const periods = ["daily", "weekly", "monthly", "all_time"] as const;

  for (const strategy of strategyRecords) {
    for (const period of periods) {
      metricRecords.push({
        id: genId(),
        userId: userRecords[randInt(1, userRecords.length - 1)].id,
        strategyId: strategy.id,
        period,
        totalReturn: randFloat(-10, 50, 2),
        sharpeRatio: randFloat(0.5, 3.0, 2),
        sortinoRatio: randFloat(0.7, 3.5, 2),
        maxDrawdown: randFloat(5, 25, 2),
        winRate: randFloat(40, 70, 2),
        profitFactor: randFloat(1.0, 2.5, 2),
        totalTrades: randInt(10, 500).toString(),
        createdAt: randDate(30),
      });
    }
  }

  await db.insert(performanceMetrics).values(metricRecords);
  console.log(`✓ Created ${metricRecords.length} performance metrics`);
  return metricRecords;
}

async function seedSystemLogs() {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding system logs...");

  const logLevels = ["info", "warning", "error", "critical"] as const;
  const categories = ["system", "trading", "data", "risk", "execution"];
  const messages = [
    "System started successfully",
    "Data feed connected",
    "Strategy execution completed",
    "Risk limit exceeded",
    "Order executed successfully",
    "Connection timeout",
    "Database backup completed",
    "High latency detected",
    "Memory usage at 80%",
    "Cache cleared",
  ];

  const logRecords = [];

  for (let i = 0; i < 100; i++) {
    logRecords.push({
      id: genId(),
      level: logLevels[randInt(0, logLevels.length - 1)],
      category: categories[randInt(0, categories.length - 1)],
      message: messages[randInt(0, messages.length - 1)],
      metadata: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: "nautilus_core",
        version: "1.220.0",
      }),
      userId: null,
      createdAt: randDate(7),
    });
  }

  await db.insert(systemLogs).values(logRecords);
  console.log(`✓ Created ${logRecords.length} system logs`);
  return logRecords;
}

async function seedAuditTrail(userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding audit trail...");

  const actions = [
    "user.login",
    "user.logout",
    "strategy.create",
    "strategy.update",
    "strategy.delete",
    "backtest.start",
    "backtest.stop",
    "trade.execute",
    "settings.update",
    "risk_limit.update",
  ];

  const resources = ["user", "strategy", "backtest", "trade", "settings", "risk_limit"];

  const auditRecords = [];

  for (let i = 0; i < 150; i++) {
    const user = userRecords[randInt(0, userRecords.length - 1)];
    auditRecords.push({
      id: genId(),
      userId: user.id,
      action: actions[randInt(0, actions.length - 1)],
      resource: resources[randInt(0, resources.length - 1)],
      resourceId: genId(),
      details: JSON.stringify({
        user: user.name,
        timestamp: new Date().toISOString(),
        changes: { field: "value" },
      }),
      ipAddress: `192.168.${randInt(1, 255)}.${randInt(1, 255)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      createdAt: randDate(30),
    });
  }

  await db.insert(auditTrail).values(auditRecords);
  console.log(`✓ Created ${auditRecords.length} audit trail records`);
  return auditRecords;
}

async function seedApiKeys(userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding API keys...");

  const apiKeyRecords = [];

  for (let i = 0; i < 10; i++) {
    const user = userRecords[randInt(1, userRecords.length - 1)];
    apiKeyRecords.push({
      id: genId(),
      userId: user.id,
      name: `API Key ${i + 1}`,
      keyHash: randomBytes(32).toString("hex"),
      permissions: JSON.stringify(["read", "write", "execute"]),
      lastUsedAt: randDate(7),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: ["yes", "yes", "yes", "no"][randInt(0, 3)] as any,
      createdAt: randDate(90),
    });
  }

  await db.insert(apiKeys).values(apiKeyRecords);
  console.log(`✓ Created ${apiKeyRecords.length} API keys`);
  return apiKeyRecords;
}

async function seedRiskLimits(userRecords: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  console.log("Seeding risk limits...");

  const riskTypes = ["daily_loss", "position_size", "max_drawdown", "concentration"] as const;

  const riskRecords = [];

  for (const user of userRecords.slice(1)) {
    // Skip admin
    for (const type of riskTypes) {
      let value = "";
      switch (type) {
        case "daily_loss":
          value = randFloat(1000, 5000, 2);
          break;
        case "position_size":
          value = randFloat(10, 100, 2);
          break;
        case "max_drawdown":
          value = randFloat(10, 30, 2);
          break;
        case "concentration":
          value = randFloat(20, 50, 2);
          break;
      }

      riskRecords.push({
        id: genId(),
        userId: user.id,
        type,
        value,
        enabled: ["yes", "yes", "no"][randInt(0, 2)] as any,
        createdAt: randDate(60),
        updatedAt: randDate(30),
      });
    }
  }

  await db.insert(riskLimits).values(riskRecords);
  console.log(`✓ Created ${riskRecords.length} risk limits`);
  return riskRecords;
}

async function main() {
  console.log("=== Starting Database Seeding ===\n");

  try {
    const userRecords = await seedUsers();
    const strategyRecords = await seedStrategies(userRecords);
    await seedBacktests(strategyRecords, userRecords);
    await seedLiveTrades(strategyRecords, userRecords);
    await seedPositions(strategyRecords, userRecords);
    await seedPerformanceMetrics(strategyRecords, userRecords);
    await seedSystemLogs();
    await seedAuditTrail(userRecords);
    await seedApiKeys(userRecords);
    await seedRiskLimits(userRecords);

    console.log("\n=== Database Seeding Completed Successfully ===");
    console.log("\nSummary:");
    console.log("- 4 users");
    console.log("- 15 strategies");
    console.log("- 50 backtests");
    console.log("- 200 live trades");
    console.log("- 15 positions");
    console.log("- 60 performance metrics");
    console.log("- 100 system logs");
    console.log("- 150 audit trail records");
    console.log("- 10 API keys");
    console.log("- 12 risk limits");
    console.log("\nTotal: 616 records");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main();

