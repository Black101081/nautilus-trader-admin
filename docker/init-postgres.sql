-- PostgreSQL Initialization Script for Nautilus Trader
-- Creates tables for Nautilus Core data storage

-- Instruments table
CREATE TABLE IF NOT EXISTS instruments (
    instrument_id VARCHAR(64) PRIMARY KEY,
    symbol VARCHAR(64) NOT NULL,
    asset_class VARCHAR(32),
    base_currency VARCHAR(16),
    quote_currency VARCHAR(16),
    tick_size DECIMAL(20,8),
    lot_size DECIMAL(20,8),
    min_quantity DECIMAL(20,8),
    max_quantity DECIMAL(20,8),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(64) PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    order_type VARCHAR(32) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8),
    filled_qty DECIMAL(20,8) DEFAULT 0,
    avg_px DECIMAL(20,8),
    status VARCHAR(32) NOT NULL,
    time_in_force VARCHAR(16),
    client_order_id VARCHAR(64),
    venue_order_id VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
    trade_id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64),
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    commission DECIMAL(20,8),
    commission_currency VARCHAR(16),
    realized_pnl DECIMAL(20,8),
    venue_trade_id VARCHAR(64),
    executed_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
    position_id VARCHAR(64) PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    entry_price DECIMAL(20,8) NOT NULL,
    current_price DECIMAL(20,8),
    unrealized_pnl DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    status VARCHAR(32) NOT NULL,
    opened_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    account_id VARCHAR(64) PRIMARY KEY,
    account_type VARCHAR(32) NOT NULL,
    base_currency VARCHAR(16) NOT NULL,
    balance DECIMAL(20,8) NOT NULL,
    equity DECIMAL(20,8),
    margin_used DECIMAL(20,8),
    margin_available DECIMAL(20,8),
    unrealized_pnl DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bars (OHLCV) table
CREATE TABLE IF NOT EXISTS bars (
    id SERIAL PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    bar_type VARCHAR(32) NOT NULL,
    open DECIMAL(20,8) NOT NULL,
    high DECIMAL(20,8) NOT NULL,
    low DECIMAL(20,8) NOT NULL,
    close DECIMAL(20,8) NOT NULL,
    volume DECIMAL(20,8) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE
);

-- Quote ticks table
CREATE TABLE IF NOT EXISTS quote_ticks (
    id SERIAL PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    bid_price DECIMAL(20,8) NOT NULL,
    ask_price DECIMAL(20,8) NOT NULL,
    bid_size DECIMAL(20,8) NOT NULL,
    ask_size DECIMAL(20,8) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE
);

-- Trade ticks table
CREATE TABLE IF NOT EXISTS trade_ticks (
    id SERIAL PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    size DECIMAL(20,8) NOT NULL,
    aggressor_side VARCHAR(16),
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_instrument ON orders(instrument_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trades_order ON trades(order_id);
CREATE INDEX IF NOT EXISTS idx_trades_instrument ON trades(instrument_id);
CREATE INDEX IF NOT EXISTS idx_trades_executed_at ON trades(executed_at DESC);

CREATE INDEX IF NOT EXISTS idx_positions_instrument ON positions(instrument_id);
CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
CREATE INDEX IF NOT EXISTS idx_positions_opened_at ON positions(opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_bars_instrument_timestamp ON bars(instrument_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_quote_ticks_instrument_timestamp ON quote_ticks(instrument_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_trade_ticks_instrument_timestamp ON trade_ticks(instrument_id, timestamp DESC);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nautilus_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nautilus_user;

-- Insert sample instruments
INSERT INTO instruments (instrument_id, symbol, asset_class, base_currency, quote_currency, tick_size, lot_size, min_quantity, max_quantity)
VALUES 
    ('BTC/USD.SIM', 'BTC/USD.SIM', 'CRYPTO', 'BTC', 'USD', 0.01, 0.00000001, 0.00000001, 1000.0),
    ('ETH/USD.SIM', 'ETH/USD.SIM', 'CRYPTO', 'ETH', 'USD', 0.01, 0.00000001, 0.00000001, 10000.0),
    ('EUR/USD.SIM', 'EUR/USD.SIM', 'FX', 'EUR', 'USD', 0.00001, 1000.0, 1000.0, 10000000.0),
    ('GBP/USD.SIM', 'GBP/USD.SIM', 'FX', 'GBP', 'USD', 0.00001, 1000.0, 1000.0, 10000000.0),
    ('USD/JPY.SIM', 'USD/JPY.SIM', 'FX', 'USD', 'JPY', 0.001, 1000.0, 1000.0, 10000000.0),
    ('AUD/USD.SIM', 'AUD/USD.SIM', 'FX', 'AUD', 'USD', 0.00001, 1000.0, 1000.0, 10000000.0)
ON CONFLICT (instrument_id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_instruments_updated_at BEFORE UPDATE ON instruments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL initialization completed successfully!';
    RAISE NOTICE 'Created 8 tables: instruments, orders, trades, positions, accounts, bars, quote_ticks, trade_ticks';
    RAISE NOTICE 'Created indexes for performance optimization';
    RAISE NOTICE 'Inserted 6 sample instruments';
END $$;

