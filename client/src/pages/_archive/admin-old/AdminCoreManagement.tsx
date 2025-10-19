import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface SystemStatus {
  status: string;
  version: string;
  uptime_seconds: number;
  uptime_formatted: string;
  timestamp: string;
  nautilus_available: boolean;
}

interface Component {
  id: string;
  name: string;
  type: string;
  status: string;
  health: string;
  description: string;
}

interface Feature {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  description: string;
  status?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
}

interface FeatureStatusSummary {
  available: number;
  configured: number;
  requires_config: number;
  requires_data: number;
}

interface ComponentHealthSummary {
  healthy: number;
  degraded: number;
  unhealthy: number;
}

export default function AdminCoreManagement() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for all data
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [allFeatures, setAllFeatures] = useState<{ features: Feature[]; total: number; categories: string[] } | null>(null);
  const [featureStatusSummary, setFeatureStatusSummary] = useState<FeatureStatusSummary | null>(null);
  const [allServices, setAllServices] = useState<{ services: Service[]; total: number } | null>(null);
  const [coreComponents, setCoreComponents] = useState<Component[]>([]);
  const [componentHealthSummary, setComponentHealthSummary] = useState<ComponentHealthSummary | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel using direct fetch API
      const [
        statusRes,
        componentsRes,
        featuresRes,
        featureSummaryRes,
        servicesRes,
        coreComponentsRes,
        healthSummaryRes,
      ] = await Promise.all([
        fetch('/api/trpc/nautilusCore.getSystemStatus').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getAllComponents').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getAllFeatures').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getFeatureStatusSummary').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getAllServices').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getCoreComponents').then(r => r.json()),
        fetch('/api/trpc/nautilusCore.getComponentHealthSummary').then(r => r.json()),
      ]);

      // Extract data from tRPC response format
      setSystemStatus(statusRes.result?.data?.json || null);
      setComponents(componentsRes.result?.data?.json || []);
      setAllFeatures(featuresRes.result?.data?.json || { features: [], total: 0, categories: [] });
      setFeatureStatusSummary(featureSummaryRes.result?.data?.json || null);
      setAllServices(servicesRes.result?.data?.json || { services: [], total: 0 });
      setCoreComponents(coreComponentsRes.result?.data?.json || []);
      setComponentHealthSummary(healthSummaryRes.result?.data?.json || null);

      setIsLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Failed to load data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleEmergencyStop = async () => {
    try {
      const response = await fetch('/api/trpc/nautilusCore.emergencyStopAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (result.result?.data?.json?.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Emergency stop failed:', err);
    }
  };

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
    : (allFeatures?.features || []).filter((f: Feature) => f.category === selectedCategory);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Nautilus Core data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 font-semibold mb-2">Error loading data</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}>Retry</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmergencyStop}
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
                {systemStatus?.uptime_formatted || "N/A"}
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
                {componentHealthSummary?.healthy || 0}/{coreComponents.length}
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
                  {coreComponents.map((component: Component) => {
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
                          <div className="text-sm text-muted-foreground">
                            {component.description}
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
                    <CardTitle>Features</CardTitle>
                    <CardDescription>
                      Available Nautilus Trader features ({allFeatures?.total || 0} total)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All
                    </Button>
                    {allFeatures?.categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  {filteredFeatures.map((feature: Feature) => (
                    <Card key={feature.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{feature.name}</CardTitle>
                          {feature.enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-2">
                          {feature.description}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
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
                <CardTitle>Services</CardTitle>
                <CardDescription>
                  Available Nautilus Trader services ({allServices?.total || 0} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {allServices?.services.map((service: Service) => (
                    <Card key={service.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{service.name}</CardTitle>
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                          <Badge className="text-xs bg-green-500">
                            {service.status}
                          </Badge>
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
            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>
                  Real-time system and trading metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border">
                    <CardHeader>
                      <CardTitle className="text-sm">Feature Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">{featureStatusSummary?.available || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Configured</span>
                        <span className="font-medium">{featureStatusSummary?.configured || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Requires Config</span>
                        <span className="font-medium">{featureStatusSummary?.requires_config || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Requires Data</span>
                        <span className="font-medium">{featureStatusSummary?.requires_data || 0}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardHeader>
                      <CardTitle className="text-sm">Component Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Healthy</span>
                        <span className="font-medium text-green-500">
                          {componentHealthSummary?.healthy || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Degraded</span>
                        <span className="font-medium text-yellow-500">
                          {componentHealthSummary?.degraded || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Unhealthy</span>
                        <span className="font-medium text-red-500">
                          {componentHealthSummary?.unhealthy || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

