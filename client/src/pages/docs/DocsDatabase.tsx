import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DocsDatabase() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Database Guide</h1>
          <p className="text-muted-foreground mt-2">
            Complete guide to database backends and management
          </p>
        </div>

        {[
          {
            name: "TiDB (Interface Database)",
            status: "Connected",
            desc: "Web interface data storage",
            tables: ["users", "strategies", "backtests", "system_logs", "audit_trail"],
          },
          {
            name: "Redis (Cache)",
            status: "Connected",
            desc: "Live trading state and high-performance caching",
            tables: ["Trading state", "Orders", "Positions", "Market data snapshots"],
          },
          {
            name: "PostgreSQL (Historical Data)",
            status: "Connected",
            desc: "Historical data storage and analytics",
            tables: ["instruments", "orders", "trades", "positions", "bars", "quotes"],
          },
          {
            name: "Parquet (Archive)",
            status: "Ready",
            desc: "Backtesting data and long-term archival",
            tables: ["bars/", "quotes/", "trades/", "backtests/"],
          },
        ].map((db) => (
          <Card key={db.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{db.name}</CardTitle>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  {db.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{db.desc}</p>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Tables/Collections:</h3>
              <div className="flex flex-wrap gap-2">
                {db.tables.map((table) => (
                  <Badge key={table} variant="secondary">
                    {table}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
