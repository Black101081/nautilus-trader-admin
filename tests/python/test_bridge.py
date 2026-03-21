"""
Unit tests for FastAPI bridge (Phase 1)
Tests the bridge endpoints using TestClient (no real server needed).
"""

import sys
import os
import time

import pytest

# Make server package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi.testclient import TestClient
from server.nautilus_fastapi_bridge import app, _component_states, _COMPONENTS

client = TestClient(app)


# ── Fixtures ────────────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def reset_component_states():
    """Reset component states to RUNNING before each test."""
    for key in _component_states:
        _component_states[key] = "RUNNING"
    yield


# ── Health & Root ─────────────────────────────────────────────────────────────

class TestRootAndHealth:
    def test_root_returns_200(self):
        res = client.get("/")
        assert res.status_code == 200

    def test_root_has_required_fields(self):
        data = client.get("/").json()
        assert "name" in data
        assert "version" in data
        assert "nautilus_available" in data
        assert "uptime_seconds" in data
        assert "timestamp" in data

    def test_health_returns_200(self):
        res = client.get("/health")
        assert res.status_code == 200

    def test_health_status_is_healthy(self):
        data = client.get("/health").json()
        assert data["status"] == "healthy"

    def test_health_has_uptime(self):
        data = client.get("/health").json()
        assert isinstance(data["uptime_seconds"], (int, float))
        assert data["uptime_seconds"] >= 0


# ── System Status ────────────────────────────────────────────────────────────

class TestSystemStatus:
    def test_get_status_returns_200(self):
        res = client.get("/api/system/status")
        assert res.status_code == 200

    def test_status_has_correct_fields(self):
        data = client.get("/api/system/status").json()
        assert "status" in data
        assert "version" in data
        assert "uptime_seconds" in data
        assert "nautilus_available" in data
        assert "timestamp" in data

    def test_status_value_is_string(self):
        data = client.get("/api/system/status").json()
        assert isinstance(data["status"], str)


# ── System Metrics ───────────────────────────────────────────────────────────

class TestSystemMetrics:
    def test_metrics_returns_200(self):
        res = client.get("/api/system/metrics")
        assert res.status_code == 200

    def test_metrics_has_cpu_memory_disk(self):
        data = client.get("/api/system/metrics").json()
        assert "cpu" in data
        assert "memory" in data
        assert "disk" in data
        assert "network" in data

    def test_cpu_percent_in_range(self):
        data = client.get("/api/system/metrics").json()
        pct = data["cpu"]["percent"]
        assert 0.0 <= pct <= 100.0

    def test_memory_used_lte_total(self):
        data = client.get("/api/system/metrics").json()
        mem = data["memory"]
        assert mem["used_gb"] <= mem["total_gb"]


# ── Trading Metrics ──────────────────────────────────────────────────────────

class TestTradingMetrics:
    def test_trading_metrics_returns_200(self):
        res = client.get("/api/system/trading-metrics")
        assert res.status_code == 200

    def test_trading_metrics_has_orders(self):
        data = client.get("/api/system/trading-metrics").json()
        assert "orders" in data
        assert "execution" in data
        assert "risk" in data

    def test_fill_rate_in_range(self):
        data = client.get("/api/system/trading-metrics").json()
        rate = data["execution"]["fill_rate_percent"]
        assert 0.0 <= rate <= 100.0


# ── Components ───────────────────────────────────────────────────────────────

class TestComponents:
    def test_get_all_components_returns_200(self):
        res = client.get("/api/components")
        assert res.status_code == 200

    def test_get_all_components_returns_list(self):
        data = client.get("/api/components").json()
        assert isinstance(data, list)

    def test_components_count_matches_registry(self):
        data = client.get("/api/components").json()
        assert len(data) == len(_COMPONENTS)

    def test_each_component_has_required_fields(self):
        data = client.get("/api/components").json()
        for comp in data:
            assert "id" in comp
            assert "name" in comp
            assert "state" in comp
            assert "health" in comp

    def test_get_single_component(self):
        res = client.get("/api/components/kernel")
        assert res.status_code == 200
        data = res.json()
        assert data["id"] == "kernel"

    def test_get_unknown_component_returns_404(self):
        res = client.get("/api/components/nonexistent_component")
        assert res.status_code == 404

    def test_restart_component(self):
        # Stop first so state is not trivially RUNNING
        client.post("/api/components/cache/stop")
        res = client.post("/api/components/cache/restart")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["state"] == "RUNNING"

    def test_stop_component(self):
        res = client.post("/api/components/data_engine/stop")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["state"] == "STOPPED"
        # Verify persisted state
        assert _component_states["data_engine"] == "STOPPED"

    def test_start_component(self):
        _component_states["cache"] = "STOPPED"
        res = client.post("/api/components/cache/start")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["state"] == "RUNNING"

    def test_restart_unknown_component_returns_404(self):
        res = client.post("/api/components/ghost/restart")
        assert res.status_code == 404

    def test_stop_sets_health_to_unhealthy(self):
        client.post("/api/components/cache/stop")
        data = client.get("/api/components/cache").json()
        assert data["health"] == "unhealthy"

    def test_start_sets_health_to_healthy(self):
        _component_states["cache"] = "STOPPED"
        client.post("/api/components/cache/start")
        data = client.get("/api/components/cache").json()
        assert data["health"] == "healthy"


