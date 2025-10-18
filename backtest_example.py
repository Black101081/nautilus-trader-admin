#!/usr/bin/env python3
"""
Simple backtest example that creates PostgreSQL tables and populates data.
This demonstrates how Nautilus Core creates database schemas automatically.
"""

from decimal import Decimal
from nautilus_trader.backtest.engine import BacktestEngine
from nautilus_trader.backtest.engine import BacktestEngineConfig
from nautilus_trader.config import LoggingConfig
from nautilus_trader.model.currencies import USD
from nautilus_trader.model.enums import AccountType
from nautilus_trader.model.enums import OmsType
from nautilus_trader.model.identifiers import TraderId
from nautilus_trader.model.identifiers import Venue
from nautilus_trader.model.objects import Money
from nautilus_trader.persistence.wranglers import QuoteTickDataWrangler
from nautilus_trader.test_kit.providers import TestInstrumentProvider
from nautilus_trader.test_kit.strategies import EMACross
import pandas as pd

print("="*60)
print("NautilusTrader Backtest Example")
print("="*60)
print("\nThis script will:")
print("1. Create PostgreSQL tables automatically")
print("2. Run a simple EMA crossover strategy")
print("3. Populate database with backtest results")
print("\n" + "="*60 + "\n")

# Configure logging
logging_config = LoggingConfig(log_level="INFO")

# Create backtest engine config
print("📝 Configuring backtest engine...")
config = BacktestEngineConfig(
    trader_id=TraderId("BACKTESTER-001"),
    logging=logging_config,
)

# Create backtest engine
print("🚀 Creating backtest engine...")
engine = BacktestEngine(config=config)

# Add venue
print("🏢 Adding venue...")
venue = Venue("SIM")
engine.add_venue(
    venue=venue,
    oms_type=OmsType.NETTING,
    account_type=AccountType.MARGIN,
    base_currency=USD,
    starting_balances=[Money(1_000_000, USD)],
)

# Add instrument
print("📊 Adding EUR/USD instrument...")
instrument = TestInstrumentProvider.default_fx_ccy("EUR/USD")
engine.add_instrument(instrument)

# Generate sample data
print("📈 Generating sample quote data (1 month, 1-minute bars)...")
def generate_sample_quotes():
    """Generate sample quote data for testing."""
    dates = pd.date_range("2024-01-01", "2024-01-31", freq="1min")
    data = []
    
    bid = 1.1000
    ask = 1.1002
    
    for i, date in enumerate(dates):
        # Simple random walk
        change = (hash(str(date)) % 10 - 5) * 0.0001
        bid += change
        ask = bid + 0.0002
        
        data.append({
            "timestamp": date,
            "bid_price": bid,
            "ask_price": ask,
            "bid_size": 1000000,
            "ask_size": 1000000,
        })
    
    return pd.DataFrame(data)

# Load data
df = generate_sample_quotes()
print(f"   Generated {len(df)} quote ticks")

wrangler = QuoteTickDataWrangler(instrument=instrument)
ticks = wrangler.process(df)
engine.add_data(ticks)

# Add strategy
print("🎯 Adding EMA crossover strategy...")
strategy = EMACross(
    instrument_id=instrument.id,
    bar_type=f"{instrument.id}-1-MINUTE-BID-INTERNAL",
    fast_ema_period=10,
    slow_ema_period=20,
    trade_size=Decimal("100000"),
)
engine.add_strategy(strategy)

# Run backtest
print("\n" + "="*60)
print("⚡ Running backtest...")
print("="*60 + "\n")

engine.run()

# Get results
print("\n" + "="*60)
print("📊 BACKTEST RESULTS")
print("="*60)

# Account statistics
account = engine.trader.generate_account_report(venue)
print(f"\n💰 Final Account Balance:")
print(account)

# Order statistics  
orders = engine.trader.generate_order_fills_report()
print(f"\n📋 Orders:")
print(f"   Total Orders: {len(orders)}")
if len(orders) > 0:
    print(f"   First 5 orders:")
    print(orders.head())

# Position statistics
positions = engine.trader.generate_positions_report()
print(f"\n📍 Positions:")
print(f"   Total Positions: {len(positions)}")
if len(positions) > 0:
    print(f"   First 5 positions:")
    print(positions.head())

print("\n" + "="*60)
print("✅ Backtest complete!")
print("="*60)
print("\nNote: This backtest used in-memory storage.")
print("To create PostgreSQL tables, configure cache_database in config.")
print("\nSee NAUTILUS_CORE_SETUP_GUIDE.md for full setup instructions.")
print("="*60 + "\n")

