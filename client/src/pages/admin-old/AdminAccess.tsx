import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Users, Activity, Key, AlertTriangle, CheckCircle, XCircle, UserX } from "lucide-react";

export default function AdminAccess() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const [users, setUsers] = useState<any>(null);
  const [auditTrail, setAuditTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, auditRes] = await Promise.all([
        fetch('/api/trpc/admin.getAllUsers').then(r => r.json()),
        fetch('/api/trpc/admin.auditTrail').then(r => r.json())
      ]);
      setUsers(usersRes.result?.data?.json || null);
      setAuditTrail(auditRes.result?.data?.json || null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Role definitions with permissions
  const roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access with all permissions",
      userCount: users?.filter(u => u.role === "admin").length || 0,
      permissions: [
        "system.manage",
        "users.manage",
        "database.manage",
        "risk.manage",
        "trading.execute",
        "trading.view",
        "analytics.view",
        "settings.manage",
        "logs.view",
        "api.manage",
      ],
      color: "destructive" as const,
    },
    {
      id: "trader",
      name: "Trader",
      description: "Trading operations and portfolio management",
      userCount: users?.filter(u => u.role === "user").length || 0,
      permissions: [
        "trading.execute",
        "trading.view",
        "portfolio.manage",
        "strategies.manage",
        "analytics.view",
      ],
      color: "default" as const,
    },
    {
      id: "analyst",
      name: "Analyst",
      description: "Read-only access to analytics and reports",
      userCount: 0,
      permissions: [
        "trading.view",
        "analytics.view",
        "reports.view",
      ],
      color: "secondary" as const,
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Limited read-only access",
      userCount: 0,
      permissions: [
        "dashboard.view",
        "reports.view",
      ],
      color: "outline" as const,
    },
  ];

  // Permission categories
  const permissionCategories = [
    {
      category: "System Management",
      permissions: [
        { id: "system.manage", name: "Manage System", description: "Full system administration" },
        { id: "system.restart", name: "Restart System", description: "Restart core components" },
        { id: "system.shutdown", name: "Shutdown System", description: "Emergency shutdown" },
      ],
    },
    {
      category: "User Management",
      permissions: [
        { id: "users.manage", name: "Manage Users", description: "Create, edit, delete users" },
        { id: "users.view", name: "View Users", description: "View user information" },
        { id: "users.roles", name: "Manage Roles", description: "Assign user roles" },
      ],
    },
    {
      category: "Trading Operations",
      permissions: [
        { id: "trading.execute", name: "Execute Trades", description: "Place and manage orders" },
        { id: "trading.view", name: "View Trades", description: "View trading activity" },
        { id: "trading.cancel", name: "Cancel Orders", description: "Cancel pending orders" },
      ],
    },
    {
      category: "Risk Management",
      permissions: [
        { id: "risk.manage", name: "Manage Risk", description: "Configure risk limits" },
        { id: "risk.view", name: "View Risk", description: "View risk metrics" },
        { id: "risk.override", name: "Override Limits", description: "Override risk limits" },
      ],
    },
    {
      category: "Data & Analytics",
      permissions: [
        { id: "analytics.view", name: "View Analytics", description: "Access analytics dashboards" },
        { id: "reports.view", name: "View Reports", description: "Access reports" },
        { id: "reports.export", name: "Export Reports", description: "Export data and reports" },
      ],
    },
  ];

  // Active sessions (mock data - would come from database)
  const activeSessions = [
    {
      id: "session_1",
      userId: users?.[0]?.id || "user_1",
      userName: users?.[0]?.name || "Admin User",
      role: users?.[0]?.role || "admin",
      ipAddress: "192.168.1.100",
      location: "San Francisco, CA",
      device: "Chrome on macOS",
      loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      status: "active" as const,
    },
  ];

  // Security events (from audit trail)
  const securityEvents = auditTrail?.slice(0, 10).map(log => ({
    id: log.id,
    type: log.action.includes("login") ? "login" : log.action.includes("failed") ? "failed_auth" : "permission_change",
    severity: log.action.includes("failed") ? "high" : "low",
    user: log.userId,
    action: log.action,
    timestamp: log.createdAt,
    ipAddress: log.ipAddress || "N/A",
    details: log.details || "N/A",
  })) || [];

  const totalUsers = users?.length || 0;
  const activeUsers = activeSessions.length;
  const failedLogins = securityEvents.filter(e => e.type === "failed_auth").length;
  const permissionChanges = securityEvents.filter(e => e.type === "permission_change").length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Access Control</h1>
            <p className="text-muted-foreground">Manage roles, permissions, and access security</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Key className="mr-2 h-4 w-4" />
              Generate API Key
            </Button>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedLogins}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission Changes</CardTitle>
              <Lock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{permissionChanges}</div>
              <p className="text-xs text-muted-foreground">Recent changes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="policies">Access Policies</TabsTrigger>
          </TabsList>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Define roles and assign permissions to user groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle className="text-lg">{role.name}</CardTitle>
                          </div>
                          <Badge variant={role.color}>{role.userCount} users</Badge>
                        </div>
                        <CardDescription>{role.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Permissions ({role.permissions.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 5).map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm.split('.')[1]}
                              </Badge>
                            ))}
                            {role.permissions.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setSelectedRole(role.id);
                              setIsPermissionDialogOpen(true);
                            }}
                          >
                            View Permissions
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Edit Role
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permission Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
                <CardDescription>Granular permission definitions across all system modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {permissionCategories.map((category) => (
                    <div key={category.category}>
                      <h3 className="font-semibold mb-3">{category.category}</h3>
                      <div className="space-y-2">
                        {category.permissions.map((perm) => (
                          <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <p className="font-medium">{perm.name}</p>
                              </div>
                              <p className="text-sm text-muted-foreground ml-6">{perm.description}</p>
                            </div>
                            <Badge variant="outline" className="ml-4">{perm.id}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active User Sessions</CardTitle>
                <CardDescription>Monitor and manage currently active user sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">User</th>
                        <th className="p-3 text-left font-medium">Role</th>
                        <th className="p-3 text-left font-medium">IP Address</th>
                        <th className="p-3 text-left font-medium">Location</th>
                        <th className="p-3 text-left font-medium">Device</th>
                        <th className="p-3 text-left font-medium">Login Time</th>
                        <th className="p-3 text-left font-medium">Last Activity</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSessions.map((session) => (
                        <tr key={session.id} className="border-b">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{session.userName}</p>
                              <p className="text-xs text-muted-foreground">{session.userId}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={session.role === "admin" ? "destructive" : "default"}>
                              {session.role}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{session.ipAddress}</td>
                          <td className="p-3 text-sm">{session.location}</td>
                          <td className="p-3 text-sm">{session.device}</td>
                          <td className="p-3 text-sm">{session.loginTime.toLocaleString()}</td>
                          <td className="p-3 text-sm">{session.lastActivity.toLocaleString()}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-green-500">
                              <Activity className="h-3 w-3 mr-1" />
                              {session.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="destructive">
                              <UserX className="h-3 w-3 mr-1" />
                              Force Logout
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Events Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Events Log</CardTitle>
                <CardDescription>Monitor authentication attempts and security-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Timestamp</th>
                        <th className="p-3 text-left font-medium">Event Type</th>
                        <th className="p-3 text-left font-medium">Severity</th>
                        <th className="p-3 text-left font-medium">User</th>
                        <th className="p-3 text-left font-medium">Action</th>
                        <th className="p-3 text-left font-medium">IP Address</th>
                        <th className="p-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityEvents.map((event) => (
                        <tr key={event.id} className="border-b">
                          <td className="p-3 text-sm">
                            {event.timestamp ? new Date(event.timestamp).toLocaleString() : "N/A"}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {event.type.replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {event.severity === "high" ? (
                              <Badge variant="destructive">High</Badge>
                            ) : (
                              <Badge variant="secondary">Low</Badge>
                            )}
                          </td>
                          <td className="p-3 text-sm">{event.user}</td>
                          <td className="p-3 text-sm">{event.action}</td>
                          <td className="p-3 text-sm">{event.ipAddress}</td>
                          <td className="p-3">
                            {event.severity === "high" ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Policies Tab */}
          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Policies</CardTitle>
                <CardDescription>Configure system-wide access control policies and restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Require Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Enforce 2FA for all admin users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">IP Whitelist</p>
                      <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Password Complexity</p>
                      <p className="text-sm text-muted-foreground">Require strong passwords (min 12 chars, special chars)</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Login Attempt Limit</p>
                      <p className="text-sm text-muted-foreground">Lock account after 5 failed login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Audit All Actions</p>
                      <p className="text-sm text-muted-foreground">Log all user actions for compliance</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Permission Details Dialog */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Role Permissions</DialogTitle>
              <DialogDescription>
                {selectedRole && roles.find(r => r.id === selectedRole)?.name} - Detailed permission list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              {selectedRole && roles.find(r => r.id === selectedRole)?.permissions.map((perm) => (
                <div key={perm} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{perm}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Close
              </Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

