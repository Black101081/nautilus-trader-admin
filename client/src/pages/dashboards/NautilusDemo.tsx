import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, DollarSign, TrendingUp, TrendingDown, RefreshCw, 
  Zap, PlayCircle, StopCircle, Server, BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { nautilusApi, SystemStatus, StrategyInfo, OrderInfo, PositionInfo } from "@/lib/nautilus-client";

export default function NautilusDemo() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [strategies, setStrategies] = useState<StrategyInfo[]>([]);
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [statusData, strategiesData, ordersData, positionsData] = await Promise.all([
        nautilusApi.getSystemStatus(),
        nautilusApi.getStrategies(),
        nautilusApi.getOrders(),
        nautilusApi.getPositions(),
      ]);

      setSystemStatus(statusData);
      setStrategies(strategiesData);
      setOrders(ordersData);
      setPositions(positionsData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching Nautilus data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Setup WebSocket connection
  useEffect(() => {
    const ws = nautilusApi.createWebSocket(
      (data) => {
        console.log("WebSocket message:", data);
        if (data.type === "connection") {
          setWsConnected(true);
        }
      },
      (error) => {
        console.error("WebSocket error:", error);
        setWsConnected(false);
      },
      (event) => {
        console.log("WebSocket closed:", event);
        setWsConnected(false);
      }
    );

    return () => {
      ws.close();
    };
  }, []);

  // Initial data fetch and auto-refresh
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const totalPnL = strategies.reduce((sum, s) => sum + s.pnl, 0);
  const runningStrategies = strategies.filter(s => s.status === "RUNNING").length;
  const totalOrders = orders.length;
  const filledOrders = orders.filter(o => o.status === "FILLED").length;
  const openPositions = positions.length;
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealized_pnl, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-500" />
              Nautilus Trader Integration Demo
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time data from Nautilus FastAPI Bridge
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={wsConnected ? "default" : "secondary"} className="gap-2">
              <div className={`h-2 w-2 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
              WebSocket {wsConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* System Status */}
      {systemStatus && (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Nautilus Trader Core Information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">
                  <Badge variant={systemStatus.status === "running" ? "default" : "secondary"}>
                    {systemStatus.status.toUpperCase()}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trader ID</p>
                <p className="text-lg font-semibold">{systemStatus.trader_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-lg font-semibold">{systemStatus.uptime.toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="text-lg font-semibold">{lastUpdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">From {strategies.length} strategies</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningStrategies}</div>
            <p className="text-xs text-muted-foreground">of {strategies.length} total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{filledOrders} filled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openPositions}</div>
            <p className={`text-xs ${totalUnrealizedPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${totalUnrealizedPnL.toFixed(2)} unrealized
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="strategies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strategies">Strategies ({strategies.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="positions">Positions ({positions.length})</TabsTrigger>
        </TabsList>

        {/* Strategies Tab */}
        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle>Active Strategies</CardTitle>
              <CardDescription>Deployed trading strategies</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : strategies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No strategies deployed</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Positions</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategies.map((strategy) => (
                      <TableRow key={strategy.id}>
                        <TableCell className="font-medium">{strategy.name}</TableCell>
                        <TableCell>
                          <Badge variant={strategy.status === "RUNNING" ? "default" : "secondary"}>
                            {strategy.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{strategy.orders_count}</TableCell>
                        <TableCell className="text-right">{strategy.positions_count}</TableCell>
                        <TableCell className={`text-right font-semibold ${strategy.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                          ${strategy.pnl.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {strategy.status === "RUNNING" ? (
                            <Button size="sm" variant="outline">
                              <StopCircle className="h-4 w-4 mr-1" />
                              Stop
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Order execution history</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No orders</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instrument</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.instrument_id}</TableCell>
                        <TableCell>
                          <Badge variant={order.side === "BUY" ? "default" : "secondary"}>
                            {order.side}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.type}</TableCell>
                        <TableCell className="text-right">{order.quantity}</TableCell>
                        <TableCell className="text-right">
                          {order.avg_px ? `$${order.avg_px.toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === "FILLED" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>Current market exposure</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : positions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No open positions</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instrument</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Avg Price</TableHead>
                      <TableHead className="text-right">Unrealized P&L</TableHead>
                      <TableHead className="text-right">Realized P&L</TableHead>
                      <TableHead>Opened</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.instrument_id}</TableCell>
                        <TableCell>
                          <Badge variant={position.side === "LONG" ? "default" : "secondary"}>
                            {position.side}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{position.quantity}</TableCell>
                        <TableCell className="text-right">${position.avg_px.toFixed(2)}</TableCell>
                        <TableCell className={`text-right font-semibold ${position.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                          ${position.unrealized_pnl.toFixed(2)}
                        </TableCell>
                        <TableCell className={`text-right ${position.realized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                          ${position.realized_pnl.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(position.opened_at).toLocaleTimeString()}
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
    </div>
  );
}

