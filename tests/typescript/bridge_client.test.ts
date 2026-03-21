/**
 * Unit tests for bridge_client.ts (Phase 1)
 * Uses vi.mock to mock the global fetch — no real server needed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock fetch globally before importing bridge_client ─────────────────────
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// ── Helpers ────────────────────────────────────────────────────────────────

function okJson(data: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  } as unknown as Response;
}

function errorResponse(status: number, detail: string): Response {
  return {
    ok: false,
    status,
    statusText: "Error",
    json: async () => ({ detail }),
  } as unknown as Response;
}

// Import after stubbing fetch
import {
  checkBridgeHealth,
  getSystemStatus,
  getSystemMetrics,
  getTradingMetrics,
  getAllComponents,
  getComponent,
  restartComponent,
  stopComponent,
  startComponent,
  emergencyStopAll,
  getLogs,
  getAllFeatures,
  getFeatureSummary,
  getStrategies,
  getOrders,
  getPositions,
  createOrder,
  cancelOrder,
  startStrategy,
  stopStrategy,
  deployStrategy,
  runBacktest,
} from "../../server/bridge_client";

// ── Tests ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── Health ────────────────────────────────────────────────────────────────

describe("checkBridgeHealth", () => {
  it("calls /health endpoint", async () => {
    const payload = { status: "healthy", nautilus_available: false, nautilus_version: "mock", uptime_seconds: 42, timestamp: "t" };
    mockFetch.mockResolvedValueOnce(okJson(payload));

    const result = await checkBridgeHealth();

    const [url] = mockFetch.mock.calls[0] as [string, ...unknown[]];
    expect(url).toContain("/health");
    expect(result.status).toBe("healthy");
  });

  it("returns nautilus_available field", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ status: "healthy", nautilus_available: true, uptime_seconds: 10, timestamp: "t", nautilus_version: "1.0" }));
    const result = await checkBridgeHealth();
    expect(typeof result.nautilus_available).toBe("boolean");
  });
});

// ─── System ────────────────────────────────────────────────────────────────

describe("getSystemStatus", () => {
  it("calls /api/system/status", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ status: "running", version: "1.220", nautilus_available: false }));
    const result = await getSystemStatus() as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/system/status");
    expect(result.status).toBe("running");
  });
});

describe("getSystemMetrics", () => {
  it("calls /api/system/metrics", async () => {
    const payload = { cpu: { percent: 5 }, memory: { used_gb: 2, total_gb: 8 }, disk: {}, network: {} };
    mockFetch.mockResolvedValueOnce(okJson(payload));
    const result = await getSystemMetrics() as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/system/metrics");
    expect(result).toHaveProperty("cpu");
  });
});

describe("getTradingMetrics", () => {
  it("calls /api/system/trading-metrics", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ orders: {}, execution: {}, risk: {} }));
    const result = await getTradingMetrics() as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("trading-metrics");
    expect(result).toHaveProperty("orders");
  });
});

// ─── Components ────────────────────────────────────────────────────────────

describe("getAllComponents", () => {
  it("returns array", async () => {
    mockFetch.mockResolvedValueOnce(okJson([{ id: "kernel", state: "RUNNING" }]));
    const result = await getAllComponents();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getComponent", () => {
  it("calls correct path with component id", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ id: "cache", state: "RUNNING" }));
    await getComponent("cache");
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/components/cache");
  });
});

describe("restartComponent", () => {
  it("calls POST on restart endpoint", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, state: "RUNNING" }));
    const result = await restartComponent("cache") as Record<string, unknown>;
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/api/components/cache/restart");
    expect(call[1]?.method).toBe("POST");
    expect(result.success).toBe(true);
  });
});

describe("stopComponent", () => {
  it("calls POST on stop endpoint and returns STOPPED state", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, state: "STOPPED" }));
    const result = await stopComponent("data_engine") as Record<string, unknown>;
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/api/components/data_engine/stop");
    expect(result.state).toBe("STOPPED");
  });
});

describe("startComponent", () => {
  it("calls POST on start endpoint and returns RUNNING state", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, state: "RUNNING" }));
    const result = await startComponent("cache") as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/components/cache/start");
    expect(result.state).toBe("RUNNING");
  });
});

describe("emergencyStopAll", () => {
  it("calls POST on /api/emergency-stop", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, components_stopped: ["cache", "data_engine"] }));
    const result = await emergencyStopAll() as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/emergency-stop");
    expect(result.success).toBe(true);
    expect(Array.isArray(result.components_stopped)).toBe(true);
  });
});

// ─── Logs ──────────────────────────────────────────────────────────────────

describe("getLogs", () => {
  it("calls /api/logs with no params", async () => {
    mockFetch.mockResolvedValueOnce(okJson([]));
    await getLogs({});
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/logs");
  });

  it("includes query params when provided", async () => {
    mockFetch.mockResolvedValueOnce(okJson([]));
    await getLogs({ component: "DataEngine", level: "WARNING", limit: 10 });
    const url = (mockFetch.mock.calls[0] as [string])[0];
    expect(url).toContain("component=DataEngine");
    expect(url).toContain("level=WARNING");
    expect(url).toContain("limit=10");
  });
});

// ─── Features ──────────────────────────────────────────────────────────────

describe("getAllFeatures", () => {
  it("calls /api/features", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ features: [], total: 0 }));
    const result = await getAllFeatures() as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/features");
    expect(result).toHaveProperty("features");
  });
});

describe("getFeatureSummary", () => {
  it("calls /api/features/summary", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ available: 64, configured: 10 }));
    await getFeatureSummary();
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/features/summary");
  });
});

// ─── Trading ───────────────────────────────────────────────────────────────

describe("getStrategies", () => {
  it("returns list of strategies", async () => {
    mockFetch.mockResolvedValueOnce(okJson([{ id: "s1", name: "EMA Cross", status: "RUNNING" }]));
    const result = await getStrategies();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getOrders", () => {
  it("calls /api/orders", async () => {
    mockFetch.mockResolvedValueOnce(okJson([]));
    await getOrders();
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/orders");
  });

  it("appends strategy_id to query string when provided", async () => {
    mockFetch.mockResolvedValueOnce(okJson([]));
    await getOrders({ strategy_id: "s-001", limit: 50 });
    const url = (mockFetch.mock.calls[0] as [string])[0];
    expect(url).toContain("strategy_id=s-001");
    expect(url).toContain("limit=50");
  });
});

describe("getPositions", () => {
  it("calls /api/positions", async () => {
    mockFetch.mockResolvedValueOnce(okJson([]));
    await getPositions();
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/positions");
  });
});

describe("createOrder", () => {
  it("calls POST /api/orders with order payload", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, order_id: "order-999" }));
    const order = {
      strategy_id: "s-001",
      instrument_id: "BTCUSDT.BINANCE",
      side: "BUY",
      order_type: "LIMIT",
      quantity: 0.1,
      price: 45000,
      time_in_force: "GTC",
    };
    const result = await createOrder(order) as Record<string, unknown>;
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/api/orders");
    expect(call[1]?.method).toBe("POST");
    expect(result.success).toBe(true);
    expect(result.order_id).toBe("order-999");
  });
});

describe("cancelOrder", () => {
  it("calls DELETE /api/orders/:id", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, status: "CANCELLED" }));
    const result = await cancelOrder("order-001") as Record<string, unknown>;
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/api/orders/order-001");
    expect(call[1]?.method).toBe("DELETE");
    expect(result.status).toBe("CANCELLED");
  });
});

describe("startStrategy", () => {
  it("calls POST /api/strategies/:id/start", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, status: "RUNNING" }));
    const result = await startStrategy("strategy-001") as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/strategies/strategy-001/start");
    expect(result.status).toBe("RUNNING");
  });
});

describe("stopStrategy", () => {
  it("calls POST /api/strategies/:id/stop", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, status: "STOPPED" }));
    const result = await stopStrategy("strategy-002") as Record<string, unknown>;
    expect((mockFetch.mock.calls[0] as [string])[0]).toContain("/api/strategies/strategy-002/stop");
    expect(result.status).toBe("STOPPED");
  });
});

describe("deployStrategy", () => {
  it("calls POST /api/strategies/deploy with payload", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, strategy_id: "new-123", status: "RUNNING" }));
    const result = await deployStrategy({ strategy_name: "MyStrat", config: { fast: 10 } }) as Record<string, unknown>;
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/api/strategies/deploy");
    expect(call[1]?.method).toBe("POST");
    expect(result.success).toBe(true);
  });
});

// ─── Backtest ──────────────────────────────────────────────────────────────

describe("runBacktest", () => {
  it("calls POST /api/backtest/run", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, result: { total_trades: 100, win_rate: 0.6, ending_balance: 110000 } }));
    const result = await runBacktest({
      strategy_name: "EMA Cross",
      instrument: "BTCUSDT.BINANCE",
      starting_balance: 100_000,
    }) as Record<string, unknown>;
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/api/backtest/run");
    expect(call[1]?.method).toBe("POST");
    expect(result.success).toBe(true);
  });

  it("includes optional date params in payload", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ success: true, result: {} }));
    await runBacktest({
      strategy_name: "Test",
      instrument: "ETHUSDT.BINANCE",
      starting_balance: 50_000,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
    });
    const call = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(call[1]?.body as string);
    expect(body.start_date).toBe("2024-01-01");
    expect(body.end_date).toBe("2024-12-31");
  });
});

// ─── Error handling ────────────────────────────────────────────────────────

describe("Error handling", () => {
  it("throws when bridge returns non-ok status", async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(404, "Not found"));
    await expect(getComponent("ghost")).rejects.toThrow("404");
  });

  it("throws when bridge returns 500", async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(500, "Internal Server Error"));
    await expect(getSystemStatus()).rejects.toThrow("500");
  });

  it("throws when fetch itself fails (network error)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));
    await expect(checkBridgeHealth()).rejects.toThrow("network error");
  });
});
