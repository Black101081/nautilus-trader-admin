"""
Nautilus Trader FastAPI Bridge
Provides REST API and WebSocket endpoints for Nautilus Trader integration
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
from datetime import datetime
from enum import Enum

# Initialize FastAPI app
app = FastAPI(
    title="Nautilus Trader API",
    description="REST API and WebSocket bridge for Nautilus Trader",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
nautilus_node = None
websocket_clients: List[WebSocket] = []

# ============================================================================
# Pydantic Models
# ============================================================================

class SystemStatus(BaseModel):
    status: str
    uptime: float
    trader_id: str
    instance_id: str
    strategies_count: int
    orders_count: int
    positions_count: int
    timestamp: str

class StrategyInfo(BaseModel):
    id: str
    name: str
    status: str
    orders_count: int
    positions_count: int
    pnl: float
    created_at: str

class OrderInfo(BaseModel):
    id: str
    strategy_id: str
    instrument_id: str
    side: str
    type: str
    quantity: float
    price: Optional[float]
    status: str
    filled_qty: float
    avg_px: Optional[float]
    created_at: str
    updated_at: str

class PositionInfo(BaseModel):
    id: str
    instrument_id: str
    side: str
    quantity: float
    avg_px: float
    unrealized_pnl: float
    realized_pnl: float
    opened_at: str

class TradeInfo(BaseModel):
    id: str
    order_id: str
    instrument_id: str
    side: str
    quantity: float
    price: float
    commission: float
    timestamp: str

class MarketDataSnapshot(BaseModel):
    instrument_id: str
    bid: float
    ask: float
    last: float
    volume: float
    timestamp: str

class CreateOrderRequest(BaseModel):
    strategy_id: str
    instrument_id: str
    side: str  # "BUY" or "SELL"
    order_type: str  # "MARKET", "LIMIT", "STOP"
    quantity: float
    price: Optional[float] = None
    time_in_force: str = "GTC"

class DeployStrategyRequest(BaseModel):
    strategy_name: str
    config: Dict[str, Any]

# ============================================================================
# Mock Data Functions (for initial testing)
# ============================================================================

def get_mock_system_status() -> SystemStatus:
    """Get mock system status"""
    return SystemStatus(
        status="running",
        uptime=3600.5,
        trader_id="TRADER-001",
        instance_id="instance-001",
        strategies_count=3,
        orders_count=15,
        positions_count=5,
        timestamp=datetime.utcnow().isoformat()
    )

def get_mock_strategies() -> List[StrategyInfo]:
    """Get mock strategies"""
    return [
        StrategyInfo(
            id="strategy-001",
            name="EMA Cross Strategy",
            status="RUNNING",
            orders_count=10,
            positions_count=2,
            pnl=1250.50,
            created_at="2025-10-19T00:00:00Z"
        ),
        StrategyInfo(
            id="strategy-002",
            name="Mean Reversion",
            status="RUNNING",
            orders_count=5,
            positions_count=3,
            pnl=-320.75,
            created_at="2025-10-19T00:00:00Z"
        ),
        StrategyInfo(
            id="strategy-003",
            name="Breakout Strategy",
            status="STOPPED",
            orders_count=0,
            positions_count=0,
            pnl=0.0,
            created_at="2025-10-19T00:00:00Z"
        ),
    ]

def get_mock_orders() -> List[OrderInfo]:
    """Get mock orders"""
    return [
        OrderInfo(
            id="order-001",
            strategy_id="strategy-001",
            instrument_id="BTCUSDT.BINANCE",
            side="BUY",
            type="LIMIT",
            quantity=0.5,
            price=45000.0,
            status="FILLED",
            filled_qty=0.5,
            avg_px=44995.0,
            created_at="2025-10-19T10:00:00Z",
            updated_at="2025-10-19T10:00:05Z"
        ),
        OrderInfo(
            id="order-002",
            strategy_id="strategy-001",
            instrument_id="ETHUSDT.BINANCE",
            side="SELL",
            type="MARKET",
            quantity=2.0,
            price=None,
            status="FILLED",
            filled_qty=2.0,
            avg_px=2450.5,
            created_at="2025-10-19T10:05:00Z",
            updated_at="2025-10-19T10:05:02Z"
        ),
        OrderInfo(
            id="order-003",
            strategy_id="strategy-002",
            instrument_id="BTCUSDT.BINANCE",
            side="BUY",
            type="LIMIT",
            quantity=0.3,
            price=44500.0,
            status="PENDING",
            filled_qty=0.0,
            avg_px=None,
            created_at="2025-10-19T10:10:00Z",
            updated_at="2025-10-19T10:10:00Z"
        ),
    ]

def get_mock_positions() -> List[PositionInfo]:
    """Get mock positions"""
    return [
        PositionInfo(
            id="position-001",
            instrument_id="BTCUSDT.BINANCE",
            side="LONG",
            quantity=0.5,
            avg_px=44995.0,
            unrealized_pnl=250.0,
            realized_pnl=0.0,
            opened_at="2025-10-19T10:00:05Z"
        ),
        PositionInfo(
            id="position-002",
            instrument_id="ETHUSDT.BINANCE",
            side="SHORT",
            quantity=2.0,
            avg_px=2450.5,
            unrealized_pnl=-50.0,
            realized_pnl=100.0,
            opened_at="2025-10-19T10:05:02Z"
        ),
    ]

def get_mock_trades() -> List[TradeInfo]:
    """Get mock trades"""
    return [
        TradeInfo(
            id="trade-001",
            order_id="order-001",
            instrument_id="BTCUSDT.BINANCE",
            side="BUY",
            quantity=0.5,
            price=44995.0,
            commission=22.50,
            timestamp="2025-10-19T10:00:05Z"
        ),
        TradeInfo(
            id="trade-002",
            order_id="order-002",
            instrument_id="ETHUSDT.BINANCE",
            side="SELL",
            quantity=2.0,
            price=2450.5,
            commission=4.90,
            timestamp="2025-10-19T10:05:02Z"
        ),
    ]

# ============================================================================
# REST API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Nautilus Trader API",
        "version": "1.0.0",
        "status": "running",
        "mode": "mock"  # Will change to "live" when real integration is complete
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "nautilus_initialized": False,  # Will be True when real integration is complete
        "mode": "mock"
    }

@app.get("/api/nautilus/status", response_model=SystemStatus)
async def get_system_status():
    """Get Nautilus system status"""
    try:
        return get_mock_system_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/nautilus/strategies", response_model=List[StrategyInfo])
async def get_strategies():
    """Get all strategies"""
    try:
        return get_mock_strategies()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/nautilus/orders", response_model=List[OrderInfo])
async def get_orders(strategy_id: Optional[str] = None):
    """Get all orders, optionally filtered by strategy"""
    try:
        orders = get_mock_orders()
        
        if strategy_id:
            orders = [o for o in orders if o.strategy_id == strategy_id]
        
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/nautilus/positions", response_model=List[PositionInfo])
async def get_positions(strategy_id: Optional[str] = None):
    """Get all positions, optionally filtered by strategy"""
    try:
        positions = get_mock_positions()
        
        # Note: Mock data doesn't have strategy_id, so filtering won't work yet
        return positions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/nautilus/trades", response_model=List[TradeInfo])
async def get_trades(strategy_id: Optional[str] = None, limit: int = 100):
    """Get trade history, optionally filtered by strategy"""
    try:
        trades = get_mock_trades()
        return trades[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nautilus/orders")
async def create_order(request: CreateOrderRequest):
    """Create a new order"""
    try:
        # Mock implementation
        return {
            "success": True,
            "message": "Order created (mock mode)",
            "order_id": f"mock-order-{datetime.utcnow().timestamp()}",
            "note": "This is a mock response. Real order execution will be implemented in Phase 2."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nautilus/strategies/deploy")
async def deploy_strategy(request: DeployStrategyRequest):
    """Deploy a new strategy"""
    try:
        # Mock implementation
        return {
            "success": True,
            "message": f"Strategy {request.strategy_name} deployed (mock mode)",
            "strategy_id": f"mock-{request.strategy_name}-{datetime.utcnow().timestamp()}",
            "note": "This is a mock response. Real strategy deployment will be implemented in Phase 2."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nautilus/strategies/{strategy_id}/start")
async def start_strategy(strategy_id: str):
    """Start a strategy"""
    try:
        return {
            "success": True,
            "message": f"Strategy {strategy_id} started (mock mode)",
            "note": "This is a mock response. Real strategy control will be implemented in Phase 2."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nautilus/strategies/{strategy_id}/stop")
async def stop_strategy(strategy_id: str):
    """Stop a strategy"""
    try:
        return {
            "success": True,
            "message": f"Strategy {strategy_id} stopped (mock mode)",
            "note": "This is a mock response. Real strategy control will be implemented in Phase 2."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/nautilus/orders/{order_id}")
async def cancel_order(order_id: str):
    """Cancel an order"""
    try:
        return {
            "success": True,
            "message": f"Order {order_id} cancelled (mock mode)",
            "note": "This is a mock response. Real order cancellation will be implemented in Phase 2."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# WebSocket Endpoints
# ============================================================================

@app.websocket("/ws/nautilus")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    websocket_clients.append(websocket)
    
    try:
        # Send initial connection message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "mode": "mock",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            
            # Echo back for now
            await websocket.send_json({
                "type": "echo",
                "data": data,
                "timestamp": datetime.utcnow().isoformat()
            })
            
    except WebSocketDisconnect:
        websocket_clients.remove(websocket)

async def broadcast_update(message: Dict[str, Any]):
    """Broadcast update to all connected WebSocket clients"""
    disconnected = []
    for client in websocket_clients:
        try:
            await client.send_json(message)
        except:
            disconnected.append(client)
    
    # Remove disconnected clients
    for client in disconnected:
        websocket_clients.remove(client)

# ============================================================================
# Startup and Shutdown Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("=" * 80)
    print("Starting Nautilus Trader FastAPI Bridge...")
    print("Mode: MOCK (Phase 1 - Initial Setup)")
    print("Real Nautilus integration will be added in Phase 2")
    print("=" * 80)

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("Shutting down Nautilus Trader FastAPI Bridge...")

# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "nautilus_fastapi_bridge:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

