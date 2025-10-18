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
  Package,
  Settings,
  List,
  Filter,
} from "lucide-react";

export default function AdminCoreManagement() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Existing queries
  const { data: systemStatus, refetch: refetchSystem } = trpc.nautilusCore.getSystemStatus.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: components, refetch: refetchComponents } = trpc.nautilusCore.getAllComponents.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: systemMetrics, refetch: refetchMetrics } = trpc.nautilusCore.getSystemMetrics.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: tradingMetrics } = trpc.nautilusCore.getTradingMetrics.useQuery(undefined, {
    refetchInterval: false,
  });

  // New queries for feature and service management
  const { data: allFeatures } = trpc.nautilusCore.getAllFeatures.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: featureStatusSummary } = trpc.nautilusCore.getFeatureStatusSummary.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: allServices } = trpc.nautilusCore.getAllServices.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: coreComponents } = trpc.nautilusCore.getCoreComponents.useQuery(undefined, {
    refetchInterval: false,
  });

  const { data: componentHealthSummary } = trpc.nautilusCore.getComponentHealthSummary.useQuery(undefined, {
    refetchInterval: false,
  });

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      available: "default",
      configured: "secondary",
      requires_config: "outline",
      requires_data: "destructive",
    };
    const colors: Record<string, string> = {
      available: "bg-green-500",
      configured: "bg-blue-500",
      requires_config: "bg-yellow-500",
      requires_data: "bg-orange-500",
    };
    return (
      <Badge variant={variants[status] || "outline"} className={colors[status]}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  // Filter features by category
  const filteredFeatures = selectedCategory === "all" 
    ? allFeatures?.features || []
    : (allFeatures?.features || []).filter((f: any) => f.category === selectedCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nautilus Core Management</h1>
            <p className="text-muted-foreground">
              Manage Nautilus Core components, features, and services
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                refetchSystem();
                refetchComponents();
                refetchMetrics();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={() => emergencyStopMutation.mutate()}
              disabled={emergencyStopMutation.isPending}
            >
              <Square className="h-4 w-4 mr-2" />
              Emergency Stop
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus?.status === "running" ? "Running" : "Stopped"}
              </div>
              <p className="text-xs text-muted-foreground">
                {systemStatus?.uptime || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Components</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {componentHealthSummary?.healthy || 0}/{(coreComponents || []).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {componentHealthSummary?.healthy || 0} healthy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {featureStatusSummary?.available || 0}/{allFeatures?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {featureStatusSummary?.available || 0} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allServices?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active services
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Core Components</CardTitle>
                <CardDescription>
                  Nautilus Core components and their health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {(coreComponents || []).map((component: any) => {
                    const Icon = getComponentIcon(component.id);
                    return (
                      <Card key={component.id} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              <CardTitle className="text-lg">{component.name}</CardTitle>
                            </div>
                            {getHealthIcon(component.health)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={getStateColor(component.status)}>
                              {component.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium">{component.type}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uptime</span>
                            <span className="font-medium">{component.uptime}</span>
                          </div>
                          <div className="text-xs text-muted-foreground pt-2">
                            {component.description}
                          </div>
                          {component.dependencies && component.dependencies.length > 0 && (
                            <div className="pt-2">
                              <div className="text-xs font-medium mb-1">Dependencies:</div>
                              <div className="flex flex-wrap gap-1">
                                {component.dependencies.map((dep: string) => (
                                  <Badge key={dep} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="pt-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => restartMutation.mutate({ component: component.id })}
                              disabled={restartMutation.isPending}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Restart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Nautilus Features</CardTitle>
                    <CardDescription>
                      All {allFeatures?.total || 0} features across {allFeatures?.categories?.length || 0} categories
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 border rounded-md text-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {(allFeatures?.categories || []).map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Feature Status Summary */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {featureStatusSummary?.available || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {featureStatusSummary?.configured || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Configured</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-yellow-600">
                        {featureStatusSummary?.requires_config || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Requires Config</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-orange-600">
                        {featureStatusSummary?.requires_data || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Requires Data</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {filteredFeatures.map((feature: any) => (
                    <Card key={feature.id} className="border-l-4" style={{
                      borderLeftColor: 
                        feature.status === "available" ? "#10b981" :
                        feature.status === "configured" ? "#3b82f6" :
                        feature.status === "requires_config" ? "#f59e0b" : "#f97316"
                    }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{feature.name}</CardTitle>
                            <CardDescription className="text-xs">{feature.category}</CardDescription>
                          </div>
                          {getStatusBadge(feature.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {feature.dependencies && feature.dependencies.length > 0 && (
                          <div>
                            <div className="text-xs font-medium mb-1">Dependencies:</div>
                            <div className="flex flex-wrap gap-1">
                              {feature.dependencies.map((dep: string) => (
                                <Badge key={dep} variant="outline" className="text-xs">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {feature.services && feature.services.length > 0 && (
                          <div>
                            <div className="text-xs font-medium mb-1">Services:</div>
                            <div className="flex flex-wrap gap-1">
                              {feature.services.map((svc: string) => (
                                <Badge key={svc} variant="secondary" className="text-xs">
                                  {svc.replace(/_/g, " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {feature.required_for && feature.required_for.length > 0 && (
                          <div>
                            <div className="text-xs font-medium mb-1">Required For:</div>
                            <div className="text-xs text-muted-foreground">
                              {feature.required_for.join(", ")}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nautilus Services</CardTitle>
                <CardDescription>
                  All {allServices?.total || 0} services provided by Nautilus Core
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {(allServices?.services || []).map((service: any) => (
                    <Card key={service.id} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <CardDescription className="text-xs">{service.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs font-medium mb-2">Provided by:</div>
                        <div className="flex flex-wrap gap-1">
                          {service.provided_by.map((provider: string) => (
                            <Badge key={provider} variant="outline" className="text-xs">
                              {provider}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* System Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>System Metrics</CardTitle>
                  <CardDescription>Core system performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">CPU Usage</span>
                      <span className="font-medium">{systemMetrics?.cpu_usage || 0}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${systemMetrics?.cpu_usage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Memory Usage</span>
                      <span className="font-medium">{systemMetrics?.memory_usage || 0}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${systemMetrics?.memory_usage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Event Queue</span>
                      <span className="font-medium">{systemMetrics?.event_queue_size || 0}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Messages/sec</span>
                      <span className="font-medium">{systemMetrics?.messages_per_second || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Trading Metrics</CardTitle>
                  <CardDescription>Live trading performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Orders</span>
                    <span className="text-2xl font-bold">{tradingMetrics?.active_orders || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open Positions</span>
                    <span className="text-2xl font-bold">{tradingMetrics?.open_positions || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Orders Today</span>
                    <span className="text-2xl font-bold">{tradingMetrics?.orders_today || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fill Rate</span>
                    <span className="text-2xl font-bold">{tradingMetrics?.fill_rate || 0}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

