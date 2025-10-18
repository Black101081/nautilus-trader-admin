import { MainLayout } from "@/components/MainLayout";
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
} from "lucide-react";

export default function AdminSystem() {
  // Mock data for NautilusTrader system components
  const systemComponents = [
    {
      name: "Execution Engine",
      status: "running",
      uptime: "15d 7h 23m",
      cpu: "12%",
      memory: "2.3 GB",
      description: "Core trading execution engine",
    },
    {
      name: "Data Feed Handler",
      status: "running",
      uptime: "15d 7h 23m",
      cpu: "8%",
      memory: "1.1 GB",
      description: "Real-time market data ingestion",
    },
    {
      name: "Risk Management System",
      status: "running",
      uptime: "15d 7h 23m",
      cpu: "5%",
      memory: "0.8 GB",
      description: "Pre-trade and post-trade risk checks",
    },
    {
      name: "Order Management System",
      status: "running",
      uptime: "15d 7h 23m",
      cpu: "7%",
      memory: "1.5 GB",
      description: "Order routing and management",
    },
    {
      name: "Cache Layer (Redis)",
      status: "running",
      uptime: "15d 7h 23m",
      cpu: "3%",
      memory: "0.5 GB",
      description: "High-performance caching",
    },
    {
      name: "Message Queue (RabbitMQ)",
      status: "warning",
      uptime: "2d 4h 12m",
      cpu: "15%",
      memory: "1.2 GB",
      description: "Event-driven messaging",
    },
  ];

  const dataFeeds = [
    { name: "Interactive Brokers", status: "connected", latency: "12ms", messages: "1.2M/day" },
    { name: "Binance", status: "connected", latency: "45ms", messages: "3.5M/day" },
    { name: "Coinbase Pro", status: "connected", latency: "38ms", messages: "2.1M/day" },
    { name: "Alpaca", status: "disconnected", latency: "N/A", messages: "0" },
  ];

  const systemMetrics = {
    totalOrders: "12,453",
    avgLatency: "2.3ms",
    uptime: "99.97%",
    activeConnections: "47",
  };

  return (
    <MainLayout>
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
            <Badge variant="default" className="gap-1 bg-green-500/20 text-green-500">
              <CheckCircle2 className="h-3 w-3" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 space-y-6">
        {/* System Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Orders Today</p>
                  <p className="text-3xl font-bold">{systemMetrics.totalOrders}</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Avg Latency</p>
                  <p className="text-3xl font-bold">{systemMetrics.avgLatency}</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <Zap className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                  <p className="text-3xl font-bold">{systemMetrics.uptime}</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                  <p className="text-3xl font-bold">{systemMetrics.activeConnections}</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 p-3">
                  <Network className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">System Components</TabsTrigger>
            <TabsTrigger value="datafeeds">Data Feeds</TabsTrigger>
            <TabsTrigger value="resources">Resource Usage</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          {/* System Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  NautilusTrader Core Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemComponents.map((component, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-border/40 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            component.status === "running"
                              ? "bg-green-500/10"
                              : "bg-yellow-500/10"
                          }`}
                        >
                          {component.status === "running" ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{component.name}</p>
                            <Badge
                              variant={component.status === "running" ? "default" : "secondary"}
                              className={
                                component.status === "running"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                              }
                            >
                              {component.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{component.description}</p>
                          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {component.uptime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3" />
                              CPU: {component.cpu}
                            </span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              RAM: {component.memory}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Restart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Feeds Tab */}
          <TabsContent value="datafeeds" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-500" />
                  Market Data Feeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/40 text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Provider</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Latency</th>
                        <th className="pb-3 font-medium">Messages/Day</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataFeeds.map((feed, idx) => (
                        <tr key={idx} className="border-b border-border/40 last:border-0">
                          <td className="py-4 text-sm font-semibold">{feed.name}</td>
                          <td className="py-4">
                            <Badge
                              variant={feed.status === "connected" ? "default" : "secondary"}
                              className={
                                feed.status === "connected"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              }
                            >
                              {feed.status === "connected" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {feed.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-sm font-mono">{feed.latency}</td>
                          <td className="py-4 text-sm">{feed.messages}</td>
                          <td className="py-4 text-right">
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resource Usage Tab */}
          <TabsContent value="resources" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  System Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border/40">
                  <div className="text-center">
                    <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Resource monitoring charts will be implemented
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CPU, Memory, Disk, Network usage over time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-500" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/40 p-4">
                    <h3 className="font-semibold mb-2">Execution Settings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Orders Per Second:</span>
                        <span className="font-mono">100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Timeout:</span>
                        <span className="font-mono">5000ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Retry Attempts:</span>
                        <span className="font-mono">3</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/40 p-4">
                    <h3 className="font-semibold mb-2">Risk Parameters</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Position Size:</span>
                        <span className="font-mono">$100,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Loss Limit:</span>
                        <span className="font-mono">$10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Leverage:</span>
                        <span className="font-mono">5x</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

