import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatusBadge } from '@/components/admin';
import { ToastContainer, useToast } from '@/components/Toast';
import { databaseService } from '@/services/databaseService';
import { 
  Database,
  HardDrive,
  Zap,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  BarChart3,
  FileText,
  Loader2,
} from 'lucide-react';

/**
 * Database Management Page
 * Dedicated page for managing Nautilus Core databases
 * - PostgreSQL Cache (State & Orders)
 * - Parquet Catalog (Market Data)
 * - Redis Cache (High-Speed)
 */

const DatabasePage: React.FC = () => {
  const { toasts, removeToast, success, error, info } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  // PostgreSQL Operations
  const handleBackupPostgreSQL = async () => {
    setLoading('backup-pg');
    info('Starting PostgreSQL backup...');
    
    try {
      const result = await databaseService.backupPostgreSQL();
      if (result.success) {
        success(`${result.message} - ${result.filename} (${result.size})`);
      } else {
        error('Backup failed');
      }
    } catch (err) {
      error('Backup operation failed');
    } finally {
      setLoading(null);
    }
  };

  const handleOptimizePostgreSQL = async () => {
    setLoading('optimize-pg');
    info('Optimizing PostgreSQL database...');
    
    try {
      const result = await databaseService.optimizePostgreSQL();
      if (result.success) {
        success(`${result.message} - ${result.tablesOptimized} tables, ${result.spaceReclaimed} reclaimed`);
      } else {
        error('Optimization failed');
      }
    } catch (err) {
      error('Optimization operation failed');
    } finally {
      setLoading(null);
    }
  };

  // Parquet Operations
  const handleExportParquet = async () => {
    setLoading('export-parquet');
    info('Exporting Parquet data...');
    
    try {
      const result = await databaseService.exportParquet('csv');
      if (result.success) {
        success(`${result.message} - ${result.filename} (${result.size})`);
      } else {
        error('Export failed');
      }
    } catch (err) {
      error('Export operation failed');
    } finally {
      setLoading(null);
    }
  };

  const handleCleanParquet = async () => {
    setLoading('clean-parquet');
    info('Cleaning old Parquet files...');
    
    try {
      const result = await databaseService.cleanParquet(30);
      if (result.success) {
        success(`${result.message} - ${result.tablesOptimized} files deleted, ${result.spaceReclaimed} freed`);
      } else {
        error('Clean failed');
      }
    } catch (err) {
      error('Clean operation failed');
    } finally {
      setLoading(null);
    }
  };

  // Redis Operations
  const handleFlushRedis = async () => {
    if (!confirm('Are you sure you want to flush Redis cache? This will clear all cached data.')) {
      return;
    }
    
    setLoading('flush-redis');
    info('Flushing Redis cache...');
    
    try {
      const result = await databaseService.flushRedis();
      if (result.success) {
        success(result.message);
      } else {
        error('Flush failed');
      }
    } catch (err) {
      error('Flush operation failed');
    } finally {
      setLoading(null);
    }
  };

  const handleRedisStats = async () => {
    setLoading('stats-redis');
    info('Fetching Redis statistics...');
    
    try {
      const stats = await databaseService.getRedisStats();
      success(`Redis Stats: ${stats.keys} keys, ${stats.hitRate}% hit rate, ${stats.commandsPerSec} cmd/s`);
    } catch (err) {
      error('Failed to fetch stats');
    } finally {
      setLoading(null);
    }
  };

  // Maintenance Operations
  const handleFullBackup = async () => {
    setLoading('full-backup');
    info('Starting full system backup...');
    
    try {
      const result = await databaseService.fullBackup();
      if (result.success) {
        success(`${result.message} - ${result.filename} (${result.size})`);
      } else {
        error('Full backup failed');
      }
    } catch (err) {
      error('Full backup operation failed');
    } finally {
      setLoading(null);
    }
  };

  const handleViewTable = async (tableName: string) => {
    setLoading(`view-${tableName}`);
    info(`Loading ${tableName} details...`);
    
    try {
      const details = await databaseService.getTableDetails(tableName);
      success(`${tableName}: ${details.records} records, ${details.size}, ${details.columns.length} columns`);
    } catch (err) {
      error(`Failed to load ${tableName} details`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Main content with responsive margin */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Database Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage and monitor Nautilus Core databases (PostgreSQL, Parquet, Redis)
          </p>
        </div>

        {/* Database Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* PostgreSQL Cache */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">PostgreSQL Cache</h3>
                <p className="text-xs md:text-sm text-gray-600">State & Orders</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <StatusBadge status="success" size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Size:</span>
                <span className="text-sm font-medium text-gray-900">2.4 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tables:</span>
                <span className="text-sm font-medium text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Records:</span>
                <span className="text-sm font-medium text-gray-900">45,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Backup:</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleBackupPostgreSQL}
                disabled={loading === 'backup-pg'}
                className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'backup-pg' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Backup
              </button>
              <button 
                onClick={handleOptimizePostgreSQL}
                disabled={loading === 'optimize-pg'}
                className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'optimize-pg' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Optimize
              </button>
            </div>
          </div>

          {/* Parquet Catalog */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <HardDrive className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">Parquet Catalog</h3>
                <p className="text-xs md:text-sm text-gray-600">Market Data</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <StatusBadge status="success" size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Size:</span>
                <span className="text-sm font-medium text-gray-900">15.8 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Files:</span>
                <span className="text-sm font-medium text-gray-900">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Instruments:</span>
                <span className="text-sm font-medium text-gray-900">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm text-gray-600">5 minutes ago</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleExportParquet}
                disabled={loading === 'export-parquet'}
                className="px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'export-parquet' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Export
              </button>
              <button 
                onClick={handleCleanParquet}
                disabled={loading === 'clean-parquet'}
                className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'clean-parquet' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Clean
              </button>
            </div>
          </div>

          {/* Redis Cache */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">Redis Cache</h3>
                <p className="text-xs md:text-sm text-gray-600">High-Speed</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <StatusBadge status="warning" size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Memory:</span>
                <span className="text-sm font-medium text-gray-900">512 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Keys:</span>
                <span className="text-sm font-medium text-gray-900">8,456</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hit Rate:</span>
                <span className="text-sm font-medium text-gray-900">96.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uptime:</span>
                <span className="text-sm text-gray-600">7 days</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleFlushRedis}
                disabled={loading === 'flush-redis'}
                className="px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'flush-redis' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Flush
              </button>
              <button 
                onClick={handleRedisStats}
                disabled={loading === 'stats-redis'}
                className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === 'stats-redis' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                Stats
              </button>
            </div>
          </div>
        </div>

        {/* PostgreSQL Tables */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              PostgreSQL Tables
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Table Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Records</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Size</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Last Updated</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'orders', type: 'Trading', records: 12345, size: '456 MB', updated: '2 min ago' },
                  { name: 'positions', type: 'Trading', records: 234, size: '12 MB', updated: '5 min ago' },
                  { name: 'executions', type: 'Trading', records: 8901, size: '234 MB', updated: '1 min ago' },
                  { name: 'accounts', type: 'State', records: 45, size: '2 MB', updated: '10 min ago' },
                  { name: 'instruments', type: 'Reference', records: 567, size: '45 MB', updated: '1 hour ago' },
                  { name: 'strategies', type: 'Config', records: 12, size: '1 MB', updated: '2 hours ago' },
                ].map((table, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{table.name}</td>
                    <td className="px-4 py-3 text-gray-600">{table.type}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{table.records.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{table.size}</td>
                    <td className="px-4 py-3 text-gray-600">{table.updated}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => handleViewTable(table.name)}
                        disabled={loading === `view-${table.name}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                      >
                        {loading === `view-${table.name}` ? 'Loading...' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Database Maintenance Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Database Maintenance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <button 
              onClick={handleFullBackup}
              disabled={loading === 'full-backup'}
              className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  {loading === 'full-backup' ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <p className="font-semibold text-blue-900 text-sm md:text-base">Full Backup</p>
              </div>
              <p className="text-xs md:text-sm text-blue-700">Backup all databases</p>
            </button>

            <button 
              onClick={handleOptimizePostgreSQL}
              disabled={loading === 'optimize-pg'}
              className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                  {loading === 'optimize-pg' ? (
                    <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                  ) : (
                    <RefreshCw className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <p className="font-semibold text-green-900 text-sm md:text-base">Optimize</p>
              </div>
              <p className="text-xs md:text-sm text-green-700">Vacuum & analyze</p>
            </button>

            <button 
              onClick={handleExportParquet}
              disabled={loading === 'export-parquet'}
              className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  {loading === 'export-parquet' ? (
                    <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <p className="font-semibold text-purple-900 text-sm md:text-base">Export Data</p>
              </div>
              <p className="text-xs md:text-sm text-purple-700">Export to CSV/JSON</p>
            </button>

            <button 
              onClick={() => info('Database logs feature coming soon')}
              className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <p className="font-semibold text-orange-900 text-sm md:text-base">View Logs</p>
              </div>
              <p className="text-xs md:text-sm text-orange-700">Database query logs</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DatabasePage;

