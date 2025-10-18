import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRisk() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Risk Controls</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor risk controls
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Controls</CardTitle>
            <CardDescription>
              This page is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
