#!/usr/bin/env python3.11
"""
Test script to explore NautilusTrader Core components and architecture
"""

import nautilus_trader

print("=" * 80)
print("NAUTILUS TRADER CORE EXPLORATION")
print("=" * 80)
print(f"Version: {nautilus_trader.__version__}")
print()

# Explore main modules
print("Main Modules:")
print("-" * 80)
import inspect
for name, obj in inspect.getmembers(nautilus_trader):
    if not name.startswith('_'):
        print(f"  {name}: {type(obj)}")

print()
print("=" * 80)
print("CORE COMPONENTS")
print("=" * 80)

# Try to import core components
try:
    from nautilus_trader.core import nautilus_pyo3
    print("✓ nautilus_pyo3 (Rust core) imported successfully")
except ImportError as e:
    print(f"✗ nautilus_pyo3 import failed: {e}")

try:
    from nautilus_trader.common import component
    print("✓ common.component imported successfully")
except ImportError as e:
    print(f"✗ common.component import failed: {e}")

try:
    from nautilus_trader.cache.cache import Cache
    print("✓ Cache imported successfully")
except ImportError as e:
    print(f"✗ Cache import failed: {e}")

try:
    from nautilus_trader.common.clock import Clock
    print("✓ Clock imported successfully")
except ImportError as e:
    print(f"✗ Clock import failed: {e}")

try:
    from nautilus_trader.msgbus.bus import MessageBus
    print("✓ MessageBus imported successfully")
except ImportError as e:
    print(f"✗ MessageBus import failed: {e}")

try:
    from nautilus_trader.portfolio.portfolio import Portfolio
    print("✓ Portfolio imported successfully")
except ImportError as e:
    print(f"✗ Portfolio import failed: {e}")

print()
print("=" * 80)
print("ENGINES")
print("=" * 80)

try:
    from nautilus_trader.data.engine import DataEngine
    print("✓ DataEngine imported successfully")
except ImportError as e:
    print(f"✗ DataEngine import failed: {e}")

try:
    from nautilus_trader.execution.engine import ExecutionEngine
    print("✓ ExecutionEngine imported successfully")
except ImportError as e:
    print(f"✗ ExecutionEngine import failed: {e}")

try:
    from nautilus_trader.risk.engine import RiskEngine
    print("✓ RiskEngine imported successfully")
except ImportError as e:
    print(f"✗ RiskEngine import failed: {e}")

print()
print("=" * 80)
print("ADAPTERS")
print("=" * 80)

# Check available adapters
import pkgutil
import nautilus_trader.adapters

print("Available adapters:")
for importer, modname, ispkg in pkgutil.iter_modules(nautilus_trader.adapters.__path__):
    print(f"  - {modname}")

print()
print("=" * 80)
print("MODEL OBJECTS")
print("=" * 80)

try:
    from nautilus_trader.model.identifiers import Venue, InstrumentId, TraderId
    print("✓ Identifiers imported successfully")
except ImportError as e:
    print(f"✗ Identifiers import failed: {e}")

try:
    from nautilus_trader.model.instruments import Instrument
    print("✓ Instrument imported successfully")
except ImportError as e:
    print(f"✗ Instrument import failed: {e}")

try:
    from nautilus_trader.model.orders import Order
    print("✓ Order imported successfully")
except ImportError as e:
    print(f"✗ Order import failed: {e}")

try:
    from nautilus_trader.model.position import Position
    print("✓ Position imported successfully")
except ImportError as e:
    print(f"✗ Position import failed: {e}")

print()
print("=" * 80)
print("BACKTESTING")
print("=" * 80)

try:
    from nautilus_trader.backtest.engine import BacktestEngine
    print("✓ BacktestEngine imported successfully")
except ImportError as e:
    print(f"✗ BacktestEngine import failed: {e}")

try:
    from nautilus_trader.backtest.node import BacktestNode
    print("✓ BacktestNode imported successfully")
except ImportError as e:
    print(f"✗ BacktestNode import failed: {e}")

print()
print("=" * 80)
print("LIVE TRADING")
print("=" * 80)

try:
    from nautilus_trader.live.node import TradingNode
    print("✓ TradingNode imported successfully")
except ImportError as e:
    print(f"✗ TradingNode import failed: {e}")

print()
print("=" * 80)
print("PERSISTENCE")
print("=" * 80)

try:
    from nautilus_trader.persistence.catalog import ParquetDataCatalog
    print("✓ ParquetDataCatalog imported successfully")
except ImportError as e:
    print(f"✗ ParquetDataCatalog import failed: {e}")

print()
print("=" * 80)
print("EXPLORATION COMPLETE")
print("=" * 80)

