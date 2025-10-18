import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Database,
  Zap,
  Clock,
  Target,
  AlertCircle,
  Download,
  Calendar,
  PieChart,
  LineChart
} from "lucide-react";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [metricType, setMetricType] = useState("all");

  const { data: users } = trpc.admin.getAllUsers.useQuery();
  const { data: systemStats } = trpc.admin.systemStats.useQuery();
  const { data: dbStats } = trpc.admin.getDatabaseStats.useQuery();

  // System-wide analytics data (would come from database aggregations)
  const analytics = {
    overview: {
      totalUsers: users?.length || 0,
      activeUsers: users?.filter(u => u.lastSignedIn && 
        new Date(u.lastSignedIn).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length || 0,
      totalTrades: 1247,
      totalVolume: 8945632.50,
      systemUptime: 99.97,
      avgResponseTime: 45,
      errorRate: 0.03,
      apiCalls: 156789,
    },
    trading: {
      totalOrders: 1247,
      filledOrders: 1235,
      cancelledOrders: 12,
      fillRate: 99.04,
      avgExecutionTime: 0.12,
      totalPnL: 45632.80,
      winRate: 62.5,
      totalCommission: 1247.50,
    },
    performance: {
      cpuUsage: 45.2,
      memoryUsage: 62.8,
      diskUsage: 38.5,
      networkIn: 125.6,
      networkOut: 89.3,
      activeConnections: 47,
      queueDepth: 12,
      cacheHitRate: 94.5,
    },
    database: {
      totalRecords: dbStats?.totalRecords || 0,
      totalTables: dbStats?.tableCount || 0,
      avgQueryTime: dbStats?.avgQueryTime || 0,
      slowQueries: dbStats?.slowQueries || 0,
      connectionPool: dbStats?.connectionPool?.active || 0,
      maxConnections: dbStats?.connectionPool?.max || 10,
    },
  };

  // Time series data for charts (mock data - would come from time-series database)
  const tradingVolumeData = [
    { date: "Mon", volume: 1250000, trades: 145 },
    { date: "Tue", volume: 1580000, trades: 178 },
    { date: "Wed", volume: 1420000, trades: 162 },
    { date: "Thu", volume: 1890000, trades: 201 },
    { date: "Fri", volume: 1650000, trades: 189 },
    { date: "Sat", volume: 980000, trades: 98 },
    { date: "Sun", volume: 1175632, trades: 124 },
  ];

  const userActivityData = [
    { date: "Mon", active: 12, new: 2 },
    { date: "Tue", active: 15, new: 3 },
    { date: "Wed", active: 14, new: 1 },
    { date: "Thu", active: 18, new: 4 },
    { date: "Fri", active: 16, new: 2 },
    { date: "Sat", active: 8, new: 0 },
    { date: "Sun", active: 10, new: 1 },
  ];

  const systemPerformanceData = [
    { time: "00:00", cpu: 35, memory: 58, latency: 42 },
    { time: "04:00", cpu: 28, memory: 55, latency: 38 },
    { time: "08:00", cpu: 52, memory: 68, latency: 55 },
    { time: "12:00", cpu: 48, memory: 65, latency: 48 },
    { time: "16:00", cpu: 55, memory: 70, latency: 52 },
    { time: "20:00", cpu: 42, memory: 62, latency: 45 },
  ];

  const topStrategies = [
    { name: "Momentum Scalper", trades: 342, pnl: 12450.30, winRate: 68.5 },
    { name: "Mean Reversion", trades: 287, pnl: 9823.50, winRate: 61.2 },
    { name: "Breakout Trader", trades: 198, pnl: 8934.20, winRate: 59.8 },
    { name: "Arbitrage Bot", trades: 156, pnl: 7821.40, winRate: 72.1 },
    { name: "Trend Follower", trades: 264, pnl: 6603.40, winRate: 55.7 },
  ];

  const topUsers = [
    { name: users?.[0]?.name || "Admin User", trades: 456, volume: 2345678, pnl: 18945.60 },
  ];

  const assetDistribution = [
    { asset: "BTC/USD", volume: 3245678, percentage: 36.3 },
    { asset: "ETH/USD", volume: 2156789, percentage: 24.1 },
    { asset: "SPY", volume: 1845632, percentage: 20.6 },
    { asset: "EUR/USD", volume: 987456, percentage: 11.0 },
    { asset: "Others", volume: 710077, percentage: 8.0 },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">System-wide analytics, metrics, and insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(analytics.overview.totalVolume / 1000000).toFixed(2)}M</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalTrades.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.activeUsers}/{analytics.overview.totalUsers}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                Last 7 days activity
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.systemUptime}%</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <Activity className="h-3 w-3 mr-1" />
                All systems operational
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading Analytics</TabsTrigger>
            <TabsTrigger value="performance">System Performance</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trading Volume Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Trading Volume (7 Days)</CardTitle>
                  <CardDescription>Daily trading volume and order count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tradingVolumeData.map((day) => (
                      <div key={day.date}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{day.date}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{day.trades} trades</span>
                            <span className="text-sm font-medium">${(day.volume / 1000000).toFixed(2)}M</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(day.volume / 2000000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Asset Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Asset Distribution</CardTitle>
                  <CardDescription>Trading volume by asset class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assetDistribution.map((asset) => (
                      <div key={asset.asset}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{asset.asset}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{asset.percentage}%</span>
                            <span className="text-sm font-medium">${(asset.volume / 1000000).toFixed(2)}M</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${asset.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Strategies</CardTitle>
                  <CardDescription>Best strategies by P&L</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left text-sm font-medium">Strategy</th>
                          <th className="p-2 text-right text-sm font-medium">Trades</th>
                          <th className="p-2 text-right text-sm font-medium">P&L</th>
                          <th className="p-2 text-right text-sm font-medium">Win Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topStrategies.map((strategy, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 text-sm font-medium">{strategy.name}</td>
                            <td className="p-2 text-right text-sm">{strategy.trades}</td>
                            <td className="p-2 text-right text-sm text-green-500">
                              ${strategy.pnl.toLocaleString()}
                            </td>
                            <td className="p-2 text-right text-sm">{strategy.winRate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health Metrics</CardTitle>
                  <CardDescription>Real-time system performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm">{analytics.performance.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${analytics.performance.cpuUsage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm">{analytics.performance.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${analytics.performance.memoryUsage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Disk Usage</span>
                      <span className="text-sm">{analytics.performance.diskUsage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${analytics.performance.diskUsage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Cache Hit Rate</span>
                      <span className="text-sm">{analytics.performance.cacheHitRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${analytics.performance.cacheHitRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Analytics Tab */}
          <TabsContent value="trading" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.trading.fillRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.trading.filledOrders}/{analytics.trading.totalOrders} orders filled
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    ${analytics.trading.totalPnL.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Win rate: {analytics.trading.winRate}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Execution</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.trading.avgExecutionTime}s</div>
                  <p className="text-xs text-muted-foreground">Average order execution time</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trading Performance Breakdown</CardTitle>
                <CardDescription>Detailed trading metrics and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold mt-1">{analytics.trading.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Filled Orders</p>
                    <p className="text-2xl font-bold mt-1 text-green-500">{analytics.trading.filledOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cancelled Orders</p>
                    <p className="text-2xl font-bold mt-1 text-red-500">{analytics.trading.cancelledOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Commission</p>
                    <p className="text-2xl font-bold mt-1">${analytics.trading.totalCommission}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Strategies by P&L</CardTitle>
                <CardDescription>Strategy performance rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Rank</th>
                        <th className="p-3 text-left font-medium">Strategy Name</th>
                        <th className="p-3 text-right font-medium">Trades</th>
                        <th className="p-3 text-right font-medium">P&L</th>
                        <th className="p-3 text-right font-medium">Win Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topStrategies.map((strategy, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-3">
                            <Badge variant="outline">#{i + 1}</Badge>
                          </td>
                          <td className="p-3 font-medium">{strategy.name}</td>
                          <td className="p-3 text-right">{strategy.trades}</td>
                          <td className="p-3 text-right text-green-500 font-medium">
                            ${strategy.pnl.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">{strategy.winRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.avgResponseTime}ms</div>
                  <p className="text-xs text-green-500">-5ms from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.errorRate}%</div>
                  <p className="text-xs text-muted-foreground">Very low error rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                  <Activity className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.apiCalls.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Performance Over Time</CardTitle>
                <CardDescription>CPU, Memory, and Latency trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemPerformanceData.map((point) => (
                    <div key={point.time}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{point.time}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span>CPU: {point.cpu}%</span>
                          <span>Mem: {point.memory}%</span>
                          <span>Latency: {point.latency}ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Performance</CardTitle>
                <CardDescription>Database metrics and query performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold mt-1">{analytics.database.totalRecords}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Query Time</p>
                    <p className="text-2xl font-bold mt-1">{analytics.database.avgQueryTime}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Slow Queries</p>
                    <p className="text-2xl font-bold mt-1">{analytics.database.slowQueries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connection Pool</p>
                    <p className="text-2xl font-bold mt-1">
                      {analytics.database.connectionPool}/{analytics.database.maxConnections}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Analytics Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Trades/User</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor(analytics.trading.totalOrders / analytics.overview.totalUsers)}
                  </div>
                  <p className="text-xs text-muted-foreground">Per user</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Activity (7 Days)</CardTitle>
                <CardDescription>Daily active users and new registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userActivityData.map((day) => (
                    <div key={day.date}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{day.date}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-green-500">{day.new} new</span>
                          <span className="text-sm font-medium">{day.active} active</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(day.active / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Users by Trading Volume</CardTitle>
                <CardDescription>Most active traders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">User</th>
                        <th className="p-3 text-right font-medium">Trades</th>
                        <th className="p-3 text-right font-medium">Volume</th>
                        <th className="p-3 text-right font-medium">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUsers.map((user, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-3 font-medium">{user.name}</td>
                          <td className="p-3 text-right">{user.trades}</td>
                          <td className="p-3 text-right">${user.volume.toLocaleString()}</td>
                          <td className="p-3 text-right text-green-500 font-medium">
                            ${user.pnl.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

