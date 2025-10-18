"""
Parquet File Management Module
Provides functions to manage Parquet storage for backtesting data
"""

import os
import pyarrow.parquet as pq
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from pathlib import Path

class ParquetManager:
    """Manager class for Parquet file operations"""
    
    def __init__(self, base_path='/home/ubuntu/nautilus-data'):
        self.base_path = base_path
        self.directories = {
            'bars': f"{base_path}/bars",
            'quotes': f"{base_path}/quotes",
            'trades': f"{base_path}/trades",
            'backtests': f"{base_path}/backtests"
        }
    
    def get_overview(self) -> Dict[str, Any]:
        """Get overview of Parquet storage"""
        try:
            total_files = 0
            total_size = 0
            
            for dir_name, dir_path in self.directories.items():
                if os.path.exists(dir_path):
                    for file in os.listdir(dir_path):
                        if file.endswith('.parquet'):
                            total_files += 1
                            file_path = os.path.join(dir_path, file)
                            total_size += os.path.getsize(file_path)
            
            return {
                "base_path": self.base_path,
                "total_files": total_files,
                "total_size": self._format_bytes(total_size),
                "total_size_bytes": total_size,
                "directories": len(self.directories),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            return {"error": str(e)}
    
    def list_directories(self) -> List[Dict[str, Any]]:
        """List all directories with file counts"""
        directories = []
        
        for dir_name, dir_path in self.directories.items():
            try:
                if not os.path.exists(dir_path):
                    os.makedirs(dir_path, exist_ok=True)
                
                files = []
                total_size = 0
                
                for file in os.listdir(dir_path):
                    if file.endswith('.parquet'):
                        file_path = os.path.join(dir_path, file)
                        file_stat = os.stat(file_path)
                        
                        # Get parquet file metadata
                        try:
                            parquet_file = pq.ParquetFile(file_path)
                            num_rows = parquet_file.metadata.num_rows
                        except:
                            num_rows = 0
                        
                        files.append({
                            "name": file,
                            "size": self._format_bytes(file_stat.st_size),
                            "size_bytes": file_stat.st_size,
                            "records": num_rows,
                            "modified": datetime.fromtimestamp(file_stat.st_mtime, tz=timezone.utc).isoformat()
                        })
                        total_size += file_stat.st_size
                
                directories.append({
                    "name": dir_name,
                    "path": dir_path,
                    "files": sorted(files, key=lambda x: x['modified'], reverse=True),
                    "file_count": len(files),
                    "total_size": self._format_bytes(total_size),
                    "total_size_bytes": total_size
                })
            except Exception as e:
                directories.append({
                    "name": dir_name,
                    "path": dir_path,
                    "error": str(e),
                    "files": [],
                    "file_count": 0
                })
        
        return directories
    
    def get_file_info(self, directory: str, filename: str) -> Dict[str, Any]:
        """Get detailed information about a Parquet file"""
        try:
            dir_path = self.directories.get(directory)
            if not dir_path:
                return {"error": f"Directory '{directory}' not found"}
            
            file_path = os.path.join(dir_path, filename)
            if not os.path.exists(file_path):
                return {"error": f"File '{filename}' not found"}
            
            # Get file stats
            file_stat = os.stat(file_path)
            
            # Get Parquet metadata
            parquet_file = pq.ParquetFile(file_path)
            metadata = parquet_file.metadata
            schema = parquet_file.schema
            
            return {
                "name": filename,
                "path": file_path,
                "size": self._format_bytes(file_stat.st_size),
                "size_bytes": file_stat.st_size,
                "created": datetime.fromtimestamp(file_stat.st_ctime, tz=timezone.utc).isoformat(),
                "modified": datetime.fromtimestamp(file_stat.st_mtime, tz=timezone.utc).isoformat(),
                "num_rows": metadata.num_rows,
                "num_columns": metadata.num_columns,
                "num_row_groups": metadata.num_row_groups,
                "format_version": metadata.format_version,
                "columns": [
                    {
                        "name": field.name,
                        "type": str(field.type)
                    }
                    for field in schema
                ]
            }
        except Exception as e:
            return {"error": str(e)}
    
    def read_file_preview(self, directory: str, filename: str, limit: int = 10) -> Dict[str, Any]:
        """Read preview of Parquet file"""
        try:
            dir_path = self.directories.get(directory)
            if not dir_path:
                return {"error": f"Directory '{directory}' not found"}
            
            file_path = os.path.join(dir_path, filename)
            if not os.path.exists(file_path):
                return {"error": f"File '{filename}' not found"}
            
            # Read parquet file
            table = pq.read_table(file_path)
            df = table.to_pandas()
            
            # Get preview
            preview_df = df.head(limit)
            
            return {
                "columns": list(df.columns),
                "rows": preview_df.to_dict('records'),
                "total_rows": len(df),
                "preview_rows": len(preview_df)
            }
        except Exception as e:
            return {"error": str(e)}
    
    def delete_file(self, directory: str, filename: str) -> bool:
        """Delete a Parquet file"""
        try:
            dir_path = self.directories.get(directory)
            if not dir_path:
                return False
            
            file_path = os.path.join(dir_path, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            return False
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        try:
            stats = {
                "directories": {}
            }
            
            total_files = 0
            total_size = 0
            total_records = 0
            
            for dir_name, dir_path in self.directories.items():
                if os.path.exists(dir_path):
                    dir_files = 0
                    dir_size = 0
                    dir_records = 0
                    
                    for file in os.listdir(dir_path):
                        if file.endswith('.parquet'):
                            dir_files += 1
                            file_path = os.path.join(dir_path, file)
                            file_size = os.path.getsize(file_path)
                            dir_size += file_size
                            
                            try:
                                parquet_file = pq.ParquetFile(file_path)
                                dir_records += parquet_file.metadata.num_rows
                            except:
                                pass
                    
                    stats["directories"][dir_name] = {
                        "files": dir_files,
                        "size": self._format_bytes(dir_size),
                        "size_bytes": dir_size,
                        "records": dir_records
                    }
                    
                    total_files += dir_files
                    total_size += dir_size
                    total_records += dir_records
            
            stats["total"] = {
                "files": total_files,
                "size": self._format_bytes(total_size),
                "size_bytes": total_size,
                "records": total_records
            }
            
            return stats
        except Exception as e:
            return {"error": str(e)}
    
    def _format_bytes(self, bytes_value: int) -> str:
        """Format bytes in human-readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if bytes_value < 1024.0:
                return f"{bytes_value:.1f} {unit}"
            bytes_value /= 1024.0
        return f"{bytes_value:.1f} PB"


# Global instance
parquet_manager = ParquetManager()


# Convenience functions
def get_parquet_overview():
    return parquet_manager.get_overview()

def list_parquet_directories():
    return parquet_manager.list_directories()

def get_parquet_file_info(directory: str, filename: str):
    return parquet_manager.get_file_info(directory, filename)

def read_parquet_file_preview(directory: str, filename: str, limit: int = 10):
    return parquet_manager.read_file_preview(directory, filename, limit)

def delete_parquet_file(directory: str, filename: str):
    return parquet_manager.delete_file(directory, filename)

def get_parquet_storage_stats():
    return parquet_manager.get_storage_stats()

