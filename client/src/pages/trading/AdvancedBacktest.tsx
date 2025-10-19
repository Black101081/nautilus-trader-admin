import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Home, Play, Settings, TrendingUp, BarChart3, 
  Calendar, Target, Zap, AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function AdvancedBacktest() {
  const [strategyId, setStrategyId] = useState("");
  const [symbol, setSymbol] = useState("EURUSD");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");
  const [backtestType, setBacktestType] = useState("standard");
  const [walkForwardPeriods, setWalkForwardPeriods] = useState("6");
  const [optimizationMetric, setOptimizationMetric] = useState("sharpe");

  const { data: strategies } = trpc.strategies.list.useQuery();
  const runBacktest = trpc.backtests.run.useMutation();

  const handleRunBacktest = async () => {
    if (!strategyId) {
      alert("Please select a strategy");
      return;
    }

    try {
      await runBacktest.mutateAsync({
        strategyId,
        instrument: symbol,
        strategyName: strategies?.find(s => s.id === strategyId)?.name || "Strategy",
        startingBalance: "100000",
      });
      alert("Backtest started successfully!");
    } catch (error) {
      console.error("Backtest error:", error);
      alert("Failed to start backtest");
    }
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
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <h1 className="text-sm font-bold">Advanced Backtesting</h1>
                <p className="text-xs text-muted-foreground">Walk-Forward & Optimization</p>
              </div>
            </div>
          </div>
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Results
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backtest Configuration</CardTitle>
                <CardDescription>Configure your advanced backtest parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Setup</TabsTrigger>
                    <TabsTrigger value="walkforward">Walk-Forward</TabsTrigger>
                    <TabsTrigger value="optimization">Optimization</TabsTrigger>
                  </TabsList>

                  {/* Basic Setup Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="strategy">Strategy</Label>
                        <Select value={strategyId} onValueChange={setStrategyId}>
                          <SelectTrigger id="strategy">
                            <SelectValue placeholder="Select a strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            {strategies?.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="symbol">Trading Symbol</Label>
                        <Select value={symbol} onValueChange={setSymbol}>
                          <SelectTrigger id="symbol">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EURUSD">EUR/USD</SelectItem>
                            <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                            <SelectItem value="USDJPY">USD/JPY</SelectItem>
                            <SelectItem value="AUDUSD">AUD/USD</SelectItem>
                            <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="initialBalance">Initial Balance (USD)</Label>
                        <Input
                          id="initialBalance"
                          type="number"
                          defaultValue="100000"
                          placeholder="100000"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Walk-Forward Tab */}
                  <TabsContent value="walkforward" className="space-y-4">
                    <div className="rounded-lg border border-border/50 bg-muted/50 p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Walk-Forward Analysis</p>
                          <p className="text-xs text-muted-foreground">
                            Divides historical data into training and testing periods to simulate real-world trading conditions and reduce overfitting.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wfPeriods">Number of Periods</Label>
                        <Select value={walkForwardPeriods} onValueChange={setWalkForwardPeriods}>
                          <SelectTrigger id="wfPeriods">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Periods</SelectItem>
                            <SelectItem value="6">6 Periods</SelectItem>
                            <SelectItem value="12">12 Periods</SelectItem>
                            <SelectItem value="24">24 Periods</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          More periods = more robust but slower
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trainRatio">Training/Testing Ratio</Label>
                        <Select defaultValue="70">
                          <SelectTrigger id="trainRatio">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">60% Train / 40% Test</SelectItem>
                            <SelectItem value="70">70% Train / 30% Test</SelectItem>
                            <SelectItem value="80">80% Train / 20% Test</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <p className="text-sm font-medium">Estimated Timeline</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground">Training Windows</p>
                            <p className="font-mono font-bold">{walkForwardPeriods}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Duration</p>
                            <p className="font-mono font-bold">~{parseInt(walkForwardPeriods) * 2} months</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Optimization Tab */}
                  <TabsContent value="optimization" className="space-y-4">
                    <div className="rounded-lg border border-border/50 bg-muted/50 p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Parameter Optimization</p>
                          <p className="text-xs text-muted-foreground">
                            Automatically find the best parameter combinations for your strategy using grid search or genetic algorithms.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="optMetric">Optimization Metric</Label>
                        <Select value={optimizationMetric} onValueChange={setOptimizationMetric}>
                          <SelectTrigger id="optMetric">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                            <SelectItem value="sortino">Sortino Ratio</SelectItem>
                            <SelectItem value="profit">Total Profit</SelectItem>
                            <SelectItem value="winrate">Win Rate</SelectItem>
                            <SelectItem value="maxdd">Min Drawdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="optMethod">Optimization Method</Label>
                        <Select defaultValue="grid">
                          <SelectTrigger id="optMethod">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid Search</SelectItem>
                            <SelectItem value="random">Random Search</SelectItem>
                            <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                            <SelectItem value="bayesian">Bayesian Optimization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxIterations">Max Iterations</Label>
                        <Input
                          id="maxIterations"
                          type="number"
                          defaultValue="100"
                          placeholder="100"
                        />
                        <p className="text-xs text-muted-foreground">
                          Higher values = better results but longer runtime
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    onClick={handleRunBacktest} 
                    disabled={runBacktest.isPending || !strategyId}
                    className="w-full"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {runBacktest.isPending ? "Running Backtest..." : "Run Advanced Backtest"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  Backtest Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Standard</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Traditional backtest on historical data. Fast and simple.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Walk-Forward</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Divides data into training/testing periods. More realistic results.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500">Optimization</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Finds best parameters automatically. Requires more computation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Sharpe Ratio</p>
                  <p className="text-xs text-muted-foreground">Risk-adjusted returns</p>
                </div>
                <div>
                  <p className="font-medium">Max Drawdown</p>
                  <p className="text-xs text-muted-foreground">Largest peak-to-trough decline</p>
                </div>
                <div>
                  <p className="font-medium">Win Rate</p>
                  <p className="text-xs text-muted-foreground">Percentage of profitable trades</p>
                </div>
                <div>
                  <p className="font-medium">Profit Factor</p>
                  <p className="text-xs text-muted-foreground">Gross profit / Gross loss</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

