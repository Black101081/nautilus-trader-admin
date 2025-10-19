import React from 'react';
import {
  MetricCard,
  ComponentCard,
  AdapterCard,
  FeatureToggle,
  ServiceControl,
  StatusBadge,
  LogViewer,
  MetricChart,
} from '../../components/admin';
import type { LogEntry, DataPoint } from '../../components/admin';

/**
 * Component Showcase Page
 * Demonstrates all admin components with sample data
 */
const ComponentShowcase: React.FC = () => {
  // Sample data for LogViewer
  const sampleLogs: LogEntry[] = [
    {
      timestamp: '2025-10-19 10:30:15',
      level: 'info',
      component: 'DataEngine',
      message: 'Market data feed connected successfully',
    },
    {
      timestamp: '2025-10-19 10:30:16',
      level: 'debug',
      component: 'OrderEngine',
      message: 'Processing order queue',
      metadata: { queueSize: 5 },
    },
    {
      timestamp: '2025-10-19 10:30:17',
      level: 'warning',
      component: 'RiskEngine',
      message: 'Position limit approaching threshold',
      metadata: { current: 95, limit: 100 },
    },
    {
      timestamp: '2025-10-19 10:30:18',
      level: 'error',
      component: 'ExecutionEngine',
      message: 'Failed to submit order',
      metadata: { orderId: 'ORD-123', reason: 'Insufficient margin' },
    },
  ];

  // Sample data for MetricChart
  const sampleChartData: DataPoint[] = [
    { timestamp: '10:00', value: 45 },
    { timestamp: '10:15', value: 52 },
    { timestamp: '10:30', value: 48 },
    { timestamp: '10:45', value: 65 },
    { timestamp: '11:00', value: 58 },
    { timestamp: '11:15', value: 72 },
    { timestamp: '11:30', value: 68 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Component Showcase
          </h1>
          <p className="text-gray-600">
            Preview of all reusable components for the Admin Dashboard
          </p>
        </div>

        {/* Status Badges */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="inactive" />
            <StatusBadge status="running" />
            <StatusBadge status="stopped" />
            <StatusBadge status="starting" />
            <StatusBadge status="enabled" />
            <StatusBadge status="disabled" />
            <StatusBadge status="pending" />
            <StatusBadge status="error" />
            <StatusBadge status="warning" />
            <StatusBadge status="success" />
            <StatusBadge status="info" />
          </div>
        </section>

        {/* Metric Cards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metric Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Components"
              value={6}
              subtitle="All systems operational"
              color="green"
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard
              title="Running Services"
              value={126}
              subtitle="64 features enabled"
              color="blue"
            />
            <MetricCard
              title="Active Adapters"
              value={8}
              subtitle="14 total configured"
              color="purple"
            />
            <MetricCard
              title="System Uptime"
              value="99.9%"
              subtitle="Last 30 days"
              color="green"
              trend={{ value: 0.2, isPositive: true }}
            />
          </div>
        </section>

        {/* Component Cards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Cards</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ComponentCard
              name="Data Engine"
              description="Manages market data feeds and subscriptions"
              status="running"
              version="1.220.0"
              metrics={[
                { label: 'Subscriptions', value: 45 },
                { label: 'Updates/sec', value: 1250 },
                { label: 'Latency', value: '2ms' },
                { label: 'Memory', value: '256MB' },
              ]}
              actions={[
                { label: 'Stop', onClick: () => alert('Stop'), variant: 'danger' },
                { label: 'Restart', onClick: () => alert('Restart'), variant: 'primary' },
                { label: 'Configure', onClick: () => alert('Configure') },
              ]}
            />
            <ComponentCard
              name="Execution Engine"
              description="Handles order execution and management"
              status="running"
              version="1.220.0"
              metrics={[
                { label: 'Orders/min', value: 125 },
                { label: 'Fill Rate', value: '98.5%' },
                { label: 'Avg Latency', value: '5ms' },
                { label: 'Active Orders', value: 23 },
              ]}
              actions={[
                { label: 'Stop', onClick: () => alert('Stop'), variant: 'danger' },
                { label: 'Restart', onClick: () => alert('Restart'), variant: 'primary' },
                { label: 'Configure', onClick: () => alert('Configure') },
              ]}
            />
          </div>
        </section>

        {/* Adapter Cards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Adapter Cards</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdapterCard
              name="Binance Adapter"
              type="both"
              venue="Binance"
              status="active"
              config={{
                apiKey: 'sk_live_1234567890abcdef',
                testnet: false,
              }}
              metrics={{
                connections: 3,
                latency: '45ms',
                uptime: '99.8%',
                lastSync: '2s ago',
              }}
              onToggle={(enabled) => alert(`Toggle: ${enabled}`)}
              onTest={() => alert('Test connection')}
              onConfigure={() => alert('Configure')}
            />
            <AdapterCard
              name="Interactive Brokers"
              type="execution"
              venue="IB"
              status="inactive"
              config={{
                apiKey: 'sk_test_abcdef1234567890',
                testnet: true,
              }}
              onToggle={(enabled) => alert(`Toggle: ${enabled}`)}
              onTest={() => alert('Test connection')}
              onConfigure={() => alert('Configure')}
            />
          </div>
        </section>

        {/* Feature Toggles */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Toggles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FeatureToggle
              featureName="Real-time Market Data"
              description="Enable live market data streaming"
              enabled={true}
              onToggle={(enabled) => console.log('Toggle:', enabled)}
              category="Data"
            />
            <FeatureToggle
              featureName="Advanced Order Types"
              description="Support for complex order types (OCO, Bracket, etc.)"
              enabled={false}
              onToggle={(enabled) => console.log('Toggle:', enabled)}
              category="Execution"
              dependencies={['Order Management', 'Risk Engine']}
            />
          </div>
        </section>

        {/* Service Controls */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Controls</h2>
          <div className="grid grid-cols-1 gap-4">
            <ServiceControl
              serviceName="Market Data Service"
              description="Handles real-time market data subscriptions and updates"
              status="running"
              component="DataEngine"
              metrics={{
                uptime: '5d 12h',
                requests: 1250000,
                errors: 3,
                latency: '2.5ms',
              }}
              onStart={async () => alert('Start')}
              onStop={async () => alert('Stop')}
              onRestart={async () => alert('Restart')}
              onConfigure={() => alert('Configure')}
            />
            <ServiceControl
              serviceName="Order Execution Service"
              description="Manages order submission and execution"
              status="stopped"
              component="ExecutionEngine"
              onStart={async () => alert('Start')}
              onStop={async () => alert('Stop')}
              onRestart={async () => alert('Restart')}
              onConfigure={() => alert('Configure')}
            />
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metric Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MetricChart
              title="CPU Usage"
              data={sampleChartData}
              type="line"
              color="blue"
              unit="%"
            />
            <MetricChart
              title="Memory Usage"
              data={sampleChartData}
              type="area"
              color="green"
              unit="GB"
            />
            <MetricChart
              title="Network Traffic"
              data={sampleChartData}
              type="bar"
              color="purple"
              unit="MB/s"
            />
          </div>
        </section>

        {/* Log Viewer */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Viewer</h2>
          <LogViewer
            logs={sampleLogs}
            maxHeight="400px"
            autoScroll={true}
            showFilters={true}
            onRefresh={() => alert('Refresh logs')}
          />
        </section>
      </div>
    </div>
  );
};

export default ComponentShowcase;

