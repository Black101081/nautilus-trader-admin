#!/usr/bin/env python3
"""
Populate PostgreSQL database with realistic trading data for testing
"""

import random
from datetime import datetime, timedelta
from decimal import Decimal
import psycopg2
from postgres_manager import PostgreSQLManager

# Trading instruments
INSTRUMENTS = [
    ('BTCUSD', 'BTC/USD.SIM', 40000, 50000),
    ('ETHUSD', 'ETH/USD.SIM', 2000, 3000),
    ('EURUSD', 'EUR/USD.SIM', 1.05, 1.15),
    ('GBPUSD', 'GBP/USD.SIM', 1.20, 1.30),
    ('USDJPY', 'USD/JPY.SIM', 140, 150),
    ('AUDUSD', 'AUD/USD.SIM', 0.65, 0.75),
]

ORDER_TYPES = ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT']
ORDER_SIDES = ['BUY', 'SELL']
ORDER_STATUSES = ['PENDING', 'FILLED', 'CANCELLED', 'REJECTED', 'EXPIRED']
POSITION_SIDES = ['LONG', 'SHORT', 'FLAT']
POSITION_STATUSES = ['OPEN', 'CLOSED']

def random_price(min_price, max_price):
    """Generate random price within range"""
    return round(random.uniform(min_price, max_price), 2)

def random_quantity(instrument_code):
    """Generate realistic quantity based on instrument"""
    if 'BTC' in instrument_code:
        return round(random.uniform(0.01, 2.0), 8)
    elif 'ETH' in instrument_code:
        return round(random.uniform(0.1, 10.0), 8)
    else:  # Forex
        return round(random.uniform(1000, 100000), 8)

def random_timestamp(days_ago=30):
    """Generate random timestamp within last N days"""
    now = datetime.now()
    start = now - timedelta(days=days_ago)
    random_date = start + timedelta(
        seconds=random.randint(0, int((now - start).total_seconds()))
    )
    return random_date

def calculate_pnl(entry_price, exit_price, quantity, side):
    """Calculate P&L for a trade"""
    if side == 'LONG':
        return (exit_price - entry_price) * quantity
    else:  # SHORT
        return (entry_price - exit_price) * quantity

