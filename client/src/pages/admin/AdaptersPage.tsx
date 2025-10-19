import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdapterCard, MetricCard, StatusBadge } from '@/components/admin';
import { Search, Filter, Plug, Database, Zap, TrendingUp } from 'lucide-react';

/**
 * Adapters Management Page
 * Page 4 of 6 - Manage data feeds and execution adapters
 * Fully responsive with mobile-first design
 */

interface Adapter {
  id: string;
  name: string;
  type: 'data' | 'execution' | 'both';
  exchange: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  config: {
    apiKey: string;
    testnet: boolean;
    rateLimit: string;
  };
  metrics?: {
    uptime?: string;
    latency?: string;
    requests?: number;
    errors?: number;
  };
}

const AdaptersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sample adapters data
  const [adapters, setAdapters] = useState<Adapter[]>([
    {
      id: 'binance-spot',
      name: 'Binance Spot',
      type: 'both',
      exchange: 'Binance',
      status: 'connected',
      config: {
        apiKey: 'sk_live_***abc123',
        testnet: false,
        rateLimit: '1200/min',
      },
      metrics: {
        uptime: '5d 12h',
        latency: '45ms',
        requests: 125000,
        errors: 3,
      },
    },
    {
      id: 'binance-futures',
      name: 'Binance Futures',
      type: 'both',
      exchange: 'Binance',
      status: 'connected',
      config: {
        apiKey: 'sk_live_***def456',
        testnet: false,
        rateLimit: '1200/min',
      },
      metrics: {
        uptime: '5d 12h',
        latency: '48ms',
        requests: 98000,
        errors: 1,
      },
    },
    {
      id: 'coinbase-pro',
      name: 'Coinbase Pro',
      type: 'both',
      exchange: 'Coinbase',
      status: 'connected',
      config: {
        apiKey: 'sk_live_***ghi789',
        testnet: false,
        rateLimit: '600/min',
      },
      metrics: {
        uptime: '3d 8h',
        latency: '120ms',
        requests: 45000,
        errors: 0,
      },
    },
    {
      id: 'kraken',
      name: 'Kraken',
      type: 'data',
      exchange: 'Kraken',
      status: 'connected',
      config: {
        apiKey: 'sk_live_***jkl012',
        testnet: false,
        rateLimit: '900/min',
      },
      metrics: {
        uptime: '2d 4h',
        latency: '95ms',
        requests: 32000,
        errors: 2,
      },
    },
    {
      id: 'ftx-testnet',
      name: 'FTX Testnet',
      type: 'both',
      exchange: 'FTX',
      status: 'disconnected',
      config: {
        apiKey: 'sk_test_***mno345',
        testnet: true,
        rateLimit: '300/min',
      },
    },
    {
      id: 'bybit',
      name: 'Bybit',
      type: 'execution',
      exchange: 'Bybit',
      status: 'error',
      config: {
        apiKey: 'sk_live_***pqr678',
        testnet: false,
        rateLimit: '800/min',
      },
      metrics: {
        uptime: '0h',
        latency: 'N/A',
        requests: 0,
        errors: 15,
      },
    },
    {
      id: 'okx',
      name: 'OKX',
      type: 'data',
      exchange: 'OKX',
      status: 'connected',
      config: {
        apiKey: 'sk_live_***stu901',
        testnet: false,
        rateLimit: '1000/min',
      },
      metrics: {
        uptime: '1d 6h',
        latency: '78ms',
        requests: 21000,
        errors: 0,
      },
    },
    {
      id: 'huobi',
      name: 'Huobi',
      type: 'both',
      exchange: 'Huobi',
      status: 'connected',
      config: {
        apiKey: 'sk_live_***vwx234',
        testnet: false,
        rateLimit: '700/min',
      },
      metrics: {
        uptime: '4d 2h',
        latency: '102ms',
        requests: 56000,
        errors: 1,
      },
    },
  ]);

  // Filter adapters
  const filteredAdapters = adapters.filter((adapter) => {
    const matchesSearch = adapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adapter.exchange.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || adapter.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || adapter.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate metrics
  const connectedCount = adapters.filter(a => a.status === 'connected').length;
  const dataAdapters = adapters.filter(a => a.type === 'data' || a.type === 'both').length;
  const executionAdapters = adapters.filter(a => a.type === 'execution' || a.type === 'both').length;
  const errorCount = adapters.filter(a => a.status === 'error').length;

  const handleConnect = (id: string) => {
    console.log('Connecting adapter:', id);
    // TODO: Implement API call
  };

  const handleDisconnect = (id: string) => {
    console.log('Disconnecting adapter:', id);
    // TODO: Implement API call
  };

  const handleConfigure = (id: string) => {
    console.log('Configuring adapter:', id);
    // TODO: Implement configuration modal
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main content with responsive margin */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header - Responsive text sizes */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Exchange Adapters
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage data feeds and execution connections to exchanges
          </p>
        </div>

        {/* Summary Metrics - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="Total Adapters"
            value={adapters.length}
            subtitle="Configured"
            color="blue"
            icon={<Plug />}
          />
          <MetricCard
            title="Connected"
            value={connectedCount}
            subtitle={`${((connectedCount / adapters.length) * 100).toFixed(0)}% active`}
            color="green"
            icon={<Database />}
          />
          <MetricCard
            title="Data Feeds"
            value={dataAdapters}
            subtitle="Market data"
            color="purple"
            icon={<TrendingUp />}
          />
          <MetricCard
            title="Execution"
            value={executionAdapters}
            subtitle="Trading enabled"
            color="orange"
            icon={<Zap />}
          />
        </div>

        {/* Filters - Responsive layout */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Search - Full width on mobile */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search adapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-gray-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-auto pl-9 md:pl-10 pr-8 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="data">Data Only</option>
              <option value="execution">Execution Only</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions - Responsive buttons */}
        <div className="mb-6 flex flex-wrap gap-2 md:gap-3">
          <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
            Connect All
          </button>
          <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
            Disconnect All
          </button>
          <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Test All
          </button>
          <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">
            Export Config
          </button>
        </div>

        {/* Adapters Grid - Responsive columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredAdapters.map((adapter) => (
            <AdapterCard
              key={adapter.id}
              name={adapter.name}
              type={adapter.type}
              exchange={adapter.exchange}
              status={adapter.status}
              config={adapter.config}
              metrics={adapter.metrics}
              onToggle={(enabled) => enabled ? handleConnect(adapter.id) : handleDisconnect(adapter.id)}
              onTest={() => console.log('Test adapter:', adapter.id)}
              onConfigure={() => handleConfigure(adapter.id)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredAdapters.length === 0 && (
          <div className="text-center py-12">
            <Plug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg">No adapters found matching your filters</p>
          </div>
        )}

        {/* Info Panel - Responsive layout */}
        <div className="mt-6 md:mt-8 bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            About Exchange Adapters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Adapter Types</h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-2">
                <li>• <strong>Data Adapters:</strong> Provide market data feeds (quotes, trades, order books)</li>
                <li>• <strong>Execution Adapters:</strong> Enable order submission and management</li>
                <li>• <strong>Both:</strong> Full integration with data and execution capabilities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Configuration</h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-2">
                <li>• Each adapter requires API credentials from the exchange</li>
                <li>• Testnet mode available for testing without real funds</li>
                <li>• Rate limits are enforced to comply with exchange policies</li>
                <li>• Metrics are tracked for monitoring and diagnostics</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdaptersPage;

