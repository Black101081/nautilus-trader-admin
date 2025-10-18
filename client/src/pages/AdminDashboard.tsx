import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, Users, TrendingUp, AlertTriangle, Database, Shield, 
  Home, RefreshCw, Settings, Bell, CheckCircle, XCircle 
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: systemStats, isLoading: statsLoading, refetch: refetchStats } = trpc.admin.systemStats.useQuery();
  const { data: systemLogs, isLoading: logsLoading } = trpc.admin.systemLogs.useQuery();
  const { data: auditTrail, isLoading: auditLoading } = trpc.admin.auditTrail.useQuery();
  const { data: allUsers, isLoading: usersLoading } = trpc.admin.allUsers.useQuery();

  // Calculate health status
  const errorCount = systemStats?.systemLogsCount || 0;
  const systemHealth = errorCount === 0 ? "healthy" : errorCount < 10 ? "warning" : "critical";

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <h1 className="text-sm font-bold">System Administration</h1>
                <p className="text-xs text-muted-foreground">Platform Management Console</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={systemHealth === "healthy" ? "default" : systemHealth === "warning" ? "secondary" : "destructive"}
              className="gap-1"
            >
              {systemHealth === "healthy" ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              System {systemHealth}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => refetchStats()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* System Overview Dashboard */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">System Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsLoading ? "..." : (allUsers?.length || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsLoading ? "..." : (systemStats?.totalStrategies || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Deployed trading strategies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsLoading ? "..." : (systemStats?.totalBacktests || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total backtests executed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${errorCount === 0 ? "text-green-500" : "text-destructive"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${errorCount === 0 ? "text-green-500" : "text-destructive"}`}>
                  {statsLoading ? "..." : errorCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Error events logged
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity className="h-4 w-4" />
              System Monitoring
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Shield className="h-4 w-4" />
              Audit & Security
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                  </div>
                ) : !allUsers || allUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users registered yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.name || "Unnamed User"}</div>
                            <div className="text-xs text-muted-foreground">{user.loginMethod || "N/A"}</div>
                          </TableCell>
                          <TableCell>{user.email || "No email"}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.lastSignedIn
                              ? new Date(user.lastSignedIn).toLocaleString()
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection</span>
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Records</span>
                    <span className="font-mono text-sm">{(systemStats?.totalBacktests || 0) + (systemStats?.totalStrategies || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Connections</span>
                    <span className="font-mono text-sm">{allUsers?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Trading Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Live Trades</span>
                    <span className="font-mono text-sm">{systemStats?.totalLiveTrades || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open Positions</span>
                    <span className="font-mono text-sm">{systemStats?.openPositions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Strategies</span>
                    <span className="font-mono text-sm">{systemStats?.totalStrategies || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent System Events
                </CardTitle>
                <CardDescription>Latest system logs and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading events...</div>
                ) : !systemLogs || systemLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No recent events</div>
                ) : (
                  <div className="space-y-2">
                    {systemLogs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-accent/30 transition-colors"
                      >
                        <Badge
                          variant={
                            log.level === "critical" || log.level === "error"
                              ? "destructive"
                              : log.level === "warning"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-0.5"
                        >
                          {log.level}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{log.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {log.category && (
                              <span className="text-xs text-muted-foreground">{log.category}</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {log.createdAt
                                ? new Date(log.createdAt).toLocaleString()
                                : "Unknown time"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit & Security Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Audit Trail
                </CardTitle>
                <CardDescription>Track all user actions and system changes</CardDescription>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading audit records...</div>
                ) : !auditTrail || auditTrail.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No audit records found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditTrail.slice(0, 15).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="text-sm">
                            {record.createdAt
                              ? new Date(record.createdAt).toLocaleString()
                              : "Unknown"}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{record.userId.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.action}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{record.resource || "N/A"}</TableCell>
                          <TableCell className="font-mono text-xs">{record.ipAddress || "N/A"}</TableCell>
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

