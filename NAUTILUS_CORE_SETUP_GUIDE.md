# NautilusTrader Core - Setup Guide for Real Trading

## Overview

Để chạy NautilusTrader Core với dữ liệu thực và tạo tables trong databases, bạn cần:

1. **Configure Nautilus Core** với database backends
2. **Run a trading strategy** (backtest hoặc live)
3. **Connect to data providers** để lấy market data
4. **Connect to brokers** (optional) để live trading

---

## 1. Database Configuration

### PostgreSQL Schema Creation

Nautilus sẽ tự động tạo tables khi bạn chạy với PostgreSQL cache backend.

**File: `nautilus_config.json`**

```json
{
  "cache": {
    "database": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "nautilus_user",
    "password": "nautilus_pass",
    "database_name": "nautilus"
  },
  "data_engine": {
    "time_bars_build_with_no_updates": true,
    "time_bars_timestamp_on_close": true,
    "validate_data_sequence": true
  }
}
```

### Redis Configuration

Redis được dùng cho live trading state. Nautilus sẽ tự động sử dụng nếu configured.

```json
{
  "cache": {
    "database": "redis",
    "host": "localhost",
    "port": 6379,
    "flush": false
  }
}
```

---

## 2. Running Nautilus Core

### Option A: Backtesting (Recommended for Testing)

Backtesting sẽ tạo tables và populate data mà không cần live connections.

**File: `backtest_example.py`**

```python
#!/usr/bin/env python3
"""
Example backtest that will create database tables and populate data.
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
from nautilus_trader.persistence.catalog import ParquetDataCatalog
from nautilus_trader.persistence.wranglers import QuoteTickDataWrangler
from nautilus_trader.test_kit.providers import TestInstrumentProvider
from nautilus_trader.test_kit.strategies import EMACross
import pandas as pd

# Configure logging
logging_config = LoggingConfig(log_level="INFO")

# Create backtest engine config
config = BacktestEngineConfig(
    trader_id=TraderId("BACKTESTER-001"),
    logging=logging_config,
    # Cache configuration - will create PostgreSQL tables
    cache_database={
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "nautilus_user",
        "password": "nautilus_pass",
        "database": "nautilus",
    },
)

# Create backtest engine
engine = BacktestEngine(config=config)

# Add venue
venue = Venue("SIM")
engine.add_venue(
    venue=venue,
    oms_type=OmsType.NETTING,
    account_type=AccountType.MARGIN,
    base_currency=USD,
    starting_balances=[Money(1_000_000, USD)],
)

# Add instrument
instrument = TestInstrumentProvider.default_fx_ccy("EUR/USD")
engine.add_instrument(instrument)

# Generate sample data
def generate_sample_quotes():
    """Generate sample quote data for testing."""
    dates = pd.date_range("2024-01-01", "2024-01-31", freq="1min")
    data = []
    
    bid = 1.1000
    ask = 1.1002
    
    for date in dates:
        bid += (hash(str(date)) % 10 - 5) * 0.0001
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
wrangler = QuoteTickDataWrangler(instrument=instrument)
ticks = wrangler.process(df)
engine.add_data(ticks)

# Add strategy
strategy = EMACross(
    instrument_id=instrument.id,
    bar_type=f"{instrument.id}-1-MINUTE-BID-INTERNAL",
    fast_ema_period=10,
    slow_ema_period=20,
    trade_size=Decimal("100000"),
)
engine.add_strategy(strategy)

# Run backtest
print("Running backtest...")
engine.run()

# Get results
print("\n" + "="*50)
print("BACKTEST RESULTS")
print("="*50)

# Account statistics
account = engine.trader.generate_account_report(venue)
print(f"\nAccount Balance: {account}")

# Order statistics  
orders = engine.trader.generate_order_fills_report()
print(f"\nTotal Orders: {len(orders)}")

# Position statistics
positions = engine.trader.generate_positions_report()
print(f"\nTotal Positions: {len(positions)}")

print("\n✅ Backtest complete! Check PostgreSQL for created tables.")
```

**Run the backtest:**

```bash
cd /home/ubuntu/nautilus-trader-demo
python3.11 backtest_example.py
```

This will create tables in PostgreSQL:
- `instruments`
- `orders`
- `trades`
- `positions`
- `accounts`
- `bars`
- `quotes`

