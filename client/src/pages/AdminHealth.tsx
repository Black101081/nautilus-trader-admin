import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminHealth() {
  const { data: components } = trpc.nautilusCore.getAllComponents.useQuery(undefined, {
    refetchInterval: 5000,
  });

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

  const healthyCount = components?.filter((c: any) => c.health === "healthy").length || 0;
  const totalCount = components?.length || 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Component Health</h1>
          <p className="text-muted-foreground">Monitor system component health status</p>
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
                {((healthyCount / totalCount) * 100).toFixed(1)}% healthy
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
              <div className="text-2xl font-bold text-yellow-500">0</div>
              <p className="text-xs text-muted-foreground">Components</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unhealthy</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">0</div>
              <p className="text-xs text-muted-foreground">Components</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {components?.map((component: any) => (
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
                    <p className="font-semibold">{component.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-mono">{component.uptime || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Memory</p>
                    <p className="font-mono">{component.memory || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPU</p>
                    <p className="font-mono">{component.cpu || "N/A"}</p>
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
