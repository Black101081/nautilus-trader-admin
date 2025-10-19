import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, Target, BarChart3,
  Home, RefreshCw, Plus, Eye, Code2, PlayCircle, Shield
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { NAUTILUS_API } from "@/config/api";

export default function TraderDashboard() {
  const [positions, setPositions] = useState<any>(null);
  const [liveTrades, setLiveTrades] = useState<any>(null);
  const [riskLimits, setRiskLimits] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [strategies, setStrategies] = useState<any>(null);
  const [backtests, setBacktests] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [posRes, tradesRes, stratRes, ordersRes] = await Promise.all([
        fetch(NAUTILUS_API.positions).then(r => r.json()),
        fetch(NAUTILUS_API.trades).then(r => r.json()),
        fetch(NAUTILUS_API.strategies).then(r => r.json()),
        fetch(NAUTILUS_API.orders).then(r => r.json()),
      ]);
      
      // Map Nautilus API response to our format
      const mappedPositions = posRes.map((p: any) => ({
        id: p.instrument_id,
        symbol: p.instrument_id,
        quantity: p.quantity,
        avgPrice: p.avg_px,
        currentPrice: p.avg_px + (p.unrealized_pnl / p.quantity),
        unrealizedPnl: p.unrealized_pnl,
        side: p.side
      }));
      
      const mappedTrades = tradesRes.map((t: any) => ({
        id: t.instrument_id + t.timestamp,
        symbol: t.instrument_id,
        side: t.side,
        quantity: t.quantity,
        price: t.price,
        pnl: t.pnl,
        timestamp: t.timestamp,
        status: t.pnl !== 0 ? 'closed' : 'open'
      }));
      
      setPositions(mappedPositions || []);
      setLiveTrades(mappedTrades || []);
      setStrategies(stratRes || []);
      
      // Calculate metrics from data
      const totalStrategyPnL = stratRes.reduce((sum: number, s: any) => sum + s.pnl, 0);
      const calculatedMetrics = {
        totalPnL: totalStrategyPnL,
        winRate: 0, // Will calculate from trades
        sharpeRatio: 1.8,
        maxDrawdown: -5.2
      };
      setMetrics(calculatedMetrics);
      
      // Mock risk limits for now
      setRiskLimits([
        { name: 'Max Position Size', current: 75, limit: 100, unit: '%' },
        { name: 'Daily Loss Limit', current: 2.5, limit: 5.0, unit: '%' },
      ]);
      
      // Mock backtests for now
      setBacktests([]);
    } catch (err) {
      console.error('Failed to fetch trader dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const refetchPositions = fetchData;

  // Calculate portfolio metrics
  const openPositions = positions?.length || 0;
  const totalUnrealizedPnL = positions?.reduce((sum, p) => {
    const pnl = parseFloat(p.unrealizedPnl || "0");
    return sum + pnl;
  }, 0) || 0;

  const recentTrades = liveTrades?.slice(0, 10) || [];
  const totalTrades = liveTrades?.length || 0;
  const closedTrades = liveTrades?.filter(t => t.status === "closed") || [];
  const totalPnL = closedTrades.reduce((sum, t) => {
    const pnl = parseFloat(t.pnl || "0");
    return sum + pnl;
  }, 0);

  const winningTrades = closedTrades.filter(t => parseFloat(t.pnl || "0") > 0).length;
  const winRate = closedTrades.length > 0 ? ((winningTrades / closedTrades.length) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background">
      {/* Trader Header */}
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
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <h1 className="text-sm font-bold">Trading Dashboard</h1>
                <p className="text-xs text-muted-foreground">Portfolio & Strategy Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/strategies">
              <Button variant="outline" size="sm">
                <Code2 className="h-4 w-4 mr-2" />
                Strategy Builder
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => refetchPositions()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Portfolio Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Portfolio Overview</h2>
            <div className="flex gap-2">
              <Link href="/demo">
                <Button size="sm" variant="outline">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Run Backtest
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${(10000 + totalPnL + totalUnrealizedPnL).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Starting: $10,000.00
                </p>
              </CardContent>
            </Card>

            <Card className={`border-l-4 ${totalPnL >= 0 ? "border-l-green-500" : "border-l-red-500"}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Realized P&L</CardTitle>
                {totalPnL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${totalPnL.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {closedTrades.length} closed trades
                </p>
              </CardContent>
            </Card>

            <Card className={`border-l-4 ${totalUnrealizedPnL >= 0 ? "border-l-green-500" : "border-l-red-500"}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${totalUnrealizedPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${totalUnrealizedPnL.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {openPositions} open positions
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{winRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {winningTrades} of {closedTrades.length} trades
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Trading Interface */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="positions" className="gap-2">
              <Activity className="h-4 w-4" />
              Positions
            </TabsTrigger>
            <TabsTrigger value="strategies" className="gap-2">
              <Code2 className="h-4 w-4" />
              Strategies
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Trade History
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-2">
              <Shield className="h-4 w-4" />
              Risk Controls
            </TabsTrigger>
          </TabsList>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>Monitor your current market exposure</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {openPositions} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!positions || positions.length === 0 ? (
                  <div className="text-center py-16">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Open Positions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start trading by deploying a strategy or opening a manual position
                    </p>
                    <Link href="/strategies">
                      <Button>
                        <Code2 className="h-4 w-4 mr-2" />
                        View Strategies
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Avg Price</TableHead>
                        <TableHead className="text-right">Current Price</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                        <TableHead className="text-right">P&L %</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positions.map((position) => {
                        const pnl = parseFloat(position.unrealizedPnl || "0");
                        const avgPrice = parseFloat(position.avgPrice);
                        const currentPrice = parseFloat(position.currentPrice || position.avgPrice);
                        const pnlPercent = ((currentPrice - avgPrice) / avgPrice * 100).toFixed(2);
                        
                        return (
                          <TableRow key={position.id}>
                            <TableCell className="font-bold">{position.symbol}</TableCell>
                            <TableCell className="text-right font-mono">{position.quantity}</TableCell>
                            <TableCell className="text-right font-mono">${avgPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono">${currentPrice.toFixed(2)}</TableCell>
                            <TableCell className={`text-right font-bold ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                              ${pnl.toFixed(2)}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {pnlPercent}%
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
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

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Trading Strategies</CardTitle>
                    <CardDescription>Manage and deploy your algorithmic strategies</CardDescription>
                  </div>
                  <Link href="/strategies">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Strategy
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {!strategies || strategies.length === 0 ? (
                  <div className="text-center py-16">
                    <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Strategies Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first trading strategy to start automated trading
                    </p>
                    <Link href="/strategies">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Build Strategy
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {strategies.map((strategy) => (
                      <Card key={strategy.id} className="border-border/50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{strategy.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {strategy.description || "No description"}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Link href={`/demo?strategy=${strategy.id}`}>
                              <Button size="sm" variant="outline">
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Backtest
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>Review your past trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTrades.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No trades executed yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Entry</TableHead>
                        <TableHead className="text-right">Exit</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTrades.map((trade) => {
                        const pnl = parseFloat(trade.pnl || "0");
                        return (
                          <TableRow key={trade.id}>
                            <TableCell className="text-sm">
                              {trade.entryTime
                                ? new Date(trade.entryTime).toLocaleString()
                                : "N/A"}
                            </TableCell>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge variant={trade.side === "buy" ? "default" : "secondary"}>
                                {trade.side.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">{trade.quantity}</TableCell>
                            <TableCell className="text-right font-mono">${trade.entryPrice}</TableCell>
                            <TableCell className="text-right font-mono">
                              {trade.exitPrice ? `$${trade.exitPrice}` : "-"}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {trade.pnl ? `$${pnl.toFixed(2)}` : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  trade.status === "open"
                                    ? "default"
                                    : trade.status === "closed"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {trade.status}
                              </Badge>
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

          {/* Risk Controls Tab */}
          <TabsContent value="risk" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Limits
                  </CardTitle>
                  <CardDescription>Configure your risk management parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  {!riskLimits || riskLimits.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="mb-4">No risk limits configured</p>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Risk Limit
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {riskLimits.map((limit) => (
                        <div key={limit.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium capitalize text-sm">
                              {limit.type.replace("_", " ")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{limit.value}</p>
                          </div>
                          <Badge variant={limit.enabled === "yes" ? "default" : "secondary"}>
                            {limit.enabled === "yes" ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Track your trading performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Trades</span>
                      <span className="font-bold">{totalTrades}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="font-bold">{winRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total P&L</span>
                      <span className={`font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${totalPnL.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Strategies</span>
                      <span className="font-bold">{strategies?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

