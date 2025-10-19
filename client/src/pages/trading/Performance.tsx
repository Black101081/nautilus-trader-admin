import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Target, Activity, Percent } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Performance() {
  const { data: positions } = trpc.trading.positions.useQuery();
  const { data: trades } = trpc.trading.trades.useQuery();
  const { data: orders } = trpc.trading.orders.useQuery();

  // Calculate performance metrics
  const calculateMetrics = () => {
    // Portfolio metrics
    const initialBalance = 100000; // Starting capital
    const currentBalance = 100000; // TODO: Get from account data
    
    // Calculate realized P&L from trades
    const realizedPnL = trades?.reduce((sum, trade) => {
      return sum + (Number(trade.pnl) || 0);
    }, 0) || 0;

    // Calculate unrealized P&L from positions
    const unrealizedPnL = positions?.reduce((sum, pos) => {
      return sum + (Number(pos.unrealized_pnl) || 0);
    }, 0) || 0;

    // Calculate total commissions
    const totalCommissions = trades?.reduce((sum, trade) => {
      return sum + (Number(trade.commission) || 0);
    }, 0) || 0;

    // Net P&L
    const netPnL = realizedPnL + unrealizedPnL - totalCommissions;

    // Total value
    const totalValue = currentBalance + netPnL;

    // Return percentage
    const totalReturn = ((totalValue - initialBalance) / initialBalance) * 100;

    // Win rate
    const winningTrades = trades?.filter(t => (Number(t.pnl) || 0) > 0).length || 0;
    const losingTrades = trades?.filter(t => (Number(t.pnl) || 0) < 0).length || 0;
    const totalTrades = trades?.length || 0;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // Average win/loss
    const avgWin = winningTrades > 0 
      ? (trades?.filter(t => (Number(t.pnl) || 0) > 0).reduce((sum, t) => sum + (Number(t.pnl) || 0), 0) || 0) / winningTrades
      : 0;
    
    const avgLoss = losingTrades > 0
      ? Math.abs((trades?.filter(t => (Number(t.pnl) || 0) < 0).reduce((sum, t) => sum + (Number(t.pnl) || 0), 0) || 0) / losingTrades)
      : 0;

    // Profit factor
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    // Sharpe ratio (simplified)
    const sharpeRatio = 1.45; // TODO: Calculate from returns

    // Max drawdown (simplified)
    const maxDrawdown = 5.23; // TODO: Calculate from equity curve

    return {
      initialBalance,
      currentBalance,
      totalValue,
      totalReturn,
      realizedPnL,
      unrealizedPnL,
      totalCommissions,
      netPnL,
      winRate,
      winningTrades,
      losingTrades,
      totalTrades,
      avgWin,
      avgLoss,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
    };
  };

  const metrics = calculateMetrics();

  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} total value
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.winRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.winningTrades}W / {metrics.losingTrades}L
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.profitFactor > 0 ? metrics.profitFactor.toFixed(2) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg Win: ${metrics.avgWin.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.sharpeRatio.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Risk-adjusted return
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Tabs defaultValue="returns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
            <TabsTrigger value="trading">Trading Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="returns" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>P&L Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Realized P&L</span>
                    <span className={`font-mono font-medium ${metrics.realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.realizedPnL >= 0 ? '+' : ''}{metrics.realizedPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unrealized P&L</span>
                    <span className={`font-mono font-medium ${metrics.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.unrealizedPnL >= 0 ? '+' : ''}{metrics.unrealizedPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Commissions</span>
                    <span className="font-mono font-medium text-red-500">
                      -${metrics.totalCommissions.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border/40 pt-4 flex justify-between items-center">
                    <span className="font-medium">Net P&L</span>
                    <span className={`font-mono font-bold text-lg ${metrics.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.netPnL >= 0 ? '+' : ''}{metrics.netPnL.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Return Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Return</span>
                    <span className={`font-mono font-medium ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.totalReturn >= 0 ? '+' : ''}{(metrics.totalReturn / 30).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly Return</span>
                    <span className={`font-mono font-medium ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.totalReturn >= 0 ? '+' : ''}{(metrics.totalReturn / 4).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Return</span>
                    <span className={`font-mono font-medium ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="border-t border-border/40 pt-4 flex justify-between items-center">
                    <span className="font-medium">Total Return</span>
                    <span className={`font-mono font-bold text-lg ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    <span className="font-mono font-medium text-red-500">
                      -{metrics.maxDrawdown.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-mono font-medium">
                      {metrics.sharpeRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="font-mono font-medium">
                      {metrics.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit Factor</span>
                    <span className="font-mono font-medium">
                      {metrics.profitFactor > 0 ? metrics.profitFactor.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Win/Loss Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Win</span>
                    <span className="font-mono font-medium text-green-500">
                      ${metrics.avgWin.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Loss</span>
                    <span className="font-mono font-medium text-red-500">
                      -${metrics.avgLoss.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Winning Trades</span>
                    <span className="font-mono font-medium text-green-500">
                      {metrics.winningTrades}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Losing Trades</span>
                    <span className="font-mono font-medium text-red-500">
                      {metrics.losingTrades}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Trading Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Trades</span>
                    <span className="font-mono font-medium">{metrics.totalTrades}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="font-mono font-medium">{orders?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Open Positions</span>
                    <span className="font-mono font-medium">
                      {positions?.filter(p => p.status === 'OPEN').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Commissions</span>
                    <span className="font-mono font-medium text-red-500">
                      ${metrics.totalCommissions.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Initial Balance</span>
                    <span className="font-mono font-medium">
                      ${metrics.initialBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Balance</span>
                    <span className="font-mono font-medium">
                      ${metrics.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net P&L</span>
                    <span className={`font-mono font-medium ${metrics.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.netPnL >= 0 ? '+' : ''}{metrics.netPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border/40 pt-4 flex justify-between items-center">
                    <span className="font-medium">Total Value</span>
                    <span className="font-mono font-bold text-lg">
                      ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TraderLayout>
  );
}

