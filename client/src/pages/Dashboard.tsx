import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function Dashboard() {
  const { data: backtests } = trpc.backtests.list.useQuery();
  const { data: strategies } = trpc.strategies.list.useQuery();

  // Mock data for demo
  const portfolioValue = 125430.50;
  const todayPnL = 2345.67;
  const todayPnLPercent = 1.91;
  const activeStrategies = strategies?.length || 0;
  const openPositions = 5;

  const metrics = [
    {
      title: "Portfolio Value",
      value: `$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+12.4%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Today's P&L",
      value: `$${todayPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `+${todayPnLPercent}%`,
      trend: "up",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Strategies",
      value: activeStrategies.toString(),
      change: "3 running",
      trend: "neutral",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Open Positions",
      value: openPositions.toString(),
      change: "2 profitable",
      trend: "up",
      icon: Target,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const recentTrades = [
    { symbol: "EURUSD", side: "BUY", qty: 10000, price: 1.0845, pnl: 145.50, time: "10:23:15" },
    { symbol: "GBPUSD", side: "SELL", qty: 5000, price: 1.2634, pnl: -32.20, time: "10:15:42" },
    { symbol: "USDJPY", side: "BUY", qty: 8000, price: 149.85, pnl: 89.30, time: "09:58:21" },
    { symbol: "AUDUSD", side: "SELL", qty: 6000, price: 0.6523, pnl: 56.80, time: "09:42:10" },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Trader</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              Market Open
            </Badge>
            <Badge variant="outline">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        {metric.trend === "up" && (
                          <span className="flex items-center text-sm font-medium text-green-500">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {metric.change}
                          </span>
                        )}
                        {metric.trend === "down" && (
                          <span className="flex items-center text-sm font-medium text-red-500">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            {metric.change}
                          </span>
                        )}
                        {metric.trend === "neutral" && (
                          <span className="text-sm text-muted-foreground">
                            {metric.change}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 ${metric.bgColor}`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Portfolio Chart Placeholder */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Portfolio Equity Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border/40">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Chart visualization will be implemented
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Using lightweight-charts library
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Strategies */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Active Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strategies && strategies.length > 0 ? (
                  strategies.slice(0, 5).map((strategy) => (
                    <div
                      key={strategy.id}
                      className="flex items-center justify-between rounded-lg border border-border/40 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                          <Zap className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">{strategy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {strategy.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Activity className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border/40">
                    <div className="text-center">
                      <Zap className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No active strategies
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Symbol</th>
                    <th className="pb-3 font-medium">Side</th>
                    <th className="pb-3 font-medium">Quantity</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade, idx) => (
                    <tr key={idx} className="border-b border-border/40 last:border-0">
                      <td className="py-3 text-sm font-mono">{trade.time}</td>
                      <td className="py-3 text-sm font-medium">{trade.symbol}</td>
                      <td className="py-3">
                        <Badge
                          variant={trade.side === "BUY" ? "default" : "secondary"}
                          className={
                            trade.side === "BUY"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }
                        >
                          {trade.side}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm font-mono">{trade.qty.toLocaleString()}</td>
                      <td className="py-3 text-sm font-mono">{trade.price.toFixed(4)}</td>
                      <td
                        className={`py-3 text-right text-sm font-mono font-medium ${
                          trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

