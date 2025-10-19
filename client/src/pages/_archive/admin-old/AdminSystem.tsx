import { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Database,
  Activity,
  Zap,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  Network,
  RefreshCw,
} from "lucide-react";

interface SystemStatus {
  status: string;
  version: string;
  uptime_seconds: number;
  uptime_formatted: string;
  timestamp: string;
  nautilus_available: boolean;
}

interface Component {
  name: string;
  state: string;
  description: string;
  uptime: number;
  health: string;
  metrics?: any;
}

interface SystemMetrics {
  cpu: {
    percent: number;
    count: number;
    per_cpu: number[];
  };
  memory: {
    total_gb: number;
    used_gb: number;
    available_gb: number;
    percent: number;
  };
  disk: {
    total_gb: number;
    used_gb: number;
    free_gb: number;
    percent: number;
  };
  network: {
    bytes_sent_mb: number;
    bytes_recv_mb: number;
    packets_sent: number;
    packets_recv: number;
  };
  timestamp: string;
}

interface TradingMetrics {
  total_orders: number;
  orders_per_sec: number;
  avg_latency_ms: number;
  latency_p95_ms: number;
  active_connections: number;
  active_strategies: number;
}

export default function AdminSystemDirect() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [tradingMetrics, setTradingMetrics] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [statusRes, componentsRes, metricsRes, tradingRes] = await Promise.all([
        fetch('/api/trpc/nautilusCore.getSystemStatus').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getAllComponents').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getSystemMetrics').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getTradingMetrics').then(r => r.json()),
      ]);

      // Extract data from tRPC response format
      setSystemStatus(statusRes.result?.data?.json || null);
      setComponents(componentsRes.result?.data?.json || []);
      setSystemMetrics(metricsRes.result?.data?.json || null);
      setTradingMetrics(tradingRes.result?.data?.json || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh disabled to avoid rate limiting
    // Uncomment below to enable auto-refresh
    // const interval = setInterval(fetchData, 10000);
    // return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "stopped":
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = 
      status === "running" ? "default" :
      status === "warning" ? "secondary" :
      "destructive";
    
    return (
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    );
  };

  // Mock data feeds (would be replaced with real API later)
  const dataFeeds = [
    { name: "Interactive Brokers", status: "connected", latency: "12ms", messages: "1.2M/day" },
    { name: "Binance", status: "connected", latency: "45ms", messages: "3.5M/day" },
    { name: "Coinbase Pro", status: "connected", latency: "38ms", messages: "2.1M/day" },
    { name: "Alpaca", status: "disconnected", latency: "N/A", messages: "0" },
  ];

  if (error) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-red-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-semibold">Error loading system data</p>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
                <Button onClick={fetchData} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">System Administration</h1>
              <p className="text-sm text-muted-foreground">NautilusTrader Infrastructure Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {systemStatus && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {systemStatus.status === "running" ? "All Systems Operational" : systemStatus.status}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tradingMetrics?.total_orders?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {tradingMetrics?.orders_per_sec || 0} orders/sec
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tradingMetrics?.avg_latency_ms?.toFixed(1) || "0"}ms
              </div>
              <p className="text-xs text-muted-foreground">
                p95: {tradingMetrics?.latency_p95_ms?.toFixed(1) || "0"}ms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus?.uptime_formatted || "0d 0h 0m"}
              </div>
              <p className="text-xs text-muted-foreground">
                Version: {systemStatus?.version || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Network className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tradingMetrics?.active_connections || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {tradingMetrics?.active_strategies || 0} active strategies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList>
            <TabsTrigger value="components">
              System Components
              <Badge variant="secondary" className="ml-2">
                {components.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="feeds">
              Data Feeds
              <Badge variant="secondary" className="ml-2">
                {dataFeeds.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resources">
              Resource Usage
              <Badge variant="secondary" className="ml-2">
                {systemMetrics?.cpu?.percent?.toFixed(0) || 0}%
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="config">
              Configuration
              <Badge variant="secondary" className="ml-2">
                Info
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* System Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  NautilusTrader Core Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading components...</div>
                ) : components.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No components found</div>
                ) : (
                  components.map((component, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(component.state?.toLowerCase() || "unknown")}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{component.name}</h3>
                            {getStatusBadge(component.state?.toLowerCase() || "unknown")}
                          </div>
                          <p className="text-sm text-muted-foreground">{component.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatUptime(component.uptime || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              CPU: {component.metrics?.cpu_percent ? `${component.metrics.cpu_percent}%` : "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              RAM: {component.metrics?.memory_mb ? `${(component.metrics.memory_mb / 1024).toFixed(1)} GB` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Restart
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Feeds Tab */}
          <TabsContent value="feeds" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Market Data Feeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataFeeds.map((feed, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50"
                    >
                      <div className="flex items-center gap-4">
                        {feed.status === "connected" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h3 className="font-semibold">{feed.name}</h3>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Latency: {feed.latency}</span>
                            <span>Messages: {feed.messages}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={feed.status === "connected" ? "default" : "destructive"}>
                        {feed.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resource Usage Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall</span>
                        <span className="text-sm text-muted-foreground">
                          {systemMetrics?.cpu?.percent?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${systemMetrics?.cpu?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {systemMetrics?.cpu?.count || 0} cores available
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">RAM</span>
                        <span className="text-sm text-muted-foreground">
                          {systemMetrics?.memory?.used_gb?.toFixed(1) || 0} / {systemMetrics?.memory?.total_gb?.toFixed(1) || 0} GB
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${systemMetrics?.memory?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {systemMetrics?.memory?.available_gb?.toFixed(1) || 0} GB available
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Storage</span>
                        <span className="text-sm text-muted-foreground">
                          {systemMetrics?.disk?.used_gb?.toFixed(1) || 0} / {systemMetrics?.disk?.total_gb?.toFixed(1) || 0} GB
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${systemMetrics?.disk?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {systemMetrics?.disk?.free_gb?.toFixed(1) || 0} GB free
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Network I/O
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sent:</span>
                      <span className="font-medium">
                        {systemMetrics?.network?.bytes_sent_mb?.toFixed(1) || 0} MB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Received:</span>
                      <span className="font-medium">
                        {systemMetrics?.network?.bytes_recv_mb?.toFixed(1) || 0} MB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Packets Sent:</span>
                      <span className="font-medium">
                        {systemMetrics?.network?.packets_sent?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Packets Received:</span>
                      <span className="font-medium">
                        {systemMetrics?.network?.packets_recv?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nautilus Version</label>
                      <div className="p-2 rounded bg-secondary text-sm">
                        {systemStatus?.version || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <div className="p-2 rounded bg-secondary text-sm">
                        {systemStatus?.status || "unknown"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Uptime</label>
                      <div className="p-2 rounded bg-secondary text-sm">
                        {systemStatus?.uptime_formatted || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Updated</label>
                      <div className="p-2 rounded bg-secondary text-sm">
                        {systemStatus?.timestamp ? new Date(systemStatus.timestamp).toLocaleString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

