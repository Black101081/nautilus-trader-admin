/**
 * Nautilus Bridge HTTP Client
 *
 * Replaces all subprocess spawning (child_process.exec python3 -c "...") with
 * HTTP calls to the persistent FastAPI bridge server.
 *
 * Bridge server: python3.11 -m uvicorn server.nautilus_fastapi_bridge:app --port 8001
 */

const BRIDGE_BASE_URL = process.env.BRIDGE_URL ?? "http://127.0.0.1:8001";
const REQUEST_TIMEOUT_MS = 10_000;

// ── Low-level fetch helper ──────────────────────────────────────────────────

interface BridgeError {
  error: string;
  detail?: string;
}

async function bridgeFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${BRIDGE_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        `Bridge HTTP ${res.status}: ${(body as BridgeError).detail ?? res.statusText}`
      );
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

async function bridgeGet<T>(path: string): Promise<T> {
  return bridgeFetch<T>(path);
}

async function bridgePost<T>(path: string, body?: unknown): Promise<T> {
  return bridgeFetch<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function bridgeDelete<T>(path: string): Promise<T> {
  return bridgeFetch<T>(path, { method: "DELETE" });
}

// ── Health ──────────────────────────────────────────────────────────────────

export async function checkBridgeHealth(): Promise<{
  status: string;
  nautilus_available: boolean;
  nautilus_version: string;
  uptime_seconds: number;
  timestamp: string;
}> {
  return bridgeGet("/health");
}

// ── System ──────────────────────────────────────────────────────────────────

export async function getSystemStatus(): Promise<Record<string, unknown>> {
  return bridgeGet("/api/system/status");
}

export async function getSystemMetrics(): Promise<Record<string, unknown>> {
  return bridgeGet("/api/system/metrics");
}

export async function getTradingMetrics(): Promise<Record<string, unknown>> {
  return bridgeGet("/api/system/trading-metrics");
}

// ── Components ──────────────────────────────────────────────────────────────

export async function getAllComponents(): Promise<unknown[]> {
  return bridgeGet("/api/components");
}

export async function getComponent(id: string): Promise<Record<string, unknown>> {
  return bridgeGet(`/api/components/${id}`);
}

export async function restartComponent(id: string): Promise<Record<string, unknown>> {
  return bridgePost(`/api/components/${id}/restart`);
}

export async function stopComponent(id: string): Promise<Record<string, unknown>> {
  return bridgePost(`/api/components/${id}/stop`);
}

export async function startComponent(id: string): Promise<Record<string, unknown>> {
  return bridgePost(`/api/components/${id}/start`);
}

export async function emergencyStopAll(): Promise<Record<string, unknown>> {
  return bridgePost("/api/emergency-stop");
}

// ── Logs ────────────────────────────────────────────────────────────────────

export async function getLogs(opts: {
  component?: string;
  level?: string;
  limit?: number;
}): Promise<unknown[]> {
  const params = new URLSearchParams();
  if (opts.component) params.set("component", opts.component);
  if (opts.level) params.set("level", opts.level);
  if (opts.limit !== undefined) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return bridgeGet(`/api/logs${qs ? `?${qs}` : ""}`);
}

// ── Features ────────────────────────────────────────────────────────────────

export async function getAllFeatures(): Promise<Record<string, unknown>> {
  return bridgeGet("/api/features");
}

export async function getFeatureSummary(): Promise<Record<string, unknown>> {
  return bridgeGet("/api/features/summary");
}

// ── Trading ─────────────────────────────────────────────────────────────────

export async function getStrategies(): Promise<unknown[]> {
  return bridgeGet("/api/strategies");
}

export async function getOrders(opts?: {
  strategy_id?: string;
  limit?: number;
}): Promise<unknown[]> {
  const params = new URLSearchParams();
  if (opts?.strategy_id) params.set("strategy_id", opts.strategy_id);
  if (opts?.limit !== undefined) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return bridgeGet(`/api/orders${qs ? `?${qs}` : ""}`);
}

export async function getPositions(opts?: {
  strategy_id?: string;
}): Promise<unknown[]> {
  const params = new URLSearchParams();
  if (opts?.strategy_id) params.set("strategy_id", opts.strategy_id);
  const qs = params.toString();
  return bridgeGet(`/api/positions${qs ? `?${qs}` : ""}`);
}

export async function createOrder(order: {
  strategy_id: string;
  instrument_id: string;
  side: string;
  order_type: string;
  quantity: number;
  price?: number;
  time_in_force?: string;
}): Promise<Record<string, unknown>> {
  return bridgePost("/api/orders", order);
}

export async function cancelOrder(orderId: string): Promise<Record<string, unknown>> {
  return bridgeDelete(`/api/orders/${orderId}`);
}

export async function startStrategy(strategyId: string): Promise<Record<string, unknown>> {
  return bridgePost(`/api/strategies/${strategyId}/start`);
}

export async function stopStrategy(strategyId: string): Promise<Record<string, unknown>> {
  return bridgePost(`/api/strategies/${strategyId}/stop`);
}

export async function deployStrategy(req: {
  strategy_name: string;
  config: Record<string, unknown>;
}): Promise<Record<string, unknown>> {
  return bridgePost("/api/strategies/deploy", req);
}

// ── Backtest ─────────────────────────────────────────────────────────────────

export async function runBacktest(req: {
  strategy_name: string;
  instrument: string;
  starting_balance: number;
  start_date?: string;
  end_date?: string;
}): Promise<Record<string, unknown>> {
  return bridgePost("/api/backtest/run", req);
}
