import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function TraderDashboard() {
  const { data: positions } = trpc.trading.positions.useQuery();
  const { data: liveTrades } = trpc.trading.liveTrades.useQuery();
  const { data: riskLimits } = trpc.risk.limits.useQuery();
  const { data: metrics } = trpc.analytics.metrics.useQuery({});

  // Calculate summary stats
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Trader Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/strategies">
              <Button variant="outline">Strategy Builder</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Performance Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openPositions}</div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
              {totalUnrealizedPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalUnrealizedPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                ${totalUnrealizedPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From open positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrades}</div>
              <p className="text-xs text-muted-foreground">{closedTrades.length} closed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realized P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                ${totalPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From closed trades</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>Your current market positions</CardDescription>
              </CardHeader>
              <CardContent>
                {!positions || positions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No open positions
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Avg Price</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Unrealized P&L</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positions.map((position) => {
                        const pnl = parseFloat(position.unrealizedPnl || "0");
                        return (
                          <TableRow key={position.id}>
                            <TableCell className="font-medium">{position.symbol}</TableCell>
                            <TableCell>{position.quantity}</TableCell>
                            <TableCell>${position.avgPrice}</TableCell>
                            <TableCell>${position.currentPrice || "N/A"}</TableCell>
                            <TableCell className={pnl >= 0 ? "text-green-500" : "text-red-500"}>
                              ${pnl.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {position.updatedAt
                                ? new Date(position.updatedAt).toLocaleString()
                                : "N/A"}
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

          {/* Trades Tab */}
          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Your latest trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTrades.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No trades yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Entry Price</TableHead>
                        <TableHead>Exit Price</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTrades.map((trade) => {
                        const pnl = parseFloat(trade.pnl || "0");
                        return (
                          <TableRow key={trade.id}>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge variant={trade.side === "buy" ? "default" : "secondary"}>
                                {trade.side}
                              </Badge>
                            </TableCell>
                            <TableCell>{trade.quantity}</TableCell>
                            <TableCell>${trade.entryPrice}</TableCell>
                            <TableCell>{trade.exitPrice ? `$${trade.exitPrice}` : "-"}</TableCell>
                            <TableCell className={pnl >= 0 ? "text-green-500" : "text-red-500"}>
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
                            <TableCell>
                              {trade.entryTime
                                ? new Date(trade.entryTime).toLocaleString()
                                : "N/A"}
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

          {/* Risk Management Tab */}
          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Limits</CardTitle>
                <CardDescription>Configure your risk management parameters</CardDescription>
              </CardHeader>
              <CardContent>
                {!riskLimits || riskLimits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No risk limits configured
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riskLimits.map((limit) => (
                        <TableRow key={limit.id}>
                          <TableCell className="font-medium capitalize">
                            {limit.type.replace("_", " ")}
                          </TableCell>
                          <TableCell>{limit.value}</TableCell>
                          <TableCell>
                            <Badge variant={limit.enabled === "yes" ? "default" : "secondary"}>
                              {limit.enabled === "yes" ? "Active" : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {limit.createdAt
                              ? new Date(limit.createdAt).toLocaleString()
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Analyze your trading performance</CardDescription>
              </CardHeader>
              <CardContent>
                {!metrics || metrics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No performance data available yet
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {metrics.map((metric) => (
                      <Card key={metric.id}>
                        <CardHeader>
                          <CardTitle className="text-sm capitalize">{metric.period} Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Return:</span>
                            <span className="text-sm font-medium">{metric.totalReturn || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Sharpe Ratio:</span>
                            <span className="text-sm font-medium">{metric.sharpeRatio || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Max Drawdown:</span>
                            <span className="text-sm font-medium">{metric.maxDrawdown || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Win Rate:</span>
                            <span className="text-sm font-medium">{metric.winRate || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Trades:</span>
                            <span className="text-sm font-medium">{metric.totalTrades || "0"}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

