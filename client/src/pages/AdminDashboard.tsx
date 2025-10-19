import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { SystemStats, SystemLog, AuditLog, User } from "@/types/api";
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
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditLog[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [stats, logs, audit, users] = await apiClient.queryMany<[
        SystemStats,
        SystemLog[],
        AuditLog[],
        User[]
      ]>(
        'admin.systemStats',
        'admin.systemLogs',
        'admin.auditTrail',
        'admin.allUsers'
      );

      setSystemStats(stats);
      setSystemLogs(logs || []);
      setAuditTrail(audit || []);
      setAllUsers(users || []);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate health status
  const errorCount = systemStats?.systemLogsCount || 0;
  const systemHealth = errorCount === 0 ? "healthy" : errorCount < 10 ? "warning" : "critical";

  const statsLoading = isLoading && !systemStats;
  const logsLoading = isLoading && systemLogs.length === 0;
  const auditLoading = isLoading && auditTrail.length === 0;
  const usersLoading = isLoading && allUsers.length === 0;

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
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Failed to load dashboard data</p>
                  <p className="text-sm">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData} className="ml-auto">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                  {statsLoading ? "..." : (systemStats?.activeConnections || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsLoading ? "..." : errorCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unresolved issues
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="audit">Audit & Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Resources
                  </CardTitle>
                  <CardDescription>Current resource utilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CPU Usage</span>
                    <span className="font-mono text-sm">{systemStats?.cpuUsage || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Memory Usage</span>
                    <span className="font-mono text-sm">{systemStats?.memoryUsage || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Disk Usage</span>
                    <span className="font-mono text-sm">{systemStats?.diskUsage || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="font-mono text-sm">{systemStats?.activeConnections || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Platform Statistics
                  </CardTitle>
                  <CardDescription>Key platform metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Users</span>
                    <span className="font-mono text-sm">{allUsers?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Strategies</span>
                    <span className="font-mono text-sm">{systemStats?.totalStrategies || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Backtests</span>
                    <span className="font-mono text-sm">{systemStats?.totalBacktests || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">System Logs</span>
                    <span className="font-mono text-sm">{systemStats?.systemLogsCount || 0}</span>
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
                            {log.source && (
                              <span className="text-xs text-muted-foreground">{log.source}</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {log.timestamp
                                ? new Date(log.timestamp).toLocaleString()
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

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Users
                </CardTitle>
                <CardDescription>All platform users and their status</CardDescription>
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
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell className="text-sm">{user.email || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.is_active ? "default" : "destructive"}>
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.last_login
                              ? new Date(user.last_login).toLocaleString()
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

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Activity Log
                </CardTitle>
                <CardDescription>Real-time system events and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading activity...</div>
                ) : !systemLogs || systemLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No activity logged</div>
                ) : (
                  <div className="space-y-2">
                    {systemLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/40"
                      >
                        <Badge
                          variant={
                            log.level === "critical" || log.level === "error"
                              ? "destructive"
                              : log.level === "warning"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {log.level}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {log.source && `${log.source} • `}
                            {log.timestamp
                              ? new Date(log.timestamp).toLocaleString()
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
                            {record.timestamp
                              ? new Date(record.timestamp).toLocaleString()
                              : "Unknown"}
                          </TableCell>
                          <TableCell className="font-medium">{record.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.action}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{record.resource || "N/A"}</TableCell>
                          <TableCell className="font-mono text-xs">{record.ip_address || "N/A"}</TableCell>
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