---

## 3. Live Trading Setup

### Step 1: Install Data Provider Adapter

Nautilus supports nhiều data providers:

**Interactive Brokers:**
```bash
pip install nautilus_trader[ib]
```

**Binance:**
```bash
pip install nautilus_trader[binance]
```

**Coinbase:**
```bash  
pip install nautilus_trader[coinbase]
```

### Step 2: Configure Live Trading

**File: `live_trading_config.json`**

```json
{
  "trader_id": "TRADER-001",
  "log_level": "INFO",
  
  "cache": {
    "database": "redis",
    "host": "localhost",
    "port": 6379
  },
  
  "data_clients": {
    "BINANCE": {
      "api_key": "YOUR_API_KEY",
      "api_secret": "YOUR_API_SECRET",
      "testnet": true
    }
  },
  
  "exec_clients": {
    "BINANCE": {
      "api_key": "YOUR_API_KEY",
      "api_secret": "YOUR_API_SECRET",
      "testnet": true
    }
  },
  
  "strategies": [
    {
      "strategy_path": "strategies.ema_cross.EMACross",
      "config": {
        "instrument_id": "BTCUSDT.BINANCE",
        "bar_type": "BTCUSDT.BINANCE-1-MINUTE-LAST-EXTERNAL",
        "fast_ema": 10,
        "slow_ema": 20
      }
    }
  ]
}
```

### Step 3: Run Live Trading

**File: `run_live.py`**

```python
#!/usr/bin/env python3
"""
Run live trading with Nautilus Core.
"""

from nautilus_trader.live.node import TradingNode
from nautilus_trader.config import TradingNodeConfig
import json

# Load configuration
with open("live_trading_config.json") as f:
    config_dict = json.load(f)

# Create trading node config
config = TradingNodeConfig.parse_obj(config_dict)

# Create and start trading node
node = TradingNode(config=config)

try:
    print("Starting live trading node...")
    node.start()
    
    print("✅ Trading node started successfully!")
    print("Press Ctrl+C to stop...")
    
    # Keep running
    node.run()
    
except KeyboardInterrupt:
    print("\nStopping trading node...")
    node.stop()
    print("✅ Trading node stopped.")
```

**Run live trading:**

```bash
python3.11 run_live.py
```

---

## 4. Data Sources

### Option A: Historical Data (for Backtesting)

**1. Download from exchanges:**

```python
from nautilus_trader.adapters.binance.http.client import BinanceHttpClient
from nautilus_trader.adapters.binance.common.enums import BinanceKlineInterval
import pandas as pd

# Initialize client
client = BinanceHttpClient()

# Download klines (candlestick data)
klines = client.request_klines(
    symbol="BTCUSDT",
    interval=BinanceKlineInterval.MINUTE_1,
    start_time=1704067200000,  # 2024-01-01
    end_time=1706745600000,    # 2024-02-01
)

# Convert to DataFrame
df = pd.DataFrame(klines, columns=[
    'timestamp', 'open', 'high', 'low', 'close', 
    'volume', 'close_time', 'quote_volume', 'trades',
    'taker_buy_base', 'taker_buy_quote', 'ignore'
])

# Save to Parquet
df.to_parquet('~/nautilus-data/bars/BTCUSDT_1m_202401.parquet')
```

**2. Use Nautilus Data Catalog:**

```python
from nautilus_trader.persistence.catalog import ParquetDataCatalog

# Create catalog
catalog = ParquetDataCatalog("~/nautilus-data")

# Write data
catalog.write_data([bars])  # bars is list of Bar objects

# Read data
bars = catalog.bars(
    instrument_ids=["BTCUSDT.BINANCE"],
    bar_type="BTCUSDT.BINANCE-1-MINUTE-LAST-EXTERNAL",
    start="2024-01-01",
    end="2024-02-01",
)
```

### Option B: Live Data Streaming

Live data requires broker/exchange API credentials:

**Binance Example:**