class DatabasePopulator:
    def __init__(self):
        self.pm = PostgreSQLManager()
        self.conn = psycopg2.connect(
            host='localhost',
            port=5432,
            database='nautilus',
            user='nautilus_user',
            password='nautilus_pass'
        )
        self.cursor = self.conn.cursor()
    
    def clear_existing_data(self):
        """Clear existing test data (keep schema)"""
        print("Clearing existing data...")
        # Delete test data from each table using correct column names
        self.cursor.execute("DELETE FROM trades WHERE trade_id LIKE 'TEST-%'")
        self.cursor.execute("DELETE FROM orders WHERE order_id LIKE 'TEST-%'")
        self.cursor.execute("DELETE FROM positions WHERE position_id LIKE 'TEST-%'")
        self.conn.commit()
        print("✅ Cleared existing test data")
    
    def populate_instruments(self):
        """Ensure instruments exist"""
        print("\nPopulating instruments...")
        for code, symbol, min_price, max_price in INSTRUMENTS:
            self.cursor.execute("""
                INSERT INTO instruments (instrument_id, symbol, asset_class, base_currency, quote_currency)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (instrument_id) DO NOTHING
            """, (symbol, symbol, 'FX' if 'USD' in code else 'CRYPTO', code[:3], code[3:]))
        self.conn.commit()
        print(f"✅ Populated {len(INSTRUMENTS)} instruments")
    
    def populate_orders(self, count=50):
        """Generate realistic orders"""
        print(f"\nPopulating {count} orders...")
        
        for i in range(count):
            instrument_code, instrument_id, min_price, max_price = random.choice(INSTRUMENTS)
            order_type = random.choice(ORDER_TYPES)
            side = random.choice(ORDER_SIDES)
            
            # Determine status based on probabilities
            status_weights = [0.1, 0.7, 0.15, 0.03, 0.02]  # PENDING, FILLED, CANCELLED, REJECTED, EXPIRED
            status = random.choices(ORDER_STATUSES, weights=status_weights)[0]
            
            quantity = random_quantity(instrument_code)
            price = random_price(min_price, max_price) if order_type != 'MARKET' else None
            timestamp = random_timestamp(30)
            
            # Calculate filled quantity
            filled_qty = quantity if status == 'FILLED' else (
                round(quantity * random.uniform(0, 1), 8) if status == 'PENDING' else 0
            )
            
            # Average fill price
            avg_price = price if price else random_price(min_price, max_price)
            
            self.cursor.execute("""
                INSERT INTO orders (
                    order_id, instrument_id, side, order_type, quantity, 
                    price, filled_qty, avg_px, status, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                f'TEST-O-{i+1:04d}',
                instrument_id,
                side,
                order_type,
                str(quantity),
                str(price) if price else None,
                str(filled_qty),
                str(avg_price),
                status,
                timestamp
            ))
        
        self.conn.commit()
        print(f"✅ Populated {count} orders")
    
    def populate_trades(self, count=30):
        """Generate realistic trades"""
        print(f"\nPopulating {count} trades...")
        
        for i in range(count):
            instrument_code, instrument_id, min_price, max_price = random.choice(INSTRUMENTS)
            side = random.choice(ORDER_SIDES)
            quantity = random_quantity(instrument_code)
            price = random_price(min_price, max_price)
            timestamp = random_timestamp(30)
            
            # Commission (0.1% of trade value)
            commission = round(price * float(quantity) * 0.001, 2)
            
            # P&L (for closed trades, random between -20% and +30%)
            pnl = round(price * float(quantity) * random.uniform(-0.2, 0.3), 2)
            
            self.cursor.execute("""
                INSERT INTO trades (
                    trade_id, order_id, instrument_id, side, quantity,
                    price, commission, realized_pnl, executed_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                f'TEST-T-{i+1:04d}',
                f'TEST-O-{random.randint(1, 50):04d}',  # Link to random order
                instrument_id,
                side,
                str(quantity),
                str(price),
                str(commission),
                str(pnl),
                timestamp
            ))
        
        self.conn.commit()
        print(f"✅ Populated {count} trades")
    
    def populate_positions(self, count=15):
        """Generate realistic positions (mix of open and closed)"""
        print(f"\nPopulating {count} positions...")
        
        for i in range(count):
            instrument_code, instrument_id, min_price, max_price = random.choice(INSTRUMENTS)
            
            # 60% OPEN, 40% CLOSED
            is_open = random.random() < 0.6
            status = 'OPEN' if is_open else 'CLOSED'
            
            # Side
            if status == 'CLOSED':
                side = 'FLAT'
                quantity = 0
            else:
                side = random.choice(['LONG', 'SHORT'])
                quantity = random_quantity(instrument_code)
            
            # Prices
            entry_price = random_price(min_price, max_price)
            current_price = random_price(min_price, max_price)
            
            # P&L calculations
            if status == 'OPEN':
                unrealized_pnl = calculate_pnl(entry_price, current_price, float(quantity), side)
                realized_pnl = 0
            else:
                unrealized_pnl = 0
                # For closed positions, realized P&L is between -30% and +50%
                realized_pnl = entry_price * random.uniform(-0.3, 0.5) * 100
            
            # Timestamps
            opened_at = random_timestamp(30)
            closed_at = opened_at + timedelta(hours=random.randint(1, 720)) if status == 'CLOSED' else None
            
            self.cursor.execute("""
                INSERT INTO positions (
                    position_id, instrument_id, side, quantity, entry_price,
                    current_price, unrealized_pnl, realized_pnl, status,
                    opened_at, closed_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                f'TEST-P-{i+1:04d}',
                instrument_id,
                side,
                str(quantity),
                str(entry_price),
                str(current_price),
                str(round(unrealized_pnl, 2)),
                str(round(realized_pnl, 2)),
                status,
                opened_at,
                closed_at
            ))
        
        self.conn.commit()
        print(f"✅ Populated {count} positions")
    
    def print_summary(self):
        """Print summary of populated data"""
        print("\n" + "="*60)
        print("DATABASE POPULATION SUMMARY")
        print("="*60)
        
        # Positions
        result = self.pm.query_table('positions')
        positions = result['rows']
        open_positions = [p for p in positions if p[9] == 'OPEN']
        closed_positions = [p for p in positions if p[9] == 'CLOSED']
        
        print(f"\n📊 Positions: {len(positions)} total")
        print(f"   - Open: {len(open_positions)}")
        print(f"   - Closed: {len(closed_positions)}")
        
        # Orders
        result = self.pm.query_table('orders')
        orders = result['rows']
        filled_orders = [o for o in orders if o[8] == 'FILLED']
        pending_orders = [o for o in orders if o[8] == 'PENDING']
        cancelled_orders = [o for o in orders if o[8] == 'CANCELLED']
        
        print(f"\n📝 Orders: {len(orders)} total")
        print(f"   - Filled: {len(filled_orders)}")
        print(f"   - Pending: {len(pending_orders)}")
        print(f"   - Cancelled: {len(cancelled_orders)}")
        
        # Trades
        result = self.pm.query_table('trades')
        trades = result['rows']
        
        print(f"\n💰 Trades: {len(trades)} total")
        
        # Instruments
        result = self.pm.query_table('instruments')
        instruments = result['rows']
        
        print(f"\n🎯 Instruments: {len(instruments)} total")
        
        print("\n" + "="*60)
        print("✅ Database population complete!")
        print("="*60 + "\n")
    
    def close(self):
        """Close database connection"""
        self.cursor.close()
        self.conn.close()

def main():
    """Main execution"""
    print("\n🚀 Starting database population...\n")
    
    populator = DatabasePopulator()
    
    try:
        # Clear existing test data
        populator.clear_existing_data()
        
        # Populate tables
        populator.populate_instruments()
        populator.populate_orders(count=50)
        populator.populate_trades(count=30)
        populator.populate_positions(count=15)
        
        # Print summary
        populator.print_summary()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise
    finally:
        populator.close()

if __name__ == '__main__':
    main()