# ── Emergency Stop ────────────────────────────────────────────────────────────

class TestEmergencyStop:
    def test_emergency_stop_returns_200(self):
        res = client.post("/api/emergency-stop")
        assert res.status_code == 200

    def test_emergency_stop_halts_non_kernel_components(self):
        client.post("/api/emergency-stop")
        for key, state in _component_states.items():
            if key != "kernel":
                assert state == "STOPPED", f"Expected {key} to be STOPPED, got {state}"

    def test_emergency_stop_response_lists_stopped_components(self):
        data = client.post("/api/emergency-stop").json()
        assert data["success"] is True
        assert isinstance(data["components_stopped"], list)
        assert len(data["components_stopped"]) > 0


# ── Logs ─────────────────────────────────────────────────────────────────────

class TestLogs:
    def test_get_logs_returns_200(self):
        res = client.get("/api/logs")
        assert res.status_code == 200

    def test_logs_returns_list(self):
        data = client.get("/api/logs").json()
        assert isinstance(data, list)

    def test_each_log_has_required_fields(self):
        data = client.get("/api/logs").json()
        for log in data:
            assert "timestamp" in log
            assert "level" in log
            assert "component" in log
            assert "message" in log

    def test_filter_by_level(self):
        data = client.get("/api/logs?level=WARNING").json()
        for log in data:
            assert log["level"] == "WARNING"

    def test_filter_by_component(self):
        data = client.get("/api/logs?component=DataEngine").json()
        for log in data:
            assert log["component"] == "DataEngine"

    def test_limit_respected(self):
        data = client.get("/api/logs?limit=2").json()
        assert len(data) <= 2


# ── Trading endpoints ─────────────────────────────────────────────────────────

class TestTradingEndpoints:
    def test_get_strategies(self):
        res = client.get("/api/strategies")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_strategies_have_required_fields(self):
        data = client.get("/api/strategies").json()
        for s in data:
            assert "id" in s
            assert "name" in s
            assert "status" in s

    def test_get_orders(self):
        res = client.get("/api/orders")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_get_positions(self):
        res = client.get("/api/positions")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_create_order_returns_order_id(self):
        payload = {
            "strategy_id": "strategy-001",
            "instrument_id": "BTCUSDT.BINANCE",
            "side": "BUY",
            "order_type": "LIMIT",
            "quantity": 0.1,
            "price": 45000.0,
            "time_in_force": "GTC",
        }
        res = client.post("/api/orders", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "order_id" in data

    def test_cancel_order(self):
        res = client.delete("/api/orders/order-001")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["status"] == "CANCELLED"

    def test_start_strategy(self):
        res = client.post("/api/strategies/strategy-001/start")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["status"] == "RUNNING"

    def test_stop_strategy(self):
        res = client.post("/api/strategies/strategy-001/stop")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["status"] == "STOPPED"

    def test_deploy_strategy(self):
        payload = {"strategy_name": "TestStrategy", "config": {"fast_ema": 10, "slow_ema": 20}}
        res = client.post("/api/strategies/deploy", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "strategy_id" in data


# ── Backtest ──────────────────────────────────────────────────────────────────

class TestBacktest:
    def test_run_backtest_returns_200(self):
        payload = {
            "strategy_name": "EMA Cross",
            "instrument": "BTCUSDT.BINANCE",
            "starting_balance": 100_000.0,
        }
        res = client.post("/api/backtest/run", json=payload)
        assert res.status_code == 200

    def test_run_backtest_has_result(self):
        payload = {
            "strategy_name": "EMA Cross",
            "instrument": "BTCUSDT.BINANCE",
            "starting_balance": 100_000.0,
        }
        data = client.post("/api/backtest/run", json=payload).json()
        assert "result" in data
        assert "success" in data

    def test_run_backtest_result_has_metrics(self):
        payload = {
            "strategy_name": "EMA Cross",
            "instrument": "BTCUSDT.BINANCE",
            "starting_balance": 50_000.0,
        }
        data = client.post("/api/backtest/run", json=payload).json()
        result = data["result"]
        assert "total_trades" in result
        assert "win_rate" in result
        assert "ending_balance" in result
