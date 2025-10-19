import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DocsTroubleshooting() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Troubleshooting
          </h1>
          <p className="text-muted-foreground mt-2">
            Common issues and solutions
          </p>
        </div>

        {[
          {
            issue: "Database Connection Failed",
            solution: "Check if Redis/PostgreSQL services are running. Restart with: sudo service redis-server start && sudo service postgresql start",
          },
          {
            issue: "Nautilus Core Not Responding",
            solution: "Verify Python dependencies are installed. Run: pip3 install nautilus_trader redis psycopg2-binary pyarrow",
          },
          {
            issue: "Admin Page Not Loading",
            solution: "Clear browser cache and refresh. Check if dev server is running with: pnpm run dev",
          },
          {
            issue: "Real-time Updates Not Working",
            solution: "Check network connection and tRPC endpoints. Verify backend server is running.",
          },
          {
            issue: "Permission Denied Errors",
            solution: "Check user roles and permissions in Access Control page. Ensure proper RBAC configuration.",
          },
        ].map((item) => (
          <Card key={item.issue}>
            <CardHeader>
              <CardTitle className="text-lg">{item.issue}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium mb-2">Solution:</p>
                <p className="text-sm text-muted-foreground">{item.solution}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• Check documentation files in /home/ubuntu/*.md</p>
              <p>• Review system logs in Audit Logs page</p>
              <p>• Consult NautilusTrader official documentation</p>
              <p>• Contact system administrator</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
