import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogViewer, MetricCard, MetricChart, StatusBadge } from '@/components/admin';
import type { DataPoint, LogEntry } from '@/components/admin';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';

/**
 * Monitoring Page
 * Page 5 of 6 - System logs, metrics, and diagnostics
 * Fully responsive with mobile-first design
 */

const MonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'diagnostics'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Sample log data
  const sampleLogs: LogEntry[] = [
    {
      timestamp: '2025-10-19 04:25:30',
      level: 'info',
      component: 'Data Engine',
      message: 'Market data subscription updated for BTC-USD',
    },
    {
      timestamp: '2025-10-19 04:25:15',
      level: 'success',
      component: 'Execution Engine',
      message: 'Order #12345 filled successfully at $42,150.00',
    },
    {
      timestamp: '2025-10-19 04:24:58',
      level: 'warning',
      component: 'Risk Engine',
      message: 'Position approaching risk limit (85% of max)',
    },
    {
      timestamp: '2025-10-19 04:24:42',
      level: 'info',
      component: 'Portfolio Manager',
      message: 'Portfolio rebalanced: 8 positions updated',
    },
    {
      timestamp: '2025-10-19 04:24:20',
      level: 'error',
      component: 'Bybit Adapter',
      message: 'Connection failed: API rate limit exceeded',
    },
    {
      timestamp: '2025-10-19 04:23:55',
      level: 'info',
      component: 'Data Engine',
      message: 'Received 1,250 market data updates',
    },
    {
      timestamp: '2025-10-19 04:23:30',
      level: 'success',
      component: 'Cache Manager',
      message: 'Data backup completed successfully',
    },
    {
      timestamp: '2025-10-19 04:23:10',
      level: 'warning',
      component: 'Risk Engine',
      message: 'Unusual volatility detected in ETH-USD',
    },
  ];

  // Sample metrics data
  const cpuData: DataPoint[] = [
    { timestamp: '10:00', value: 45 },
    { timestamp: '10:15', value: 52 },
    { timestamp: '10:30', value: 48 },
    { timestamp: '10:45', value: 65 },
    { timestamp: '11:00', value: 58 },
    { timestamp: '11:15', value: 72 },
    { timestamp: '11:30', value: 68 },
  ];

  const memoryData: DataPoint[] = [
    { timestamp: '10:00', value: 2.1 },
    { timestamp: '10:15', value: 2.3 },
    { timestamp: '10:30', value: 2.2 },
    { timestamp: '10:45', value: 2.5 },
    { timestamp: '11:00', value: 2.4 },
    { timestamp: '11:15', value: 2.6 },
    { timestamp: '11:30', value: 2.5 },
  ];

  const networkData: DataPoint[] = [
    { timestamp: '10:00', value: 125 },
    { timestamp: '10:15', value: 145 },
    { timestamp: '10:30', value: 132 },
    { timestamp: '10:45', value: 168 },
    { timestamp: '11:00', value: 155 },
    { timestamp: '11:15', value: 178 },
    { timestamp: '11:30', value: 162 },
  ];

  const latencyData: DataPoint[] = [
    { timestamp: '10:00', value: 45 },
    { timestamp: '10:15', value: 52 },
    { timestamp: '10:30', value: 48 },
    { timestamp: '10:45', value: 65 },
    { timestamp: '11:00', value: 58 },
    { timestamp: '11:15', value: 72 },
    { timestamp: '11:30', value: 68 },
  ];

  // Filter logs
  const filteredLogs = sampleLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.component.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  // Calculate log stats
  const errorCount = sampleLogs.filter(l => l.level === 'error').length;
  const warningCount = sampleLogs.filter(l => l.level === 'warning').length;
  const infoCount = sampleLogs.filter(l => l.level === 'info').length;
  const successCount = sampleLogs.filter(l => l.level === 'success').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main content with responsive margin */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header - Responsive text sizes */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                System Monitoring
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Real-time logs, metrics, and system diagnostics
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <RefreshCw className={`h-4 w-4 inline mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Metrics - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="Total Logs"
            value={sampleLogs.length}
            subtitle="Last hour"
            color="blue"
            icon={<Activity />}
          />
          <MetricCard
            title="Errors"
            value={errorCount}
            subtitle="Requires attention"
            color="red"
            icon={<XCircle />}
          />
          <MetricCard
            title="Warnings"
            value={warningCount}
            subtitle="Monitor closely"
            color="yellow"
            icon={<AlertTriangle />}
          />
          <MetricCard
            title="Success"
            value={successCount}
            subtitle="Operations completed"
            color="green"
            icon={<CheckCircle />}
          />
        </div>

        {/* Tabs - Responsive */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2 md:gap-4 min-w-max">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              System Logs
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'metrics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Performance Metrics
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'diagnostics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Diagnostics
            </button>
          </div>
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <>
            {/* Filters - Responsive layout */}
            <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400 pointer-events-none" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full md:w-auto pl-9 md:pl-10 pr-8 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>

            {/* Log Viewer */}
            <LogViewer
              logs={filteredLogs}
              maxHeight="500px"
              showTimestamp={true}
              showComponent={true}
            />

            {/* No Results */}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-base md:text-lg">No logs found matching your filters</p>
              </div>
            )}
          </>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <MetricChart
                title="CPU Usage"
                data={cpuData}
                type="area"
                color="blue"
                unit="%"
                height="250px"
              />
              <MetricChart
                title="Memory Usage"
                data={memoryData}
                type="area"
                color="green"
                unit="GB"
                height="250px"
              />
              <MetricChart
                title="Network Traffic"
                data={networkData}
                type="line"
                color="purple"
                unit="MB/s"
                height="250px"
              />
              <MetricChart
                title="API Latency"
                data={latencyData}
                type="bar"
                color="orange"
                unit="ms"
                height="250px"
              />
            </div>
          </>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-4 md:space-y-6">
            {/* System Health */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                System Health Check
              </h2>
              <div className="space-y-3">
                {[
                  { name: 'Database Connection', status: 'success', message: 'Connected to PostgreSQL' },
                  { name: 'Redis Cache', status: 'success', message: 'Cache operational' },
                  { name: 'Message Queue', status: 'success', message: 'RabbitMQ running' },
                  { name: 'File System', status: 'success', message: 'Disk space: 45% used' },
                  { name: 'Network Connectivity', status: 'success', message: 'All endpoints reachable' },
                  { name: 'API Endpoints', status: 'warning', message: '2 endpoints slow response' },
                ].map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={check.status as any} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm md:text-base">{check.name}</p>
                        <p className="text-xs md:text-sm text-gray-600">{check.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Component Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Component Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Data Engine', status: 'running', uptime: '5d 12h' },
                  { name: 'Execution Engine', status: 'running', uptime: '5d 12h' },
                  { name: 'Risk Engine', status: 'running', uptime: '5d 12h' },
                  { name: 'Portfolio Manager', status: 'running', uptime: '5d 12h' },
                  { name: 'Strategy Engine', status: 'running', uptime: '5d 12h' },
                  { name: 'Cache Manager', status: 'running', uptime: '5d 12h' },
                ].map((component, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={component.status as any} size="sm" />
                      <span className="font-medium text-gray-900 text-sm md:text-base">{component.name}</span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-600">{component.uptime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Diagnostic Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button className="p-3 md:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                  <p className="font-semibold text-blue-900 text-sm md:text-base">Run Health Check</p>
                  <p className="text-xs md:text-sm text-blue-700 mt-1">Full system scan</p>
                </button>
                <button className="p-3 md:p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                  <p className="font-semibold text-green-900 text-sm md:text-base">Clear Cache</p>
                  <p className="text-xs md:text-sm text-green-700 mt-1">Free up memory</p>
                </button>
                <button className="p-3 md:p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors">
                  <p className="font-semibold text-purple-900 text-sm md:text-base">Test Connections</p>
                  <p className="text-xs md:text-sm text-purple-700 mt-1">Verify all adapters</p>
                </button>
                <button className="p-3 md:p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                  <p className="font-semibold text-orange-900 text-sm md:text-base">Generate Report</p>
                  <p className="text-xs md:text-sm text-orange-700 mt-1">System diagnostics</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MonitoringPage;

