import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Demo() {
  const [result, setResult] = useState<any>(null);
  const runBacktest = trpc.nautilus.runBacktest.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleRunBacktest = () => {
    setResult(null);
    runBacktest.mutate();
  };

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
            <h1 className="text-xl font-bold">Live Demo</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Demo Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Backtest Demo</CardTitle>
              <CardDescription>
                Run a simple backtest to see NautilusTrader in action. This demo creates a simulated trading environment
                with test data and executes a basic backtest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleRunBacktest}
                  disabled={runBacktest.isPending}
                  className="gap-2"
                >
                  {runBacktest.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Running Backtest...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Run Backtest
                    </>
                  )}
                </Button>
              </div>

              {/* Results */}
              {result && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-semibold">Backtest Completed Successfully</h3>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-destructive" />
                        <h3 className="text-lg font-semibold">Backtest Failed</h3>
                      </>
                    )}
                  </div>

                  {result.success ? (
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <p className="text-sm text-muted-foreground mb-1">Version</p>
                          <p className="font-mono text-lg">{result.version}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <p className="text-sm text-muted-foreground mb-1">Instrument</p>
                          <p className="font-mono text-lg">{result.instrument}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <p className="text-sm text-muted-foreground mb-1">Bars Processed</p>
                          <p className="font-mono text-lg">{result.bars_count}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <p className="text-sm text-muted-foreground mb-1">Starting Balance</p>
                          <p className="font-mono text-lg">{result.starting_balance}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                          <p className="font-mono text-lg">{result.account_type}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <p className="text-sm text-muted-foreground mb-1">Venue</p>
                          <p className="font-mono text-lg">{result.venue}</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                        <p className="font-mono text-sm">{new Date(result.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm font-mono text-destructive">{result.error}</p>
                      {result.traceback && (
                        <pre className="mt-2 text-xs overflow-auto max-h-40 text-muted-foreground">
                          {result.traceback}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">What This Demo Does</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Creates a simulated trading environment</p>
                <p>• Initializes a backtest engine with configuration</p>
                <p>• Sets up a trading venue with margin account</p>
                <p>• Loads test market data (50 bars)</p>
                <p>• Executes the backtest simulation</p>
                <p>• Returns performance metrics</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• <strong>Engine:</strong> NautilusTrader BacktestEngine</p>
                <p>• <strong>Instrument:</strong> AUD/USD FX pair</p>
                <p>• <strong>Account:</strong> Margin account, 1:1 leverage</p>
                <p>• <strong>Capital:</strong> $100,000 USD starting balance</p>
                <p>• <strong>Data:</strong> Synthetic 5-decimal bar data</p>
                <p>• <strong>Venue:</strong> Simulated exchange (SIM)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

