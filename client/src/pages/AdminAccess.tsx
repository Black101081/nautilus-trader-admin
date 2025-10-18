import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAccess() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Access Control</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor access control
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
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
