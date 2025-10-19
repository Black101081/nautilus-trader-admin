import { useState } from "react";
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
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Zap,
  Target,
  AlertCircle,
  RefreshCw,
  Pause,
  Play,
  StopCircle,
  Settings,
  Filter,
  Download
} from "lucide-react";

export default function AdminExecution() {
  const [isThrottleDialogOpen, setIsThrottleDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [executionEnabled, setExecutionEnabled] = useState(true);

  // Execution engine status (would come from Nautilus Core)
  const executionStatus = {
    status: "active",
    health: "healthy",
    uptime: 99.98,
    ordersProcessed: 1247,
    ordersPerSecond: 12.5,
    avgLatency: 45,
    errorRate: 0.02,
    queueDepth: 8,
    maxQueueDepth: 1000,
    throttleEnabled: false,
    throttleRate: 100,
  };

  // Active orders (would come from database)
  const activeOrders = [
    {
      id: "order_1",
      clientOrderId: "CLT_001_20250118_001",
      strategyId: "momentum_scalper",
      symbol: "BTC/USD",
      side: "buy",
      orderType: "limit",
      quantity: 0.5,
      price: 42500.00,
      status: "pending",
      venue: "Binance",
      timeInForce: "GTC",
      submittedAt: new Date(Date.now() - 2 * 60 * 1000),
      filledQuantity: 0,
      avgFillPrice: null,
      commission: 0,
    },
    {
      id: "order_2",
      clientOrderId: "CLT_002_20250118_002",
      strategyId: "mean_reversion",
      symbol: "ETH/USD",
      side: "sell",
      orderType: "market",
      quantity: 2.0,
      price: null,
      status: "partial",
      venue: "Coinbase",
      timeInForce: "IOC",
      submittedAt: new Date(Date.now() - 5 * 60 * 1000),
      filledQuantity: 1.2,
      avgFillPrice: 2245.50,
      commission: 2.69,
    },
    {
      id: "order_3",
      clientOrderId: "CLT_003_20250118_003",
      strategyId: "breakout_trader",
      symbol: "SPY",
      side: "buy",
      orderType: "stop_limit",
      quantity: 100,
      price: 485.00,
      status: "pending",
      venue: "Interactive Brokers",
      timeInForce: "DAY",
      submittedAt: new Date(Date.now() - 10 * 60 * 1000),
      filledQuantity: 0,
      avgFillPrice: null,
      commission: 0,
    },
  ];

  // Recent executions (completed orders)
  const recentExecutions = [
    {
      id: "exec_1",
      orderId: "order_100",
      symbol: "BTC/USD",
      side: "buy",
      quantity: 0.3,
      price: 42450.00,
      venue: "Binance",
      executionTime: new Date(Date.now() - 15 * 60 * 1000),
      latency: 42,
      status: "filled",
      commission: 12.74,
    },
    {
      id: "exec_2",
      orderId: "order_101",
      symbol: "ETH/USD",
      side: "sell",
      quantity: 1.5,
      price: 2248.30,
      venue: "Coinbase",
      executionTime: new Date(Date.now() - 20 * 60 * 1000),
      latency: 38,
      status: "filled",
      commission: 3.37,
    },
    {
      id: "exec_3",
      orderId: "order_102",
      symbol: "EUR/USD",
      side: "buy",
      quantity: 10000,
      price: 1.0875,
      venue: "Interactive Brokers",
      executionTime: new Date(Date.now() - 25 * 60 * 1000),
      latency: 52,
      status: "filled",
      commission: 5.44,
    },
  ];

  // Venue connections
  const venueConnections = [
    {
      venue: "Binance",
      status: "connected",
      ordersToday: 342,
      fillRate: 98.5,
      avgLatency: 45,
      errorRate: 0.5,
      queueDepth: 3,
    },
    {
      venue: "Coinbase",
      status: "connected",
      ordersToday: 189,
      fillRate: 97.2,
      avgLatency: 62,
      errorRate: 1.2,
      queueDepth: 2,
    },
    {
      venue: "Interactive Brokers",
      status: "connected",
      ordersToday: 456,
      fillRate: 99.1,
      avgLatency: 38,
      errorRate: 0.3,
      queueDepth: 3,
    },
    {
      venue: "Kraken",
      status: "disconnected",
      ordersToday: 0,
      fillRate: 0,
      avgLatency: null,
      errorRate: 0,
      queueDepth: 0,
    },
  ];

  // Execution quality metrics
  const executionQuality = {
    totalOrders: 1247,
    filledOrders: 1235,
    cancelledOrders: 12,
    rejectedOrders: 5,
    fillRate: 99.04,
    avgFillTime: 0.12,
    avgSlippage: 0.02,
    bestExecution: 94.5,
  };

  const handleCancelOrder = (orderId: string) => {
    console.log("Cancelling order:", orderId);
    // Would trigger order cancellation
  };

  const handleCancelAllOrders = () => {
    if (confirm("Are you sure you want to cancel ALL active orders?")) {
      console.log("Cancelling all orders");
      // Would trigger mass cancellation
    }
  };

  const handleToggleExecution = (enabled: boolean) => {
    setExecutionEnabled(enabled);
    console.log("Execution engine:", enabled ? "enabled" : "disabled");
    // Would toggle execution engine
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "filled":
        return <Badge className="bg-green-500">Filled</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Execution Management</h1>
            <p className="text-muted-foreground">Monitor and control order execution and venue connections</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={executionEnabled ? "destructive" : "default"}
              onClick={() => handleToggleExecution(!executionEnabled)}
            >
              {executionEnabled ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Execution
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume Execution
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleCancelAllOrders}>
              <StopCircle className="mr-2 h-4 w-4" />
              Cancel All Orders
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engine Status</CardTitle>
              <Activity className={executionEnabled ? "h-4 w-4 text-green-500" : "h-4 w-4 text-red-500"} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{executionStatus.status}</div>
              <p className="text-xs text-muted-foreground">
                {executionEnabled ? "Processing orders" : "Paused"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders/Second</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{executionStatus.ordersPerSecond}</div>
              <p className="text-xs text-muted-foreground">Current throughput</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{executionStatus.avgLatency}ms</div>
              <p className="text-xs text-green-500">-3ms from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Depth</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{executionStatus.queueDepth}</div>
              <p className="text-xs text-muted-foreground">
                Max: {executionStatus.maxQueueDepth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="executions">Recent Executions</TabsTrigger>
            <TabsTrigger value="venues">Venue Connections</TabsTrigger>
            <TabsTrigger value="quality">Execution Quality</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          {/* Active Orders Tab */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Orders</CardTitle>
                    <CardDescription>Currently pending and partially filled orders</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Order ID</th>
                        <th className="p-3 text-left font-medium">Symbol</th>
                        <th className="p-3 text-left font-medium">Side</th>
                        <th className="p-3 text-left font-medium">Type</th>
                        <th className="p-3 text-left font-medium">Quantity</th>
                        <th className="p-3 text-left font-medium">Price</th>
                        <th className="p-3 text-left font-medium">Filled</th>
                        <th className="p-3 text-left font-medium">Venue</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Age</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-sm">{order.clientOrderId}</p>
                              <p className="text-xs text-muted-foreground">{order.strategyId}</p>
                            </div>
                          </td>
                          <td className="p-3 font-medium">{order.symbol}</td>
                          <td className="p-3">
                            <Badge variant={order.side === "buy" ? "default" : "destructive"}>
                              {order.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{order.orderType}</td>
                          <td className="p-3 text-sm">{order.quantity}</td>
                          <td className="p-3 text-sm">{order.price ? `$${order.price.toLocaleString()}` : "Market"}</td>
                          <td className="p-3 text-sm">
                            {order.filledQuantity > 0 ? (
                              <span className="text-green-500">
                                {order.filledQuantity}/{order.quantity}
                              </span>
                            ) : (
                              "0"
                            )}
                          </td>
                          <td className="p-3 text-sm">{order.venue}</td>
                          <td className="p-3">{getStatusBadge(order.status)}</td>
                          <td className="p-3 text-sm">
                            {Math.floor((Date.now() - order.submittedAt.getTime()) / 60000)}m
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderDialogOpen(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Executions Tab */}
          <TabsContent value="executions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Executions</CardTitle>
                    <CardDescription>Recently completed order executions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Execution ID</th>
                        <th className="p-3 text-left font-medium">Symbol</th>
                        <th className="p-3 text-left font-medium">Side</th>
                        <th className="p-3 text-left font-medium">Quantity</th>
                        <th className="p-3 text-left font-medium">Price</th>
                        <th className="p-3 text-left font-medium">Venue</th>
                        <th className="p-3 text-left font-medium">Latency</th>
                        <th className="p-3 text-left font-medium">Commission</th>
                        <th className="p-3 text-left font-medium">Time</th>
                        <th className="p-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentExecutions.map((exec) => (
                        <tr key={exec.id} className="border-b">
                          <td className="p-3 text-sm font-medium">{exec.orderId}</td>
                          <td className="p-3 font-medium">{exec.symbol}</td>
                          <td className="p-3">
                            <Badge variant={exec.side === "buy" ? "default" : "destructive"}>
                              {exec.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{exec.quantity}</td>
                          <td className="p-3 text-sm">${exec.price.toLocaleString()}</td>
                          <td className="p-3 text-sm">{exec.venue}</td>
                          <td className="p-3 text-sm">{exec.latency}ms</td>
                          <td className="p-3 text-sm">${exec.commission.toFixed(2)}</td>
                          <td className="p-3 text-sm">{exec.executionTime.toLocaleTimeString()}</td>
                          <td className="p-3">{getStatusBadge(exec.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venue Connections Tab */}
          <TabsContent value="venues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Venue Connections</CardTitle>
                <CardDescription>Status and performance of connected trading venues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venueConnections.map((venue) => (
                    <Card key={venue.venue}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(venue.status)}
                            <div>
                              <p className="font-semibold text-lg">{venue.venue}</p>
                              <p className="text-sm text-muted-foreground capitalize">{venue.status}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                            {venue.status === "disconnected" && (
                              <Button size="sm">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Orders Today</p>
                            <p className="font-medium mt-1">{venue.ordersToday}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Fill Rate</p>
                            <p className="font-medium mt-1 text-green-500">{venue.fillRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Avg Latency</p>
                            <p className="font-medium mt-1">{venue.avgLatency ? `${venue.avgLatency}ms` : "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Error Rate</p>
                            <p className="font-medium mt-1 text-red-500">{venue.errorRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Queue Depth</p>
                            <p className="font-medium mt-1">{venue.queueDepth}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Quality Tab */}
          <TabsContent value="quality" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{executionQuality.fillRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {executionQuality.filledOrders}/{executionQuality.totalOrders} filled
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Fill Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{executionQuality.avgFillTime}s</div>
                  <p className="text-xs text-green-500">-0.02s improvement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Slippage</CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{executionQuality.avgSlippage}%</div>
                  <p className="text-xs text-muted-foreground">Within tolerance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Execution</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{executionQuality.bestExecution}%</div>
                  <p className="text-xs text-muted-foreground">NBBO compliance</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Execution Quality Breakdown</CardTitle>
                <CardDescription>Detailed execution statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold mt-1">{executionQuality.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Filled Orders</p>
                    <p className="text-2xl font-bold mt-1 text-green-500">{executionQuality.filledOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cancelled Orders</p>
                    <p className="text-2xl font-bold mt-1 text-yellow-500">{executionQuality.cancelledOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected Orders</p>
                    <p className="text-2xl font-bold mt-1 text-red-500">{executionQuality.rejectedOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Engine Controls</CardTitle>
                <CardDescription>Configure execution engine behavior and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Enable Execution Engine</p>
                    <p className="text-sm text-muted-foreground">Allow order submission and execution</p>
                  </div>
                  <Switch checked={executionEnabled} onCheckedChange={handleToggleExecution} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Order Throttling</p>
                    <p className="text-sm text-muted-foreground">Limit order submission rate</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={executionStatus.throttleEnabled}
                      onCheckedChange={() => setIsThrottleDialogOpen(true)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsThrottleDialogOpen(true)}
                    >
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Auto-Cancel Stale Orders</p>
                    <p className="text-sm text-muted-foreground">Cancel orders older than 5 minutes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Smart Order Routing</p>
                    <p className="text-sm text-muted-foreground">Route orders to best venue automatically</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Pre-Trade Risk Checks</p>
                    <p className="text-sm text-muted-foreground">Validate orders against risk limits before submission</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Post-Trade Reporting</p>
                    <p className="text-sm text-muted-foreground">Generate execution reports automatically</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Controls</CardTitle>
                <CardDescription>Critical execution controls for emergency situations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" className="w-full" onClick={handleCancelAllOrders}>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Cancel All Active Orders
                </Button>
                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Stop - Halt All Trading
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reconnect All Venues
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Complete order information</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Order ID</Label>
                    <p className="font-medium">{selectedOrder.clientOrderId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Symbol</Label>
                    <p className="font-medium">{selectedOrder.symbol}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Side</Label>
                    <p className="font-medium capitalize">{selectedOrder.side}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Quantity</Label>
                    <p className="font-medium">{selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Filled</Label>
                    <p className="font-medium">{selectedOrder.filledQuantity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Price</Label>
                    <p className="font-medium">
                      {selectedOrder.price ? `$${selectedOrder.price.toLocaleString()}` : "Market"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Venue</Label>
                    <p className="font-medium">{selectedOrder.venue}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                Close
              </Button>
              <Button variant="destructive" onClick={() => {
                if (selectedOrder) handleCancelOrder(selectedOrder.id);
                setIsOrderDialogOpen(false);
              }}>
                Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Throttle Configuration Dialog */}
        <Dialog open={isThrottleDialogOpen} onOpenChange={setIsThrottleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure Order Throttling</DialogTitle>
              <DialogDescription>Set maximum order submission rate</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Maximum Orders Per Second</Label>
                <Input type="number" defaultValue={executionStatus.throttleRate} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <Label>Enable Throttling</Label>
                <Switch defaultChecked={executionStatus.throttleEnabled} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsThrottleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsThrottleDialogOpen(false)}>
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

