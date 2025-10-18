"""
NautilusTrader API wrapper for web interface
Provides endpoints to run backtests and get results
"""

import json
from decimal import Decimal
from datetime import datetime
import io
import sys

def get_version():
    """Get NautilusTrader version"""
    try:
        import nautilus_trader
        return nautilus_trader.__version__
    except Exception as e:
        return f"Error: {str(e)}"

def run_simple_backtest():
    """Run a simple backtest demo and return results"""
    try:
        from nautilus_trader.backtest.engine import BacktestEngine
        from nautilus_trader.config import BacktestEngineConfig, LoggingConfig
        from nautilus_trader.model.currencies import USD
        from nautilus_trader.model.enums import AccountType, OmsType
        from nautilus_trader.model.identifiers import TraderId, Venue
        from nautilus_trader.model.objects import Money
        from nautilus_trader.test_kit.providers import TestInstrumentProvider
        from nautilus_trader.test_kit.stubs.data import TestDataStubs
        
        # Capture output
        output = io.StringIO()
        
        # Create backtest engine
        config = BacktestEngineConfig(
            trader_id=TraderId("DEMO-001"),
            logging=LoggingConfig(log_level="ERROR"),
        )
        engine = BacktestEngine(config=config)
        
        # Add venue
        venue = Venue("SIM")
        engine.add_venue(
            venue=venue,
            oms_type=OmsType.NETTING,
            account_type=AccountType.MARGIN,
            starting_balances=[Money(100_000, USD)],
            base_currency=USD,
            default_leverage=Decimal(1),
        )
        
        # Add instrument
        instrument = TestInstrumentProvider.default_fx_ccy("AUD/USD", venue=venue)
        engine.add_instrument(instrument)
        
        # Add test data
        bars = [TestDataStubs.bar_5decimal() for _ in range(50)]
        engine.add_data(bars)
        
        # Get account info
        accounts = list(engine.cache.accounts())
        
        result = {
            "success": True,
            "version": get_version(),
            "instrument": str(instrument.id),
            "bars_count": len(bars),
            "starting_balance": "100,000 USD",
            "account_type": "MARGIN",
            "venue": str(venue),
            "timestamp": datetime.now().isoformat(),
        }
        
        # Clean up
        engine.dispose()
        
        return result
        
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }

def get_system_info():
    """Get system and NautilusTrader information"""
    try:
        import platform
        import nautilus_trader
        
        return {
            "success": True,
            "nautilus_version": nautilus_trader.__version__,
            "python_version": platform.python_version(),
            "platform": platform.platform(),
            "architecture": platform.machine(),
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def list_available_indicators():
    """List available technical indicators"""
    try:
        indicators = {
            "Moving Averages": [
                "SimpleMovingAverage (SMA)",
                "ExponentialMovingAverage (EMA)",
                "WeightedMovingAverage (WMA)",
                "HullMovingAverage (HMA)",
            ],
            "Volatility": [
                "AverageTrueRange (ATR)",
                "BollingerBands",
                "KeltnerChannel",
            ],
            "Momentum": [
                "RelativeStrengthIndex (RSI)",
                "MACD",
                "Stochastic",
            ],
            "Trend": [
                "ADX",
                "Aroon",
                "ParabolicSAR",
            ],
        }
        
        return {
            "success": True,
            "indicators": indicators
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Test the API
    print("Testing NautilusTrader API...")
    print("\n1. Version:", get_version())
    print("\n2. System Info:", json.dumps(get_system_info(), indent=2))
    print("\n3. Running backtest...")
    result = run_simple_backtest()
    print(json.dumps(result, indent=2))

