import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsUserGuide() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">User Guide</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive guide for using the admin interface
          </p>
        </div>

        {[
          {
            section: "Dashboard",
            items: [
              "View system metrics and status",
              "Monitor component health",
              "Check trading analytics",
            ],
          },
          {
            section: "Database Management",
            items: [
              "Monitor TiDB tables and records",
              "Check Redis cache performance",
              "View PostgreSQL storage stats",
              "Browse Parquet archive files",
            ],
          },
          {
            section: "User Management",
            items: [
              "Create and manage users",
              "Assign roles and permissions",
              "Generate API keys",
              "Monitor active sessions",
            ],
          },
          {
            section: "Trading Operations",
            items: [
              "Monitor order execution",
              "Configure risk limits",
              "Manage broker connections",
              "View execution quality metrics",
            ],
          },
        ].map((section) => (
          <Card key={section.section}>
            <CardHeader>
              <CardTitle>{section.section}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
