import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, PlayCircle, BookOpen } from "lucide-react";

export default function DocsGettingStarted() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Getting Started</h1>
          <p className="text-muted-foreground mt-2">
            Quick start guide for NautilusTrader Admin Interface
          </p>
        </div>

        {/* Quick Start Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Follow these steps to get started with the admin interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "System Overview",
                  description: "Check system status and metrics on the dashboard",
                  completed: true,
                },
                {
                  step: 2,
                  title: "Database Configuration",
                  description: "Verify all 4 database backends are connected (TiDB, Redis, PostgreSQL, Parquet)",
                  completed: true,
                },
                {
                  step: 3,
                  title: "Nautilus Core",
                  description: "Monitor Nautilus Core components and their health status",
                  completed: false,
                },
                {
                  step: 4,
                  title: "User Management",
                  description: "Set up users, roles, and access control",
                  completed: false,
                },
                {
                  step: 5,
                  title: "Trading Operations",
                  description: "Configure brokers and execution settings",
                  completed: false,
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg border">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Step {item.step}: {item.title}</span>
                      {item.completed && (
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Overview of main features available in the admin interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "System Monitoring",
                  description: "Real-time monitoring of system metrics, components, and health status",
                  icon: "📊",
                },
                {
                  title: "Database Management",
                  description: "Manage TiDB, Redis, PostgreSQL, and Parquet storage backends",
                  icon: "💾",
                },
                {
                  title: "User & Access Control",
                  description: "RBAC, permissions, API keys, and session management",
                  icon: "🔐",
                },
                {
                  title: "Trading Operations",
                  description: "Execution monitoring, risk controls, and broker integration",
                  icon: "⚡",
                },
                {
                  title: "Analytics",
                  description: "Trading volume, performance metrics, and system analytics",
                  icon: "📈",
                },
                {
                  title: "Audit & Compliance",
                  description: "Comprehensive audit logs and compliance monitoring",
                  icon: "📋",
                },
              ].map((feature) => (
                <div key={feature.title} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
            <CardDescription>
              Prerequisites for running NautilusTrader
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Software</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Node.js 22.13.0+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Python 3.11+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Redis 6.0+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>PostgreSQL 14+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>TiDB or MySQL 8.0+</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Hardware</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span>4 GB RAM minimum (8 GB recommended)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span>10 GB disk space</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span>Multi-core CPU recommended</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Next Steps
            </CardTitle>
            <CardDescription>
              Continue learning about the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/docs/architecture"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <h3 className="font-medium">System Architecture</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn about the system architecture and components
                </p>
              </a>
              <a
                href="/admin/docs/database"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <h3 className="font-medium">Database Guide</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Understand database backends and management
                </p>
              </a>
              <a
                href="/admin/docs/user-guide"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <h3 className="font-medium">User Guide</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive guide for using the admin interface
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

