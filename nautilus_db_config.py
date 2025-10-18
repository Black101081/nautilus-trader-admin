"""
NautilusTrader Database Configuration
Configures Redis, PostgreSQL, and Parquet storage backends
"""

from nautilus_trader.config import CacheConfig, DatabaseConfig

# Redis Configuration - For live trading state persistence
redis_config = DatabaseConfig(
    type="redis",
    host="localhost",
    port=6379,
    timeout=2,
    # username=None,  # Optional
    # password=None,  # Optional
)

# PostgreSQL Configuration - For historical data storage
postgres_config = DatabaseConfig(
    type="postgres",
    host="localhost",
    port=5432,
    username="nautilus_user",
    password="nautilus_pass",
    # database="nautilus",  # Not supported in DatabaseConfig
    timeout=5,
)

# Cache Configuration with Redis backend
cache_config_redis = CacheConfig(
    database=redis_config,
    encoding="msgpack",
    timestamps_as_iso8601=False,
    buffer_interval_ms=100,
    use_trader_prefix=True,
    flush_on_start=False,
    drop_instruments_on_reset=True,
    tick_capacity=10_000,
    bar_capacity=10_000,
)

# Cache Configuration with PostgreSQL backend
cache_config_postgres = CacheConfig(
    database=postgres_config,
    encoding="msgpack",
    timestamps_as_iso8601=True,
    buffer_interval_ms=1000,
    use_trader_prefix=True,
    flush_on_start=False,
    drop_instruments_on_reset=False,
    tick_capacity=100_000,
    bar_capacity=100_000,
)

# Parquet Data Paths
PARQUET_DATA_DIR = "/home/ubuntu/nautilus-data"
PARQUET_BARS_DIR = f"{PARQUET_DATA_DIR}/bars"
PARQUET_QUOTES_DIR = f"{PARQUET_DATA_DIR}/quotes"
PARQUET_TRADES_DIR = f"{PARQUET_DATA_DIR}/trades"
PARQUET_BACKTESTS_DIR = f"{PARQUET_DATA_DIR}/backtests"

# Database Status Check Functions
def check_redis_connection():
    """Check if Redis is accessible"""
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, socket_timeout=2)
        r.ping()
        return True, "Redis is running"
    except Exception as e:
        return False, f"Redis error: {str(e)}"

def check_postgres_connection():
    """Check if PostgreSQL is accessible"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="nautilus_user",
            password="nautilus_pass",
            database="nautilus",
            connect_timeout=5
        )
        conn.close()
        return True, "PostgreSQL is running"
    except Exception as e:
        return False, f"PostgreSQL error: {str(e)}"

def check_parquet_storage():
    """Check if Parquet directories are accessible"""
    import os
    dirs = [PARQUET_BARS_DIR, PARQUET_QUOTES_DIR, PARQUET_TRADES_DIR, PARQUET_BACKTESTS_DIR]
    for d in dirs:
        if not os.path.exists(d):
            return False, f"Directory not found: {d}"
    return True, "Parquet storage directories ready"

def get_database_status():
    """Get status of all databases"""
    redis_ok, redis_msg = check_redis_connection()
    postgres_ok, postgres_msg = check_postgres_connection()
    parquet_ok, parquet_msg = check_parquet_storage()
    
    return {
        "redis": {"status": "connected" if redis_ok else "error", "message": redis_msg},
        "postgresql": {"status": "connected" if postgres_ok else "error", "message": postgres_msg},
        "parquet": {"status": "ready" if parquet_ok else "error", "message": parquet_msg},
    }

if __name__ == "__main__":
    print("NautilusTrader Database Configuration")
    print("=" * 50)
    
    status = get_database_status()
    for db_name, db_status in status.items():
        print(f"\n{db_name.upper()}:")
        print(f"  Status: {db_status['status']}")
        print(f"  Message: {db_status['message']}")
    
    print("\n" + "=" * 50)
    print("Configuration ready!")

