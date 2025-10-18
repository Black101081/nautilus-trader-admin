import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  Play,
  Pause,
  Square,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

export default function LiveTradingNew() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: strategies } = trpc.strategies.list.useQuery();

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Mock live data
  const liveStats = {
    activeStrategies: 3,
    openPositions: 5,
    unrealizedPnL: 1234.56,
    todayTrades: 12,
  };

  const activeStrategies = [
    {
      id: "1",
      name: "EMA Crossover",
      status: "running",
      symbol: "EURUSD",
      pnl: 345.67,
      trades: 5,
      uptime: "2h 34m",
    },
    {
      id: "2",
      name: "RSI Mean Reversion",
      status: "running",
      symbol: "GBPUSD",
      pnl: -123.45,
      trades: 3,
      uptime: "1h 12m",
    },
    {
      id: "3",
      name: "Breakout Scanner",
      status: "paused",
      symbol: "USDJPY",
      pnl: 567.89,
      trades: 8,
      uptime: "3h 45m",
    },
  ];

  const openPositions = [
    {
      id: "1",
      symbol: "EURUSD",
      side: "LONG",
      qty: 10000,
      entryPrice: 1.0845,
      currentPrice: 1.0867,
      pnl: 220.00,
      pnlPercent: 2.03,
    },
    {
      id: "2",
      symbol: "GBPUSD",
      side: "SHORT",
      qty: 5000,
      entryPrice: 1.2634,
      currentPrice: 1.2598,
      pnl: 180.00,
      pnlPercent: 2.85,
    },
    {
      id: "3",
      symbol: "USDJPY",
      side: "LONG",
      qty: 8000,
      entryPrice: 149.85,
      currentPrice: 149.92,
      pnl: 56.00,
      pnlPercent: 0.47,
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold">Live Trading</h1>
                <p className="text-sm text-muted-foreground">Real-time strategy execution</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1 bg-green-500/20 text-green-500">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Strategies
                  </p>
                  <p className="text-3xl font-bold">{liveStats.activeStrategies}</p>
                  <p className="text-xs text-muted-foreground">Currently executing</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Open Positions
                  </p>
                  <p className="text-3xl font-bold">{liveStats.openPositions}</p>
                  <p className="text-xs text-muted-foreground">Active market exposure</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Unrealized P&L
                  </p>
                  <p className="text-3xl font-bold text-green-500">
                    ${liveStats.unrealizedPnL.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Current session</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Today's Trades
                  </p>
                  <p className="text-3xl font-bold">{liveStats.todayTrades}</p>
                  <p className="text-xs text-muted-foreground">Executed orders</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Control */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Strategy Control Panel
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  Start All
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pause All
                </Button>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        strategy.status === "running"
                          ? "bg-green-500/10"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      <Activity
                        className={`h-6 w-6 ${
                          strategy.status === "running"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{strategy.name}</p>
                        <Badge
                          variant={strategy.status === "running" ? "default" : "secondary"}
                          className={
                            strategy.status === "running"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }
                        >
                          {strategy.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{strategy.symbol}</span>
                        <span>•</span>
                        <span>{strategy.trades} trades</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {strategy.uptime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold font-mono ${
                          strategy.pnl >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {strategy.pnl >= 0 ? "+" : ""}${strategy.pnl.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">P&L</p>
                    </div>
                    <div className="flex gap-2">
                      {strategy.status === "running" ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="destructive" size="sm">
                        <Square className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Symbol</th>
                    <th className="pb-3 font-medium">Side</th>
                    <th className="pb-3 font-medium">Quantity</th>
                    <th className="pb-3 font-medium">Entry Price</th>
                    <th className="pb-3 font-medium">Current Price</th>
                    <th className="pb-3 font-medium text-right">P&L</th>
                    <th className="pb-3 font-medium text-right">P&L %</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((position) => (
                    <tr key={position.id} className="border-b border-border/40 last:border-0">
                      <td className="py-4 text-sm font-semibold">{position.symbol}</td>
                      <td className="py-4">
                        <Badge
                          variant={position.side === "LONG" ? "default" : "secondary"}
                          className={
                            position.side === "LONG"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }
                        >
                          {position.side}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm font-mono">
                        {position.qty.toLocaleString()}
                      </td>
                      <td className="py-4 text-sm font-mono">
                        {position.entryPrice.toFixed(4)}
                      </td>
                      <td className="py-4 text-sm font-mono">
                        {position.currentPrice.toFixed(4)}
                      </td>
                      <td
                        className={`py-4 text-right text-sm font-mono font-semibold ${
                          position.pnl >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                      </td>
                      <td
                        className={`py-4 text-right text-sm font-mono font-semibold ${
                          position.pnlPercent >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {position.pnlPercent >= 0 ? "+" : ""}
                        {position.pnlPercent.toFixed(2)}%
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="destructive" size="sm">
                          Close
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Stop Warning */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-500">Emergency Stop</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use "Stop All" to immediately halt all strategies and close all positions.
                  This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" size="lg" className="gap-2">
                <Square className="h-5 w-5" />
                Emergency Stop All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

