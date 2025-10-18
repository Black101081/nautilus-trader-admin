import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  Server,
  Database,
  Zap,
  TrendingUp,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Square,
} from "lucide-react";

export default function AdminCoreManagement() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Queries
  const { data: systemStatus, refetch: refetchSystem } = trpc.nautilusCore.getSystemStatus.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: components, refetch: refetchComponents } = trpc.nautilusCore.getAllComponents.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const { data: systemMetrics, refetch: refetchMetrics } = trpc.nautilusCore.getSystemMetrics.useQuery(undefined, {
    refetchInterval: 2000, // More frequent for metrics
  });

  const { data: tradingMetrics } = trpc.nautilusCore.getTradingMetrics.useQuery(undefined, {
    refetchInterval: 2000,
  });

  const { data: adapters } = trpc.nautilusCore.getAdapters.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const { data: logs } = trpc.nautilusCore.getLogs.useQuery(
    { level: "ALL", limit: 50 },
    { refetchInterval: 3000 }
  );

  // Mutations
  const restartMutation = trpc.nautilusCore.restartComponent.useMutation({
    onSuccess: () => {
      refetchComponents();
    },
  });

  const emergencyStopMutation = trpc.nautilusCore.emergencyStopAll.useMutation({
    onSuccess: () => {
      refetchSystem();
      refetchComponents();
    },
  });

  const getComponentIcon = (name: string) => {
    const icons: Record<string, any> = {
      kernel: Server,
      message_bus: Zap,
      cache: Database,
      data_engine: Activity,
      execution_engine: TrendingUp,
      risk_engine: Shield,
    };
    return icons[name] || Activity;
  };

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      RUNNING: "bg-green-500",
      STOPPED: "bg-gray-500",
      DEGRADED: "bg-yellow-500",
      FAULTED: "bg-red-500",
      UNKNOWN: "bg-gray-400",
    };
    return colors[state] || "bg-gray-400";
  };

  const getHealthIcon = (health: string) => {
    if (health === "healthy") return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (health === "degraded") return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nautilus Core Management</h1>
            <p className="text-muted-foreground">
              Monitor and control NautilusTrader core infrastructure
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchSystem();
                refetchComponents();
                refetchMetrics();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to emergency stop all trading?")) {
                  emergencyStopMutation.mutate();
                }
              }}
            >
              <Square className="h-4 w-4 mr-2" />
              Emergency Stop
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={systemStatus?.status === "running" ? "default" : "destructive"}>
                  {systemStatus?.status || "unknown"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  v{systemStatus?.version || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {systemStatus?.uptime_formatted || "0d 0h 0m"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {systemMetrics?.cpu?.percent?.toFixed(1) || "0.0"}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {systemMetrics?.memory?.percent?.toFixed(1) || "0.0"}%
              </div>
              <div className="text-xs text-muted-foreground">
                {systemMetrics?.memory?.used_gb?.toFixed(2) || "0"} /{" "}
                {systemMetrics?.memory?.total_gb?.toFixed(2) || "0"} GB
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="adapters">Adapters</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components?.map((component: any) => {
                const Icon = getComponentIcon(component.name);
                return (
                  <Card key={component.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                        </div>
                        {getHealthIcon(component.health)}
                      </div>
                      <CardDescription>{component.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">State:</span>
                        <Badge className={getStateColor(component.state)}>
                          {component.state}
                        </Badge>
                      </div>

                      {component.metrics && (
                        <div className="space-y-2 text-sm">
                          {Object.entries(component.metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>
                              <span className="font-mono font-semibold">
                                {typeof value === "number" ? value.toFixed(2) : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => restartMutation.mutate({ component: component.name })}
                        disabled={restartMutation.isPending}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restart Component
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trading Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Trading Metrics</CardTitle>
                  <CardDescription>Real-time trading performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Orders Today</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="ml-2 font-mono font-semibold">
                          {tradingMetrics?.orders?.total_today || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Filled:</span>
                        <span className="ml-2 font-mono font-semibold text-green-500">
                          {tradingMetrics?.orders?.filled || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cancelled:</span>
                        <span className="ml-2 font-mono font-semibold text-yellow-500">
                          {tradingMetrics?.orders?.cancelled || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rejected:</span>
                        <span className="ml-2 font-mono font-semibold text-red-500">
                          {tradingMetrics?.orders?.rejected || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Execution</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Latency:</span>
                        <span className="font-mono font-semibold">
                          {tradingMetrics?.execution?.avg_latency_ms?.toFixed(2) || 0} ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fill Rate:</span>
                        <span className="font-mono font-semibold">
                          {tradingMetrics?.execution?.fill_rate_percent?.toFixed(2) || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Slippage:</span>
                        <span className="font-mono font-semibold">
                          {tradingMetrics?.execution?.slippage_bps?.toFixed(2) || 0} bps
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>System Resources</CardTitle>
                  <CardDescription>Hardware utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">CPU</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Usage:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.cpu?.percent?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cores:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.cpu?.count || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Memory</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Used:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.memory?.used_gb?.toFixed(2) || 0} GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.memory?.available_gb?.toFixed(2) || 0} GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Percent:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.memory?.percent?.toFixed(1) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Disk</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Used:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.disk?.used_gb?.toFixed(2) || 0} GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Free:</span>
                        <span className="font-mono font-semibold">
                          {systemMetrics?.disk?.free_gb?.toFixed(2) || 0} GB
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Adapters Tab */}
          <TabsContent value="adapters" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adapters?.map((adapter: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{adapter.name}</CardTitle>
                      <Badge variant={adapter.status === "connected" ? "default" : "secondary"}>
                        {adapter.status}
                      </Badge>
                    </div>
                    <CardDescription>{adapter.type} adapter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Venue:</span>
                      <span className="font-semibold">{adapter.venue}</span>
                    </div>
                    {adapter.instruments !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instruments:</span>
                        <span className="font-mono font-semibold">{adapter.instruments}</span>
                      </div>
                    )}
                    {adapter.accounts !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accounts:</span>
                        <span className="font-mono font-semibold">{adapter.accounts}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-mono font-semibold">{adapter.uptime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent log entries from all components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm max-h-[600px] overflow-y-auto">
                  {logs?.map((log: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 p-2 rounded border border-border hover:bg-muted/50"
                    >
                      <span className="text-muted-foreground shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge
                        variant={
                          log.level === "ERROR"
                            ? "destructive"
                            : log.level === "WARNING"
                            ? "secondary"
                            : "outline"
                        }
                        className="shrink-0"
                      >
                        {log.level}
                      </Badge>
                      <span className="text-blue-400 shrink-0">[{log.component}]</span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

