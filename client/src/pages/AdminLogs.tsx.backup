import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Download, Filter, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevel, setLogLevel] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  const { data: auditLogs, refetch } = trpc.admin.auditTrail.useQuery(
    undefined,
    { refetchInterval: 5000 }
  );

  const { data: systemLogs } = trpc.admin.systemLogs.useQuery(
    undefined,
    { refetchInterval: 5000 }
  );

  const getLogIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "error": return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getLogBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level.toLowerCase()) {
      case "error": return "destructive";
      case "warning": return "outline";
      case "success": return "secondary";
      default: return "default";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">Monitor system activities and user actions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditLogs?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {systemLogs?.filter(log => log.level === "error").length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {systemLogs?.filter(log => log.level === "warning").length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Review recommended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Log Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs Tabs */}
        <Tabs defaultValue="audit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="system">System Logs</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="trading">Trading Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>User actions and system changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="mt-1">{getLogIcon(log.action || "info")}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{log.action || "Unknown Action"}</span>
                            <Badge variant="outline">{log.userId || "System"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {log.details || "No details available"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={getLogBadgeVariant(log.action || "info")}>
                          {log.action || "INFO"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No audit logs found</p>
                      <p className="text-sm">Logs will appear here as actions are performed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Application and infrastructure logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemLogs && systemLogs.length > 0 ? (
                    systemLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors font-mono text-sm"
                      >
                        <div className="mt-1">{getLogIcon(log.level)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{log.component || "System"}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.level?.toUpperCase() || "INFO"}
                            </Badge>
                          </div>
                          <p className="text-sm">{log.message || "No message"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No system logs found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Authentication and authorization events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "10:45:23", event: "Login Success", user: "admin@example.com", ip: "192.168.1.100", status: "success" },
                    { time: "10:30:15", event: "Failed Login Attempt", user: "unknown@test.com", ip: "203.0.113.42", status: "error" },
                    { time: "09:15:08", event: "Password Changed", user: "user@example.com", ip: "192.168.1.105", status: "info" },
                  ].map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-1">{getLogIcon(event.status)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.event}</span>
                          <Badge variant="outline">{event.user}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">IP: {event.ip}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                      <Badge variant={getLogBadgeVariant(event.status)}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trading Activity</CardTitle>
                <CardDescription>Order execution and strategy events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "11:23:45", event: "Order Executed", details: "BUY 100 EUR/USD @ 1.0850", status: "success" },
                    { time: "11:15:32", event: "Strategy Started", details: "Moving Average Crossover", status: "info" },
                    { time: "10:58:19", event: "Order Rejected", details: "Insufficient margin", status: "error" },
                  ].map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-1">{getLogIcon(event.status)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.event}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                      <Badge variant={getLogBadgeVariant(event.status)}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
