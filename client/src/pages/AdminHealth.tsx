import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Component {
  name: string;
  state: string;
  description: string;
  uptime?: number;
  health: string;
  metrics?: any;
  status?: string;
  memory?: string;
  cpu?: string;
}

export default function AdminHealth() {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/trpc/nautilusCore.getAllComponents');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const componentsData = result.result?.data?.json || [];
      setComponents(componentsData);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch components:', err);
      setError(err.message || 'Failed to load data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthBadge = (health: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      healthy: "default",
      degraded: "secondary",
      unhealthy: "destructive",
    };
    return <Badge variant={variants[health] || "secondary"}>{health}</Badge>;
  };

  const healthyCount = components.filter((c) => c.health === "healthy").length;
  const degradedCount = components.filter((c) => c.health === "degraded").length;
  const unhealthyCount = components.filter((c) => c.health === "unhealthy").length;
  const totalCount = components.length;

  if (isLoading && components.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading component health data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && components.length === 0) {
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
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Component Health</h1>
            <p className="text-muted-foreground">Monitor system component health status</p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {healthyCount}/{totalCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCount > 0 ? ((healthyCount / totalCount) * 100).toFixed(1) : 0}% healthy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{healthyCount}</div>
              <p className="text-xs text-muted-foreground">Components</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Degraded</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{degradedCount}</div>
              <p className="text-xs text-muted-foreground">Components</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unhealthy</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{unhealthyCount}</div>
              <p className="text-xs text-muted-foreground">Components</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {components.map((component) => (
            <Card key={component.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getHealthIcon(component.health)}
                    <div>
                      <CardTitle>{component.name}</CardTitle>
                      <CardDescription>{component.description}</CardDescription>
                    </div>
                  </div>
                  {getHealthBadge(component.health)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold">{component.state || component.status || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-mono">
                      {component.uptime ? `${(component.uptime * 1000).toFixed(2)}ms` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Memory</p>
                    <p className="font-mono">
                      {component.metrics?.memory_mb ? `${component.metrics.memory_mb}MB` : component.memory || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Metrics</p>
                    <p className="font-mono">
                      {component.metrics ? `${Object.keys(component.metrics).length} items` : component.cpu || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

