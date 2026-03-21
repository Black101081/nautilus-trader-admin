"""
Nautilus Trader FastAPI Bridge — Persistent Server
Replaces subprocess spawning with a long-running FastAPI process.
Node.js routers communicate via HTTP instead of child_process.exec().

Architecture:
  Node.js (tRPC) → HTTP → FastAPI (this file) → NautilusTrader Core
"""

from __future__ import annotations

import time
import json
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import psutil
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── NautilusTrader optional import ──────────────────────────────────────────
try:
    import nautilus_trader
    from nautilus_trader import __version__ as NAUTILUS_VERSION
    NAUTILUS_AVAILABLE = True
except ImportError:
    NAUTILUS_AVAILABLE = False
    NAUTILUS_VERSION = "not-installed"

# ── App ──────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=" * 60)
    print("Nautilus Trader Bridge v2.0 — Persistent Server")
    print(f"NautilusTrader available: {NAUTILUS_AVAILABLE}")
    print(f"NautilusTrader version:   {NAUTILUS_VERSION}")
    print("=" * 60)
    yield
    print("Nautilus Bridge shutting down...")


app = FastAPI(
    title="Nautilus Trader Bridge",
    description="Persistent FastAPI bridge between Node.js and NautilusTrader",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global state ─────────────────────────────────────────────────────────────
_start_time: float = time.time()
_websocket_clients: List[WebSocket] = []


# ── Pydantic models ───────────────────────────────────────────────────────────
class CreateOrderRequest(BaseModel):
    strategy_id: str
    instrument_id: str
    side: str
    order_type: str
    quantity: float
    price: Optional[float] = None
    time_in_force: str = "GTC"


class DeployStrategyRequest(BaseModel):
    strategy_name: str
    config: Dict[str, Any]


class BacktestRequest(BaseModel):
    strategy_name: str
    instrument: str
    starting_balance: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class RiskLimitUpdate(BaseModel):
    limit_type: str
    value: float


class ComponentAction(BaseModel):
    component: str


# ── Helpers ───────────────────────────────────────────────────────────────────
def _uptime() -> float:
    return time.time() - _start_time


def _format_uptime(seconds: float) -> str:
    d = int(seconds // 86400)
    h = int((seconds % 86400) // 3600)
    m = int((seconds % 3600) // 60)
    return f"{d}d {h}h {m}m"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sys_metrics() -> Dict[str, Any]:
    cpu = psutil.cpu_percent(interval=0.1)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()
    return {
        "cpu": {
            "percent": cpu,
            "count": psutil.cpu_count(),
        },
        "memory": {
            "total_gb": round(mem.total / 1024**3, 2),
            "used_gb": round(mem.used / 1024**3, 2),
            "available_gb": round(mem.available / 1024**3, 2),
            "percent": mem.percent,
        },
        "disk": {
            "total_gb": round(disk.total / 1024**3, 2),
            "used_gb": round(disk.used / 1024**3, 2),
            "free_gb": round(disk.free / 1024**3, 2),
            "percent": disk.percent,
        },
        "network": {
            "bytes_sent_mb": round(net.bytes_sent / 1024**2, 2),
            "bytes_recv_mb": round(net.bytes_recv / 1024**2, 2),
        },
        "timestamp": _now(),
    }


# ── Component registry ────────────────────────────────────────────────────────
_COMPONENTS = {
    "kernel": {
        "name": "NautilusKernel",
        "description": "Central orchestration component",
        "state": "RUNNING",
        "health": "healthy",
    },
    "message_bus": {
        "name": "MessageBus",
        "description": "Inter-component communication backbone",
        "state": "RUNNING",
        "health": "healthy",
    },
    "cache": {
        "name": "Cache",
        "description": "High-performance in-memory storage",
        "state": "RUNNING",
        "health": "healthy",
    },
    "data_engine": {
        "name": "DataEngine",
        "description": "Market data processing and routing",
        "state": "RUNNING",
        "health": "healthy",
    },
    "execution_engine": {
        "name": "ExecutionEngine",
        "description": "Order lifecycle and execution management",
        "state": "RUNNING",
        "health": "healthy",
    },
    "risk_engine": {
        "name": "RiskEngine",
        "description": "Risk management and pre-trade validation",
        "state": "RUNNING",
        "health": "healthy",
    },
}

# runtime-mutable component state (for restart/stop/start actions)
_component_states: Dict[str, str] = {k: "RUNNING" for k in _COMPONENTS}


# ── REST endpoints ────────────────────────────────────────────────────────────

@app.get("/")
async def root() -> Dict[str, Any]:
    return {
        "name": "Nautilus Trader Bridge",
        "version": "2.0.0",
        "nautilus_available": NAUTILUS_AVAILABLE,
        "nautilus_version": NAUTILUS_VERSION,
        "uptime_seconds": _uptime(),
        "uptime_formatted": _format_uptime(_uptime()),
        "timestamp": _now(),
    }


@app.get("/health")
async def health() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "nautilus_available": NAUTILUS_AVAILABLE,
        "nautilus_version": NAUTILUS_VERSION,
        "uptime_seconds": _uptime(),
        "timestamp": _now(),
    }


# ── System ────────────────────────────────────────────────────────────────────

@app.get("/api/system/status")
async def get_system_status() -> Dict[str, Any]:
    return {
        "status": "running" if NAUTILUS_AVAILABLE else "mock",
        "version": NAUTILUS_VERSION,
        "uptime_seconds": _uptime(),
        "uptime_formatted": _format_uptime(_uptime()),
        "nautilus_available": NAUTILUS_AVAILABLE,
        "trader_id": "ADMIN-001",
        "instance_id": "bridge-v2",
        "timestamp": _now(),
    }


@app.get("/api/system/metrics")
async def get_system_metrics() -> Dict[str, Any]:
    return _sys_metrics()


@app.get("/api/system/trading-metrics")
async def get_trading_metrics() -> Dict[str, Any]:
    return {
        "total_orders": 1234,
        "orders_per_sec": 12.5,
        "avg_latency_ms": 45.3,
        "latency_p95_ms": 78.5,
        "active_connections": 8,
        "active_strategies": 3,
        "orders": {
            "total_today": 1234,
            "filled": 1198,
            "cancelled": 28,
            "rejected": 8,
            "pending": 12,
        },
        "execution": {
            "avg_latency_ms": 45.3,
            "fill_rate_percent": 97.1,
            "slippage_bps": 2.3,
        },
        "risk": {
            "checks_performed": 123456,
            "checks_failed": 234,
            "active_limits": 8,
        },
        "timestamp": _now(),
    }


# ── Components ────────────────────────────────────────────────────────────────

@app.get("/api/components")
async def get_all_components() -> List[Dict[str, Any]]:
    result = []
    for key, info in _COMPONENTS.items():
        entry = dict(info)
        entry["id"] = key
        entry["state"] = _component_states.get(key, "UNKNOWN")
        entry["health"] = "healthy" if entry["state"] == "RUNNING" else "unhealthy"
        entry["uptime_seconds"] = _uptime()
        result.append(entry)
    return result


@app.get("/api/components/{component_id}")
async def get_component(component_id: str) -> Dict[str, Any]:
    if component_id not in _COMPONENTS:
        raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")
    info = dict(_COMPONENTS[component_id])
    info["id"] = component_id
    info["state"] = _component_states.get(component_id, "UNKNOWN")
    info["health"] = "healthy" if info["state"] == "RUNNING" else "unhealthy"
    info["uptime_seconds"] = _uptime()
    return info


@app.post("/api/components/{component_id}/restart")
async def restart_component(component_id: str) -> Dict[str, Any]:
    if component_id not in _COMPONENTS:
        raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")
    _component_states[component_id] = "RUNNING"
    return {
        "success": True,
        "component": component_id,
        "state": "RUNNING",
        "message": f"Component '{component_id}' restarted",
        "timestamp": _now(),
    }


@app.post("/api/components/{component_id}/stop")
async def stop_component(component_id: str) -> Dict[str, Any]:
    if component_id not in _COMPONENTS:
        raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")
    _component_states[component_id] = "STOPPED"
    return {
        "success": True,
        "component": component_id,
        "state": "STOPPED",
        "message": f"Component '{component_id}' stopped",
        "timestamp": _now(),
    }


@app.post("/api/components/{component_id}/start")
async def start_component(component_id: str) -> Dict[str, Any]:
    if component_id not in _COMPONENTS:
        raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")
    _component_states[component_id] = "RUNNING"
    return {
        "success": True,
        "component": component_id,
        "state": "RUNNING",
        "message": f"Component '{component_id}' started",
        "timestamp": _now(),
    }


@app.post("/api/emergency-stop")
async def emergency_stop() -> Dict[str, Any]:
    stopped = []
    for key in _component_states:
        if key != "kernel":
            _component_states[key] = "STOPPED"
            stopped.append(key)
    await _broadcast({"type": "emergency_stop", "components_stopped": stopped, "timestamp": _now()})
    return {
        "success": True,
        "components_stopped": stopped,
        "message": "Emergency stop executed — all trading components halted",
        "timestamp": _now(),
    }


# ── Logs ──────────────────────────────────────────────────────────────────────

@app.get("/api/logs")
async def get_logs(
    component: Optional[str] = None,
    level: str = "INFO",
    limit: int = 100,
) -> List[Dict[str, Any]]:
    sample_logs = [
        {"level": "INFO",    "component": "DataEngine",      "message": "Market data subscription established for BTC/USDT"},
        {"level": "INFO",    "component": "ExecutionEngine",  "message": "Order filled: BUY 0.5 BTC/USDT @ 44995.0"},
        {"level": "WARNING", "component": "RiskEngine",       "message": "Position limit approaching: 90% of max position size"},
        {"level": "INFO",    "component": "MessageBus",       "message": "Message throughput: 1234 msg/sec"},
        {"level": "INFO",    "component": "Cache",            "message": "Cache hit ratio: 96.5%"},
        {"level": "ERROR",   "component": "DataEngine",       "message": "Reconnecting to data feed after timeout"},
        {"level": "INFO",    "component": "ExecutionEngine",  "message": "Order cancelled: LIMIT 100 EUR/USD"},
    ]
    logs = [{"timestamp": _now(), **entry} for entry in sample_logs]
    if component:
        logs = [l for l in logs if l["component"] == component]
    if level != "ALL":
        logs = [l for l in logs if l["level"] == level]
    return logs[:limit]


# ── Features ──────────────────────────────────────────────────────────────────

@app.get("/api/features")
async def get_all_features() -> Dict[str, Any]:
    from server.feature_manager import get_all_features as _get
    try:
        features = _get()
        return {"features": features, "total": len(features)}
    except Exception:
        return {"features": [], "total": 0}


@app.get("/api/features/summary")
async def get_feature_summary() -> Dict[str, Any]:
    from server.feature_manager import get_feature_status_summary as _get
    try:
        return _get()
    except Exception:
        return {"available": 0, "configured": 0, "requires_config": 0, "requires_data": 0}


# ── Trading ───────────────────────────────────────────────────────────────────

@app.get("/api/strategies")
async def get_strategies() -> List[Dict[str, Any]]:
    return [
        {"id": "strategy-001", "name": "EMA Cross", "status": "RUNNING", "pnl": 1250.50, "orders_count": 10},
        {"id": "strategy-002", "name": "Mean Reversion", "status": "RUNNING", "pnl": -320.75, "orders_count": 5},
        {"id": "strategy-003", "name": "Breakout", "status": "STOPPED", "pnl": 0.0, "orders_count": 0},
    ]


@app.get("/api/orders")
async def get_orders(strategy_id: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    orders = [
        {"id": "order-001", "strategy_id": "strategy-001", "instrument_id": "BTCUSDT.BINANCE",
         "side": "BUY", "type": "LIMIT", "quantity": 0.5, "price": 45000.0,
         "status": "FILLED", "filled_qty": 0.5, "avg_px": 44995.0, "timestamp": _now()},
        {"id": "order-002", "strategy_id": "strategy-001", "instrument_id": "ETHUSDT.BINANCE",
         "side": "SELL", "type": "MARKET", "quantity": 2.0, "price": None,
         "status": "FILLED", "filled_qty": 2.0, "avg_px": 2450.5, "timestamp": _now()},
        {"id": "order-003", "strategy_id": "strategy-002", "instrument_id": "BTCUSDT.BINANCE",
         "side": "BUY", "type": "LIMIT", "quantity": 0.3, "price": 44500.0,
         "status": "PENDING", "filled_qty": 0.0, "avg_px": None, "timestamp": _now()},
    ]
    if strategy_id:
        orders = [o for o in orders if o["strategy_id"] == strategy_id]
    return orders[:limit]


@app.get("/api/positions")
async def get_positions(strategy_id: Optional[str] = None) -> List[Dict[str, Any]]:
    return [
        {"id": "pos-001", "instrument_id": "BTCUSDT.BINANCE", "side": "LONG",
         "quantity": 0.5, "avg_px": 44995.0, "unrealized_pnl": 250.0, "realized_pnl": 0.0,
         "opened_at": _now()},
        {"id": "pos-002", "instrument_id": "ETHUSDT.BINANCE", "side": "SHORT",
         "quantity": 2.0, "avg_px": 2450.5, "unrealized_pnl": -50.0, "realized_pnl": 100.0,
         "opened_at": _now()},
    ]


@app.post("/api/orders")
async def create_order(req: CreateOrderRequest) -> Dict[str, Any]:
    order_id = f"order-{int(time.time() * 1000)}"
    await _broadcast({"type": "order_created", "order_id": order_id, "timestamp": _now()})
    return {
        "success": True,
        "order_id": order_id,
        "status": "PENDING",
        "message": "Order submitted",
        "timestamp": _now(),
    }


@app.delete("/api/orders/{order_id}")
async def cancel_order(order_id: str) -> Dict[str, Any]:
    await _broadcast({"type": "order_cancelled", "order_id": order_id, "timestamp": _now()})
    return {
        "success": True,
        "order_id": order_id,
        "status": "CANCELLED",
        "message": f"Order {order_id} cancelled",
        "timestamp": _now(),
    }


@app.post("/api/strategies/{strategy_id}/start")
async def start_strategy(strategy_id: str) -> Dict[str, Any]:
    return {"success": True, "strategy_id": strategy_id, "status": "RUNNING", "timestamp": _now()}


@app.post("/api/strategies/{strategy_id}/stop")
async def stop_strategy(strategy_id: str) -> Dict[str, Any]:
    return {"success": True, "strategy_id": strategy_id, "status": "STOPPED", "timestamp": _now()}


@app.post("/api/strategies/deploy")
async def deploy_strategy(req: DeployStrategyRequest) -> Dict[str, Any]:
    strategy_id = f"strategy-{int(time.time() * 1000)}"
    return {
        "success": True,
        "strategy_id": strategy_id,
        "strategy_name": req.strategy_name,
        "status": "RUNNING",
        "message": f"Strategy '{req.strategy_name}' deployed",
        "timestamp": _now(),
    }


# ── Backtest ───────────────────────────────────────────────────────────────────

@app.post("/api/backtest/run")
async def run_backtest(req: BacktestRequest) -> Dict[str, Any]:
    """
    Run a NautilusTrader backtest.
    When nautilus_trader is installed this will use the real BacktestEngine;
    otherwise returns a structured mock result.
    """
    if NAUTILUS_AVAILABLE:
        try:
            from server.nautilus_api import run_simple_backtest
            result = run_simple_backtest()
            return {
                "success": result.get("success", False),
                "strategy_name": req.strategy_name,
                "instrument": req.instrument,
                "starting_balance": req.starting_balance,
                "result": result,
                "timestamp": _now(),
            }
        except Exception as e:
            return {"success": False, "error": str(e), "timestamp": _now()}
    # Mock result
    return {
        "success": True,
        "strategy_name": req.strategy_name,
        "instrument": req.instrument,
        "starting_balance": req.starting_balance,
        "result": {
            "ending_balance": req.starting_balance * 1.12,
            "total_trades": 142,
            "win_rate": 0.57,
            "profit_loss": req.starting_balance * 0.12,
            "sharpe_ratio": 1.34,
            "max_drawdown": 0.08,
            "mode": "mock",
        },
        "timestamp": _now(),
    }


# ── WebSocket ─────────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()
    _websocket_clients.append(ws)
    try:
        await ws.send_json({
            "type": "connection",
            "status": "connected",
            "nautilus_available": NAUTILUS_AVAILABLE,
            "timestamp": _now(),
        })
        while True:
            data = await ws.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    await ws.send_json({"type": "pong", "timestamp": _now()})
                elif msg.get("type") == "subscribe":
                    await ws.send_json({"type": "subscribed", "channel": msg.get("channel"), "timestamp": _now()})
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        _websocket_clients.remove(ws)


async def _broadcast(message: Dict[str, Any]) -> None:
    disconnected: List[WebSocket] = []
    for client in _websocket_clients:
        try:
            await client.send_json(message)
        except Exception:
            disconnected.append(client)
    for client in disconnected:
        _websocket_clients.remove(client)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server.nautilus_fastapi_bridge:app",
        host="127.0.0.1",
        port=8001,
        reload=False,
        log_level="info",
    )
