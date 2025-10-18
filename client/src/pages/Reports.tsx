import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { 
  Home, RefreshCw, Download, BarChart3, TrendingUp, Activity,
  CheckCircle, XCircle, Clock, Target
} from "lucide-react";

export default function Reports() {
  const { data: backtests, isLoading, refetch } = trpc.backtests.list.useQuery();
  const { data: strategies } = trpc.strategies.list.useQuery();
  const { data: systemStats } = trpc.admin.systemStats.useQuery();

  // Calculate statistics
  const totalBacktests = backtests?.length || 0;
  const completedBacktests = backtests?.filter(b => b.status === "completed").length || 0;
  const failedBacktests = backtests?.filter(b => b.status === "failed").length || 0;
  const runningBacktests = backtests?.filter(b => b.status === "running").length || 0;

  const successRate = totalBacktests > 0 
    ? ((completedBacktests / totalBacktests) * 100).toFixed(1) 
    : "0";

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
              <BarChart3 className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">Analytics & Reports</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Overview Stats */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Backtests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalBacktests}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time executions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{successRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedBacktests} completed successfully
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{strategies?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Deployed strategies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Running Now</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{runningBacktests}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active backtests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="backtests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="backtests">Backtest Results</TabsTrigger>
            <TabsTrigger value="strategies">Strategy Performance</TabsTrigger>
            <TabsTrigger value="system">System Metrics</TabsTrigger>
          </TabsList>

          {/* Backtest Results Tab */}
          <TabsContent value="backtests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backtest Execution History</CardTitle>
                <CardDescription>
                  Detailed results from all backtest runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading backtest data...</p>
                  </div>
                ) : !backtests || backtests.length === 0 ? (
                  <div className="text-center py-16">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Backtests Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Run your first backtest to see results here
                    </p>
                    <Link href="/demo">
                      <Button>
                        <Activity className="h-4 w-4 mr-2" />
                        Run Backtest
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Instrument</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Starting Balance</TableHead>
                        <TableHead className="text-right">Ending Balance</TableHead>
                        <TableHead className="text-right">Total Trades</TableHead>
                        <TableHead className="text-right">Win Rate</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backtests.map((backtest) => (
                        <TableRow key={backtest.id}>
                          <TableCell className="font-medium">
                            {backtest.strategyName}
                          </TableCell>
                          <TableCell>{backtest.instrument}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                backtest.status === "completed"
                                  ? "default"
                                  : backtest.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="gap-1"
                            >
                              {backtest.status === "completed" && <CheckCircle className="h-3 w-3" />}
                              {backtest.status === "failed" && <XCircle className="h-3 w-3" />}
                              {backtest.status === "running" && <Clock className="h-3 w-3" />}
                              {backtest.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${backtest.startingBalance}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {backtest.endingBalance ? `$${backtest.endingBalance}` : "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {backtest.totalTrades || "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {backtest.winRate || "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {backtest.createdAt
                              ? new Date(backtest.createdAt).toLocaleString()
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

          {/* Strategy Performance Tab */}
          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance Analysis</CardTitle>
                <CardDescription>
                  Compare performance across different strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!strategies || strategies.length === 0 ? (
                  <div className="text-center py-16">
                    <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Strategies Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create strategies to track their performance
                    </p>
                    <Link href="/strategies">
                      <Button>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Create Strategy
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {strategies.map((strategy) => {
                      // Get backtests for this strategy
                      const strategyBacktests = backtests?.filter(
                        b => b.strategyId === strategy.id && b.status === "completed"
                      ) || [];
                      
                      const avgWinRate = strategyBacktests.length > 0
                        ? (strategyBacktests.reduce((sum, b) => {
                            const rate = parseFloat(b.winRate || "0");
                            return sum + rate;
                          }, 0) / strategyBacktests.length).toFixed(1)
                        : "N/A";

                      return (
                        <Card key={strategy.id} className="border-border/50">
                          <CardHeader>
                            <CardTitle className="text-base">{strategy.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {strategy.description || "No description"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Backtests Run</span>
                              <span className="font-bold">{strategyBacktests.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Avg Win Rate</span>
                              <span className="font-bold">{avgWinRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <Badge variant="default">Active</Badge>
                            </div>
                            <Link href={`/demo?strategy=${strategy.id}`}>
                              <Button size="sm" className="w-full mt-2">
                                <Activity className="h-4 w-4 mr-2" />
                                Run Backtest
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Metrics Tab */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Overall system usage metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Strategies</span>
                    <span className="font-bold">{systemStats?.totalStrategies || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Backtests</span>
                    <span className="font-bold">{systemStats?.totalBacktests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Live Trades</span>
                    <span className="font-bold">{systemStats?.totalLiveTrades || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Open Positions</span>
                    <span className="font-bold">{systemStats?.openPositions || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Execution Summary</CardTitle>
                  <CardDescription>Backtest execution breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {completedBacktests}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Failed</span>
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      {failedBacktests}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Running</span>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {runningBacktests}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-bold text-green-500">{successRate}%</span>
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

