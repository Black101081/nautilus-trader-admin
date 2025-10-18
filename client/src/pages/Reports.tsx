import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Database, BarChart3, CheckCircle2, XCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Reports() {
  const { data: backtests, isLoading } = trpc.backtests.list.useQuery();
  const { data: strategies } = trpc.strategies.list.useQuery();

  const completedBacktests = backtests?.filter(b => b.status === "completed") || [];
  const runningBacktests = backtests?.filter(b => b.status === "running") || [];
  const failedBacktests = backtests?.filter(b => b.status === "failed") || [];

  const totalTrades = completedBacktests.reduce((sum, b) => {
    return sum + (parseInt(b.totalTrades || "0") || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Backtest Reports</h1>
            <Link href="/strategies">
              <Button variant="outline" size="sm">Strategy Builder</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Backtests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{backtests?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-3xl font-bold">{completedBacktests.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saved Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-chart-3" />
                <span className="text-3xl font-bold">{strategies?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{totalTrades}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backtest History */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Backtest History</CardTitle>
            <CardDescription>
              All backtest runs with detailed results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading backtests...
              </div>
            ) : backtests && backtests.length > 0 ? (
              <div className="space-y-4">
                {backtests.map((backtest) => (
                  <div
                    key={backtest.id}
                    className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{backtest.strategyName}</h3>
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
                            {backtest.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                            {backtest.status === "failed" && <XCircle className="w-3 h-3" />}
                            {backtest.status === "running" && <Clock className="w-3 h-3 animate-spin" />}
                            {backtest.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Instrument</p>
                            <p className="font-mono">{backtest.instrument}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Starting Balance</p>
                            <p className="font-mono">{backtest.startingBalance}</p>
                          </div>
                          {backtest.endingBalance && (
                            <div>
                              <p className="text-muted-foreground">Ending Balance</p>
                              <p className="font-mono">{backtest.endingBalance}</p>
                            </div>
                          )}
                          {backtest.totalTrades && (
                            <div>
                              <p className="text-muted-foreground">Total Trades</p>
                              <p className="font-mono">{backtest.totalTrades}</p>
                            </div>
                          )}
                        </div>

                        {backtest.profitLoss && (
                          <div className="flex items-center gap-2">
                            {parseFloat(backtest.profitLoss) >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-accent" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-destructive" />
                            )}
                            <span className={parseFloat(backtest.profitLoss) >= 0 ? "text-accent" : "text-destructive"}>
                              P/L: {backtest.profitLoss}
                            </span>
                            {backtest.winRate && (
                              <span className="text-muted-foreground ml-4">
                                Win Rate: {backtest.winRate}
                              </span>
                            )}
                          </div>
                        )}

                        {backtest.error && (
                          <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                            <p className="text-sm text-destructive">{backtest.error}</p>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(backtest.createdAt!).toLocaleString()}
                          {backtest.completedAt && (
                            <> • Completed: {new Date(backtest.completedAt).toLocaleString()}</>
                          )}
                        </p>
                      </div>

                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No backtests found</p>
                <Link href="/demo">
                  <Button>Run Your First Backtest</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Stats */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-semibold">{completedBacktests.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm">Running</span>
                </div>
                <span className="font-semibold">{runningBacktests.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm">Failed</span>
                </div>
                <span className="font-semibold">{failedBacktests.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {backtests && backtests.length > 0 ? (
                <div className="space-y-2">
                  {backtests.slice(0, 5).map((backtest) => (
                    <div key={backtest.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">{backtest.strategyName}</span>
                      <Badge variant="outline" className="ml-2">
                        {backtest.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

