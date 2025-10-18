import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, RefreshCw, Play, Pause, Square, AlertTriangle,
  TrendingUp, Activity, DollarSign, Clock
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function LiveTrading() {
  const { data: strategies, refetch: refetchStrategies } = trpc.strategies.list.useQuery();
  const { data: liveTrades, refetch: refetchTrades } = trpc.trading.liveTrades.useQuery();
  const { data: positions, refetch: refetchPositions } = trpc.trading.positions.useQuery();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  // Calculate metrics
  const activeStrategies = strategies?.filter(s => (s as any).status === "active").length || 0;
  const totalPositions = positions?.length || 0;
  const totalPnL = positions?.reduce((sum, p) => sum + parseFloat(p.unrealizedPnl || "0"), 0) || 0;

  const refetchAll = () => {
    refetchStrategies();
    refetchTrades();
    refetchPositions();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Activity className="h-5 w-5 text-green-500 animate-pulse" />
              <div>
                <h1 className="text-sm font-bold">Live Trading</h1>
                <p className="text-xs text-muted-foreground">Real-time Strategy Execution</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="gap-1 animate-pulse">
              <Activity className="h-3 w-3" />
              {activeStrategies} Active
            </Badge>
            <Button variant="outline" size="sm" onClick={refetchAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Live Trading Overview */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Live Trading Overview</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                <Play className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{activeStrategies}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently executing
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{totalPositions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active market exposure
                </p>
              </CardContent>
            </Card>

            <Card className={`border-l-4 ${totalPnL >= 0 ? "border-l-green-500" : "border-l-red-500"}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
                <DollarSign className={`h-4 w-4 ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${totalPnL.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current session
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Trades</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">{liveTrades?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Executed orders
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="strategies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="strategies">Strategy Control</TabsTrigger>
            <TabsTrigger value="positions">Live Positions</TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
          </TabsList>

          {/* Strategy Control Tab */}
          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Strategy Management</CardTitle>
                    <CardDescription>Start, stop, and monitor your trading strategies</CardDescription>
                  </div>
                  <Link href="/strategies">
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Deploy New Strategy
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {!strategies || strategies.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Strategies Available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a strategy first before starting live trading
                    </p>
                    <Link href="/strategies">
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        Create Strategy
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Strategy Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Positions</TableHead>
                        <TableHead className="text-right">Today's P&L</TableHead>
                        <TableHead className="text-right">Uptime</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {strategies.map((strategy) => {
                        const strategyPositions = positions?.filter(p => p.strategyId === strategy.id) || [];
                        const strategyPnL = strategyPositions.reduce((sum, p) => 
                          sum + parseFloat(p.unrealizedPnl || "0"), 0
                        );
                        
                        return (
                          <TableRow key={strategy.id}>
                            <TableCell>
                              <div className="font-medium">{strategy.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {strategy.description || "No description"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  (strategy as any).status === "active"
                                    ? "default"
                                    : (strategy as any).status === "paused"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="gap-1"
                              >
                                {(strategy as any).status === "active" && <Activity className="h-3 w-3 animate-pulse" />}
                                {(strategy as any).status === "paused" && <Pause className="h-3 w-3" />}
                                {(strategy as any).status === "stopped" && <Square className="h-3 w-3" />}
                                {(strategy as any).status || "inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {strategyPositions.length}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${strategyPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                              ${strategyPnL.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {(strategy as any).status === "active" ? "Running" : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                {(strategy as any).status === "active" ? (
                                  <>
                                    <Button variant="outline" size="sm">
                                      <Pause className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                      <Square className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button variant="default" size="sm">
                                    <Play className="h-4 w-4 mr-1" />
                                    Start
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Positions</CardTitle>
                <CardDescription>Monitor your current market exposure in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                {!positions || positions.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No open positions</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Strategy</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Avg Price</TableHead>
                        <TableHead className="text-right">Current Price</TableHead>
                        <TableHead className="text-right">Unrealized P&L</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positions.map((position) => {
                        const pnl = parseFloat(position.unrealizedPnl || "0");
                        const avgPrice = parseFloat(position.avgPrice);
                        const currentPrice = parseFloat(position.currentPrice || position.avgPrice);
                        
                        return (
                          <TableRow key={position.id}>
                            <TableCell className="font-bold">{position.symbol}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {position.strategyId?.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="text-right font-mono">{position.quantity}</TableCell>
                            <TableCell className="text-right font-mono">${avgPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono">${currentPrice.toFixed(2)}</TableCell>
                            <TableCell className={`text-right font-bold ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                              ${pnl.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="destructive" size="sm">
                                Close
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Management Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage pending orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No pending orders</p>
                  <p className="text-sm mt-2">Orders will appear here when strategies place them</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

