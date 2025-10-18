import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, TrendingUp, AlertTriangle, Database, Shield } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: systemStats, isLoading: statsLoading } = trpc.admin.systemStats.useQuery();
  const { data: systemLogs, isLoading: logsLoading } = trpc.admin.systemLogs.useQuery();
  const { data: auditTrail, isLoading: auditLoading } = trpc.admin.auditTrail.useQuery();
  const { data: allUsers, isLoading: usersLoading } = trpc.admin.allUsers.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (systemStats?.totalUsers || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (systemStats?.totalStrategies || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Created strategies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backtests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (systemStats?.totalBacktests || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Backtest runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Trades</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (systemStats?.totalLiveTrades || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total live trades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : (systemStats?.openPositions || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {statsLoading ? "..." : (systemStats?.systemLogsCount || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Error logs</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different admin views */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                ) : !allUsers || allUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Login Method</TableHead>
                        <TableHead>Last Sign In</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.loginMethod || "N/A"}</TableCell>
                          <TableCell>
                            {user.lastSignedIn
                              ? new Date(user.lastSignedIn).toLocaleString()
                              : "Never"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and errors</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading logs...</div>
                ) : !systemLogs || systemLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No logs found</div>
                ) : (
                  <div className="space-y-2">
                    {systemLogs.slice(0, 20).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                      >
                        <Badge
                          variant={
                            log.level === "critical" || log.level === "error"
                              ? "destructive"
                              : log.level === "warning"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {log.level}
                        </Badge>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{log.message}</p>
                          {log.category && (
                            <p className="text-xs text-muted-foreground">Category: {log.category}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : "Unknown time"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>User actions and system changes</CardDescription>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading audit trail...</div>
                ) : !auditTrail || auditTrail.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No audit records found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditTrail.slice(0, 20).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.action}</TableCell>
                          <TableCell>{record.resource || "N/A"}</TableCell>
                          <TableCell className="font-mono text-xs">{record.userId}</TableCell>
                          <TableCell>{record.ipAddress || "N/A"}</TableCell>
                          <TableCell>
                            {record.createdAt
                              ? new Date(record.createdAt).toLocaleString()
                              : "Unknown"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

