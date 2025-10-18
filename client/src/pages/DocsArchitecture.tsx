import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsArchitecture() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">System Architecture</h1>
          <p className="text-muted-foreground mt-2">
            Technical overview of NautilusTrader system architecture
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Architecture Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`┌─────────────────────────────────────────┐
│     Admin Interface (React + TS)        │
│  13 Pages with Real-time Monitoring     │
└─────────────────────────────────────────┘
                  │ tRPC
                  ▼
┌─────────────────────────────────────────┐
│      Backend API (Node.js + tRPC)       │
│   50+ Endpoints, Type-safe APIs         │
└─────────────────────────────────────────┘
          │               │
          ▼               ▼
┌──────────────┐  ┌──────────────────┐
│   Databases  │  │  Python Bridge   │
│  TiDB/Redis  │  │ (Nautilus Core)  │
│  PG/Parquet  │  │   v1.220.0       │
└──────────────┘  └──────────────────┘`}
            </pre>

            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-medium mb-2">Frontend Layer</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>React 18 with TypeScript</li>
                  <li>Vite for build tooling</li>
                  <li>TailwindCSS for styling</li>
                  <li>tRPC for type-safe API calls</li>
                  <li>Shadcn/ui component library</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Backend Layer</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Node.js 22.13.0 with Express</li>
                  <li>tRPC for API layer</li>
                  <li>Python 3.11 for Nautilus Core integration</li>
                  <li>Drizzle ORM for database operations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Database Layer</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>TiDB - Web interface data</li>
                  <li>Redis - Live trading cache</li>
                  <li>PostgreSQL - Historical data</li>
                  <li>Parquet - Archive storage</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Trading Engine</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>NautilusTrader Core v1.220.0</li>
                  <li>Python-based algorithmic trading platform</li>
                  <li>Integrated via Python bridge</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Kernel", desc: "Central orchestration" },
                { name: "MessageBus", desc: "Inter-component communication" },
                { name: "Cache", desc: "High-performance storage" },
                { name: "DataEngine", desc: "Market data processing" },
                { name: "ExecutionEngine", desc: "Order lifecycle management" },
                { name: "RiskEngine", desc: "Risk management" },
              ].map((comp) => (
                <div key={comp.name} className="p-3 rounded-lg border">
                  <h3 className="font-medium">{comp.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{comp.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
