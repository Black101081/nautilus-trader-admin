import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DocsAPI() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">API Reference</h1>
          <p className="text-muted-foreground mt-2">
            tRPC API endpoints documentation
          </p>
        </div>

        {[
          {
            router: "admin",
            desc: "Admin operations",
            endpoints: [
              "getDatabaseStats", "getRedisInfo", "getPostgresInfo",
              "getParquetOverview", "getAllUsers", "systemLogs"
            ],
          },
          {
            router: "nautilus",
            desc: "Nautilus Core integration",
            endpoints: [
              "version", "systemInfo", "runBacktest", "listIndicators"
            ],
          },
          {
            router: "core",
            desc: "Core component management",
            endpoints: [
              "getSystemStatus", "getAllComponents", "getSystemMetrics",
              "restartComponent", "emergencyStopAll"
            ],
          },
        ].map((router) => (
          <Card key={router.router}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {router.router}
                <Badge variant="outline">{router.endpoints.length} endpoints</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{router.desc}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {router.endpoints.map((endpoint) => (
                  <div key={endpoint} className="p-2 rounded bg-muted font-mono text-sm">
                    {router.router}.{endpoint}()
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
