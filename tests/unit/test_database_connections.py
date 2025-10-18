"""
Unit Tests for Database Connections
Tests PostgreSQL, Redis, MySQL connections
"""

import sys
import os

# Add server directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../server'))

def test_postgres_connection():
    """Test PostgreSQL connection"""
    print("\n" + "="*80)
    print("TESTING POSTGRESQL CONNECTION")
    print("="*80)
    
    try:
        from postgres_manager import PostgreSQLManager
        
        pg = PostgreSQLManager()
        info = pg.get_info()
        
        if info.get('connected'):
            print(f"✅ PASS | PostgreSQL Connected")
            print(f"   Version: {info.get('version')}")
            print(f"   Database: {info.get('database')}")
            print(f"   Size: {info.get('size')}")
            print(f"   Connections: {info.get('connections', {}).get('active')}/{info.get('connections', {}).get('max')}")
            print(f"   Cache Hit Rate: {info.get('cache_hit_rate')}%")
            return True
        else:
            print(f"❌ FAIL | PostgreSQL Not Connected")
            print(f"   Error: {info.get('error')}")
            return False
    except Exception as e:
        print(f"❌ FAIL | PostgreSQL Connection Error")
        print(f"   Error: {str(e)}")
        return False

def test_postgres_tables():
    """Test PostgreSQL tables"""
    print("\n" + "="*80)
    print("TESTING POSTGRESQL TABLES")
    print("="*80)
    
    try:
        from postgres_manager import PostgreSQLManager
        
        pg = PostgreSQLManager()
        tables = pg.get_tables()
        
        if tables:
            print(f"✅ PASS | Found {len(tables)} tables")
            for table in tables:
                print(f"   - {table['name']:20} | {table['records']:>6} records | {table['size']}")
            return True
        else:
            print(f"⚠️  WARN | No tables found (this might be expected)")
            return True
    except Exception as e:
        print(f"❌ FAIL | PostgreSQL Tables Error")
        print(f"   Error: {str(e)}")
        return False

def test_redis_connection():
    """Test Redis connection"""
    print("\n" + "="*80)
    print("TESTING REDIS CONNECTION")
    print("="*80)
    
    try:
        from redis_manager import RedisManager
        
        redis_mgr = RedisManager()
        info = redis_mgr.get_info()
        
        if info.get('connected'):
            print(f"✅ PASS | Redis Connected")
            print(f"   Version: {info.get('version')}")
            print(f"   Uptime: {info.get('uptime_formatted')}")
            print(f"   Memory Used: {info.get('used_memory')}")
            print(f"   Connected Clients: {info.get('connected_clients')}")
            print(f"   Ops/sec: {info.get('instantaneous_ops_per_sec')}")
            return True
        else:
            print(f"❌ FAIL | Redis Not Connected")
            print(f"   Error: {info.get('error')}")
            return False
    except Exception as e:
        print(f"❌ FAIL | Redis Connection Error")
        print(f"   Error: {str(e)}")
        return False

def test_nautilus_core():
    """Test Nautilus Core availability"""
    print("\n" + "="*80)
    print("TESTING NAUTILUS CORE")
    print("="*80)
    
    try:
        import nautilus_trader
        version = nautilus_trader.__version__
        
        print(f"✅ PASS | Nautilus Trader Installed")
        print(f"   Version: {version}")
        return True
    except ImportError:
        print(f"❌ FAIL | Nautilus Trader Not Installed")
        return False
    except Exception as e:
        print(f"❌ FAIL | Nautilus Trader Error")
        print(f"   Error: {str(e)}")
        return False

def test_environment_variables():
    """Test environment variables"""
    print("\n" + "="*80)
    print("TESTING ENVIRONMENT VARIABLES")
    print("="*80)
    
    required_vars = [
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_DB',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'REDIS_HOST',
        'REDIS_PORT',
        'DATABASE_URL',
    ]
    
    all_set = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mask passwords
            if 'PASSWORD' in var or 'URL' in var:
                display_value = '***' if value else 'not set'
            else:
                display_value = value
            print(f"✅ {var:25} = {display_value}")
        else:
            print(f"❌ {var:25} = not set")
            all_set = False
    
    return all_set

def run_all_unit_tests():
    """Run all unit tests"""
    print("\n" + "="*80)
    print("NAUTILUS TRADER ADMIN - UNIT TESTS")
    print("="*80)
    
    results = []
    
    # Test environment variables
    results.append(("Environment Variables", test_environment_variables()))
    
    # Test Nautilus Core
    results.append(("Nautilus Core", test_nautilus_core()))
    
    # Test PostgreSQL
    results.append(("PostgreSQL Connection", test_postgres_connection()))
    results.append(("PostgreSQL Tables", test_postgres_tables()))
    
    # Test Redis
    results.append(("Redis Connection", test_redis_connection()))
    
    # Print Summary
    print("\n" + "="*80)
    print("UNIT TEST SUMMARY")
    print("="*80)
    
    total = len(results)
    passed = sum(1 for _, result in results if result)
    failed = total - passed
    pass_rate = (passed / total * 100) if total > 0 else 0
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed} ({pass_rate:.1f}%)")
    print(f"Failed: {failed}")
    
    if failed > 0:
        print("\n" + "-"*80)
        print("FAILED TESTS:")
        print("-"*80)
        for name, result in results:
            if not result:
                print(f"❌ {name}")
    
    return failed == 0


if __name__ == "__main__":
    success = run_all_unit_tests()
    sys.exit(0 if success else 1)

