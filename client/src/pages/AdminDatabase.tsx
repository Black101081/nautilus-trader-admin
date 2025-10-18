import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Database, RefreshCw, Download, Upload, Activity, HardDrive, Clock } from "lucide-react";

export default function AdminDatabase() {
  const { data: dbStats, isLoading, refetch } = trpc.admin.getDatabaseStats.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Database Management</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage database performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Backup
            </Button>
          </div>
        </div>

        {/* Database Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dbStats?.connected ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="destructive">Disconnected</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                High Performance DB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbStats?.tableCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Core + Interface tables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dbStats?.totalRecords?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across all tables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Query Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dbStats?.avgQueryTime ? `${dbStats.avgQueryTime}ms` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last 1000 queries
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tables" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="migrations">Migrations</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>
                  Overview of all tables in Core and Interface databases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading tables...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Table Name</th>
                          <th className="text-left py-3 px-4">Type</th>
                          <th className="text-right py-3 px-4">Records</th>
                          <th className="text-right py-3 px-4">Size</th>
                          <th className="text-right py-3 px-4">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbStats?.tables?.map((table: any) => (
                          <tr key={table.name} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium font-mono text-sm">
                              {table.name}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={table.type === 'core' ? 'default' : 'secondary'}>
                                {table.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-sm">
                              {table.records?.toLocaleString() || 0}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                              {table.size || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                              {table.lastUpdated 
                                ? new Date(table.lastUpdated).toLocaleString()
                                : 'N/A'}
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground">
                              No tables found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
                <CardDescription>
                  Monitor database query performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Connection Pool</div>
                      <div className="text-2xl font-bold">
                        {dbStats?.connectionPool?.active || 0} / {dbStats?.connectionPool?.max || 10}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active / Max connections
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Slow Queries</div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {dbStats?.slowQueries || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Queries &gt; 1000ms in last hour
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backups" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Backups</CardTitle>
                <CardDescription>
                  Manage database backups and restore points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Automatic Backups</div>
                      <div className="text-sm text-muted-foreground">
                        Daily at 2:00 AM UTC
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Last Backup</div>
                      <div className="text-sm text-muted-foreground">
                        {dbStats?.lastBackup 
                          ? new Date(dbStats.lastBackup).toLocaleString()
                          : 'Never'}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Migrations</CardTitle>
                <CardDescription>
                  View and manage database schema migrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <div className="font-medium">Current Schema Version</div>
                      <div className="text-sm text-muted-foreground">
                        All migrations applied
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Up to date</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    Run <code className="bg-muted px-2 py-1 rounded">pnpm db:push</code> to apply pending migrations
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
