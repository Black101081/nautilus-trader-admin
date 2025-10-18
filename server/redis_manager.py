"""
Redis Management Module
Provides functions to monitor and manage Redis cache
"""

import redis
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone

class RedisManager:
    """Manager class for Redis operations"""
    
    def __init__(self, host='localhost', port=6379, db=0):
        self.host = host
        self.port = port
        self.db = db
        self._client = None
    
    def _get_client(self):
        """Get or create Redis client"""
        if self._client is None:
            self._client = redis.Redis(
                host=self.host,
                port=self.port,
                db=self.db,
                decode_responses=True,
                socket_timeout=5
            )
        return self._client
    
    def get_info(self) -> Dict[str, Any]:
        """Get Redis server info"""
        try:
            client = self._get_client()
            info = client.info()
            
            return {
                "connected": True,
                "version": info.get('redis_version', 'unknown'),
                "uptime_seconds": info.get('uptime_in_seconds', 0),
                "uptime_formatted": self._format_uptime(info.get('uptime_in_seconds', 0)),
                "connected_clients": info.get('connected_clients', 0),
                "used_memory": info.get('used_memory_human', '0'),
                "used_memory_peak": info.get('used_memory_peak_human', '0'),
                "mem_fragmentation_ratio": info.get('mem_fragmentation_ratio', 0),
                "total_commands_processed": info.get('total_commands_processed', 0),
                "instantaneous_ops_per_sec": info.get('instantaneous_ops_per_sec', 0),
                "keyspace_hits": info.get('keyspace_hits', 0),
                "keyspace_misses": info.get('keyspace_misses', 0),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    def get_keyspace_stats(self) -> List[Dict[str, Any]]:
        """Get keyspace statistics"""
        try:
            client = self._get_client()
            info = client.info('keyspace')
            
            keyspaces = []
            for db_name, db_info in info.items():
                if db_name.startswith('db'):
                    # Parse db info string like "keys=15234,expires=234,avg_ttl=3600"
                    stats = {}
                    for item in db_info.split(','):
                        key, value = item.split('=')
                        stats[key] = int(value)
                    
                    keyspaces.append({
                        "db": db_name,
                        "keys": stats.get('keys', 0),
                        "expires": stats.get('expires', 0),
                        "avg_ttl": stats.get('avg_ttl', 0)
                    })
            
            return keyspaces
        except Exception as e:
            return []
    
    def get_cache_hit_rate(self) -> float:
        """Calculate cache hit rate"""
        try:
            client = self._get_client()
            info = client.info('stats')
            
            hits = info.get('keyspace_hits', 0)
            misses = info.get('keyspace_misses', 0)
            total = hits + misses
            
            if total == 0:
                return 0.0
            
            return round((hits / total) * 100, 2)
        except Exception as e:
            return 0.0
    
    def scan_keys(self, pattern: str = "*", count: int = 100) -> List[str]:
        """Scan keys matching pattern"""
        try:
            client = self._get_client()
            keys = []
            
            for key in client.scan_iter(match=pattern, count=count):
                keys.append(key)
                if len(keys) >= count:
                    break
            
            return keys
        except Exception as e:
            return []
    
    def get_key_info(self, key: str) -> Dict[str, Any]:
        """Get information about a specific key"""
        try:
            client = self._get_client()
            
            key_type = client.type(key)
            ttl = client.ttl(key)
            
            info = {
                "key": key,
                "type": key_type,
                "ttl": ttl,
                "exists": client.exists(key) > 0
            }
            
            # Get value based on type (limit size for safety)
            if key_type == 'string':
                value = client.get(key)
                if value and len(str(value)) < 1000:
                    info["value"] = value
                else:
                    info["value"] = f"<large string: {len(str(value))} bytes>"
            elif key_type == 'list':
                info["length"] = client.llen(key)
            elif key_type == 'set':
                info["size"] = client.scard(key)
            elif key_type == 'zset':
                info["size"] = client.zcard(key)
            elif key_type == 'hash':
                info["fields"] = client.hlen(key)
            
            return info
        except Exception as e:
            return {"error": str(e)}
    
    def delete_key(self, key: str) -> bool:
        """Delete a key"""
        try:
            client = self._get_client()
            return client.delete(key) > 0
        except Exception as e:
            return False
    
    def flush_db(self) -> bool:
        """Flush current database"""
        try:
            client = self._get_client()
            client.flushdb()
            return True
        except Exception as e:
            return False
    
    def flush_all(self) -> bool:
        """Flush all databases"""
        try:
            client = self._get_client()
            client.flushall()
            return True
        except Exception as e:
            return False
    
    def _format_uptime(self, seconds: int) -> str:
        """Format uptime in human-readable format"""
        days = seconds // 86400
        hours = (seconds % 86400) // 3600
        minutes = (seconds % 3600) // 60
        return f"{days}d {hours}h {minutes}m"


# Global instance
redis_manager = RedisManager()


# Convenience functions
def get_redis_info():
    return redis_manager.get_info()

def get_redis_keyspace_stats():
    return redis_manager.get_keyspace_stats()

def get_redis_cache_hit_rate():
    return redis_manager.get_cache_hit_rate()

def scan_redis_keys(pattern: str = "*", count: int = 100):
    return redis_manager.scan_keys(pattern, count)

def get_redis_key_info(key: str):
    return redis_manager.get_key_info(key)

def delete_redis_key(key: str):
    return redis_manager.delete_key(key)

def flush_redis_db():
    return redis_manager.flush_db()

def flush_redis_all():
    return redis_manager.flush_all()