```python
from nautilus_trader.adapters.binance.factories import BinanceLiveDataClientFactory
from nautilus_trader.adapters.binance.config import BinanceDataClientConfig

# Configure Binance data client
config = BinanceDataClientConfig(
    api_key="YOUR_API_KEY",
    api_secret="YOUR_API_SECRET",
    testnet=True,  # Use testnet for testing
)

# Create data client
data_client = BinanceLiveDataClientFactory.create(
    config=config,
    engine=engine,
)

# Subscribe to market data
data_client.subscribe_quote_ticks(instrument_id)
data_client.subscribe_trade_ticks(instrument_id)
data_client.subscribe_bars(bar_type)
```

---

## 5. Verification

### Check PostgreSQL Tables

```bash
sudo -u postgres psql -d nautilus -c "\dt"
```

Expected tables:
- `instruments` - Trading instruments
- `orders` - Order history
- `trades` - Executed trades
- `positions` - Position history
- `accounts` - Account snapshots
- `bars` - OHLCV bar data
- `quotes` - Quote tick data
- `trades_tick` - Trade tick data

### Check Redis Keys

```bash
redis-cli KEYS "*"
```

Expected key patterns:
- `nautilus:orders:*` - Active orders
- `nautilus:positions:*` - Open positions
- `nautilus:accounts:*` - Account state
- `nautilus:cache:*` - Cached data

### Check Parquet Files

```bash
ls -lh ~/nautilus-data/bars/
ls -lh ~/nautilus-data/quotes/
ls -lh ~/nautilus-data/trades/
```

---

## 6. Integration with Admin Interface

Once Nautilus Core is running with real data, the admin interface will automatically show:

### Core Management Page
- ✅ Real component status
- ✅ Actual uptime
- ✅ Live metrics

### Database Management Page
- ✅ PostgreSQL tables with real data
- ✅ Redis keys with live trading state
- ✅ Parquet files with historical data

### Execution Management Page
- ✅ Real orders
- ✅ Live positions
- ✅ Actual execution metrics

---

## 7. Quick Start Script

**File: `setup_nautilus_real.sh`**

```bash
#!/bin/bash

echo "Setting up NautilusTrader Core for real trading..."

# 1. Install Nautilus with all adapters
pip3 install 'nautilus_trader[ib,binance,coinbase]'

# 2. Create data directories
mkdir -p ~/nautilus-data/{bars,quotes,trades,backtests}

# 3. Initialize PostgreSQL schema
sudo -u postgres psql -d nautilus << EOF
-- Create tables will be done by Nautilus on first run
-- Just verify connection
SELECT version();
EOF

# 4. Test Redis connection
redis-cli PING

# 5. Run sample backtest to create tables
python3.11 backtest_example.py

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your API keys in live_trading_config.json"
echo "2. Run: python3.11 run_live.py"
echo "3. Access admin interface at http://localhost:3000"
```

**Make executable and run:**

```bash
chmod +x setup_nautilus_real.sh
./setup_nautilus_real.sh
```

---

## 8. Troubleshooting

### Issue: PostgreSQL tables not created

**Solution:** Run a backtest first. Tables are created on first Nautilus run with PostgreSQL cache.

### Issue: Redis empty

**Solution:** Redis is only populated during live trading. Run live trading or use Redis cache in backtest.

### Issue: No market data

**Solution:** 
1. Download historical data from exchanges
2. Or connect to live data feed with API credentials

### Issue: API authentication failed

**Solution:**
1. Check API keys are correct
2. Verify API permissions (read + trade)
3. Use testnet for testing

---

## 9. Production Checklist

Before running in production:

- [ ] Test with paper trading / testnet first
- [ ] Configure proper risk limits
- [ ] Set up monitoring and alerts
- [ ] Enable audit logging
- [ ] Configure database backups
- [ ] Test emergency stop procedures
- [ ] Verify broker connections
- [ ] Test with small position sizes first

---

## Summary

**To get real data in Nautilus Core:**

1. **Backtesting:** Run backtest script → Creates PostgreSQL tables with historical data
2. **Live Trading:** Configure API keys → Connect to exchange → Real-time data flows into Redis
3. **Historical Data:** Download from exchanges → Save to Parquet → Use in backtests

**Admin interface will automatically reflect real data once Nautilus Core is running!**

For more information:
- [NautilusTrader Documentation](https://nautilustrader.io/docs/)
- [API Reference](https://nautilustrader.io/api_reference/)
- [Examples](https://github.com/nautechsystems/nautilus_trader/tree/master/examples)

