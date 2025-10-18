"""
PostgreSQL Management Module
Provides functions to monitor and manage PostgreSQL database
"""

import psycopg2
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone

class PostgreSQLManager:
    """Manager class for PostgreSQL operations"""
    
    def __init__(self, host=None, port=None, user=None, password=None, database=None):
        # Use environment variables with fallback to defaults
        self.host = host or os.getenv('POSTGRES_HOST', 'localhost')
        self.port = port or int(os.getenv('POSTGRES_PORT', '5432'))
        self.user = user or os.getenv('POSTGRES_USER', 'nautilus_user')
        self.password = password or os.getenv('POSTGRES_PASSWORD', 'nautilus_pass')
        self.database = database or os.getenv('POSTGRES_DB', 'nautilus')
        self._conn = None
    
    def _get_connection(self):
        """Get or create database connection"""
        try:
            if self._conn is None or self._conn.closed:
                self._conn = psycopg2.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    connect_timeout=5
                )
            return self._conn
        except Exception as e:
            return None
    
    def get_info(self) -> Dict[str, Any]:
        """Get PostgreSQL server info"""
        try:
            conn = self._get_connection()
            if not conn:
                return {"connected": False, "error": "Cannot connect to database"}
            
            cur = conn.cursor()
            
            # Get version
            cur.execute("SELECT version();")
            version_str = cur.fetchone()[0]
            version = version_str.split()[1] if len(version_str.split()) > 1 else "unknown"
            
            # Get database size
            cur.execute(f"SELECT pg_database_size('{self.database}');")
            db_size_bytes = cur.fetchone()[0]
            db_size = self._format_bytes(db_size_bytes)
            
            # Get connection stats
            cur.execute("""
                SELECT count(*) as total,
                       count(*) FILTER (WHERE state = 'active') as active,
                       count(*) FILTER (WHERE state = 'idle') as idle
                FROM pg_stat_activity
                WHERE datname = %s;
            """, (self.database,))
            conn_stats = cur.fetchone()
            
            # Get max connections
            cur.execute("SHOW max_connections;")
            max_connections = int(cur.fetchone()[0])
            
            # Get cache hit rate
            cur.execute("""
                SELECT 
                    sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) * 100 as cache_hit_rate
                FROM pg_statio_user_tables;
            """)
            cache_hit_rate = cur.fetchone()[0]
            if cache_hit_rate is None:
                cache_hit_rate = 0
            
            cur.close()
            
            return {
                "connected": True,
                "version": version,
                "database": self.database,
                "size": db_size,
                "size_bytes": db_size_bytes,
                "connections": {
                    "total": conn_stats[0],
                    "active": conn_stats[1],
                    "idle": conn_stats[2],
                    "max": max_connections
                },
                "cache_hit_rate": round(float(cache_hit_rate), 2),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    def get_tables(self) -> List[Dict[str, Any]]:
        """Get list of tables"""
        try:
            conn = self._get_connection()
            if not conn:
                return []
            
            cur = conn.cursor()
            
            # Get tables with stats
            cur.execute("""
                SELECT 
                    schemaname,
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
                    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes,
                    n_live_tup as row_count
                FROM pg_stat_user_tables
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
            """)
            
            tables = []
            for row in cur.fetchall():
                tables.append({
                    "schema": row[0],
                    "name": row[1],
                    "type": "nautilus",  # All tables in this DB are Nautilus tables
                    "size": row[2],
                    "size_bytes": row[3],
                    "records": row[4] or 0
                })
            
            cur.close()
            return tables
        except Exception as e:
            return []
    
    def get_table_stats(self, table_name: str) -> Dict[str, Any]:
        """Get detailed statistics for a table"""
        try:
            conn = self._get_connection()
            if not conn:
                return {}
            
            cur = conn.cursor()
            
            # Get table stats
            cur.execute("""
                SELECT 
                    schemaname,
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
                    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                                   pg_relation_size(schemaname||'.'||tablename)) as indexes_size,
                    n_live_tup as row_count,
                    n_dead_tup as dead_rows,
                    last_vacuum,
                    last_autovacuum,
                    last_analyze,
                    last_autoanalyze
                FROM pg_stat_user_tables
                WHERE tablename = %s;
            """, (table_name,))
            
            row = cur.fetchone()
            if not row:
                return {}
            
            stats = {
                "schema": row[0],
                "name": row[1],
                "total_size": row[2],
                "table_size": row[3],
                "indexes_size": row[4],
                "row_count": row[5] or 0,
                "dead_rows": row[6] or 0,
                "last_vacuum": row[7].isoformat() if row[7] else None,
                "last_autovacuum": row[8].isoformat() if row[8] else None,
                "last_analyze": row[9].isoformat() if row[9] else None,
                "last_autoanalyze": row[10].isoformat() if row[10] else None,
            }
            
            # Get column count
            cur.execute("""
                SELECT count(*)
                FROM information_schema.columns
                WHERE table_name = %s;
            """, (table_name,))
            stats["column_count"] = cur.fetchone()[0]
            
            # Get index count
            cur.execute("""
                SELECT count(*)
                FROM pg_indexes
                WHERE tablename = %s;
            """, (table_name,))
            stats["index_count"] = cur.fetchone()[0]
            
            cur.close()
            return stats
        except Exception as e:
            return {"error": str(e)}
    
    def query_table(self, table_name: str, limit: int = 100) -> Dict[str, Any]:
        """Query table data"""
        try:
            conn = self._get_connection()
            if not conn:
                return {"error": "Cannot connect to database"}
            
            cur = conn.cursor()
            
            # Get column names
            cur.execute("""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = %s
                ORDER BY ordinal_position;
            """, (table_name,))
            columns = cur.fetchall()
            
            # Query data
            cur.execute(f"SELECT * FROM {table_name} LIMIT %s;", (limit,))
            rows = cur.fetchall()
            
            cur.close()
            
            return {
                "columns": [{"name": col[0], "type": col[1]} for col in columns],
                "rows": [list(row) for row in rows],
                "count": len(rows)
            }
        except Exception as e:
            return {"error": str(e)}
    
    def vacuum_table(self, table_name: str) -> bool:
        """Run VACUUM on a table"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            # VACUUM requires autocommit mode
            old_isolation_level = conn.isolation_level
            conn.set_isolation_level(0)
            
            cur = conn.cursor()
            cur.execute(f"VACUUM {table_name};")
            cur.close()
            
            conn.set_isolation_level(old_isolation_level)
            return True
        except Exception as e:
            return False
    
    def analyze_table(self, table_name: str) -> bool:
        """Run ANALYZE on a table"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cur = conn.cursor()
            cur.execute(f"ANALYZE {table_name};")
            conn.commit()
            cur.close()
            return True
        except Exception as e:
            return False
    
    def _format_bytes(self, bytes_value: int) -> str:
        """Format bytes in human-readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if bytes_value < 1024.0:
                return f"{bytes_value:.1f} {unit}"
            bytes_value /= 1024.0
        return f"{bytes_value:.1f} PB"
    
    def close(self):
        """Close database connection"""
        if self._conn and not self._conn.closed:
            self._conn.close()


# Global instance
postgres_manager = PostgreSQLManager()


# Convenience functions
def get_postgres_info():
    return postgres_manager.get_info()

def get_postgres_tables():
    return postgres_manager.get_tables()

def get_postgres_table_stats(table_name: str):
    return postgres_manager.get_table_stats(table_name)

def query_postgres_table(table_name: str, limit: int = 100):
    return postgres_manager.query_table(table_name, limit)

def vacuum_postgres_table(table_name: str):
    return postgres_manager.vacuum_table(table_name)

def analyze_postgres_table(table_name: str):
    return postgres_manager.analyze_table(table_name)

