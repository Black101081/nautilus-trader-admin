import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Code2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Docs() {
  const { data: indicators } = trpc.nautilus.listIndicators.useQuery();

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
            <h1 className="text-xl font-bold">Documentation</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                About NautilusTrader
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">
                NautilusTrader is a high-performance, open-source algorithmic trading platform designed for quantitative traders. 
                Built with a Rust core and Python bindings, it provides the perfect balance between performance and ease of use.
              </p>
              <p className="text-muted-foreground mt-4">
                The platform supports backtesting strategies on historical data with an event-driven engine, and can seamlessly 
                deploy those same strategies to live trading without code changes.
              </p>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">High Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Core engine written in Rust for maximum speed and efficiency, with Python bindings for ease of use
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Event-Driven Architecture</h4>
                    <p className="text-sm text-muted-foreground">
                      Realistic backtesting with event-driven simulation that mirrors live trading behavior
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Multi-Asset Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Trade FX, Crypto, Equities, Futures, Options, and more on a single unified platform
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-semibold mb-1">Extensive Integrations</h4>
                    <p className="text-sm text-muted-foreground">
                      Built-in adapters for Binance, Interactive Brokers, Databento, and many more
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Indicators */}
          {indicators && typeof indicators === 'object' && 'success' in indicators && indicators.success && 'indicators' in indicators && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Available Technical Indicators</CardTitle>
                <CardDescription>
                  Built-in indicators ready to use in your trading strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {typeof indicators === 'object' && indicators && 'indicators' in indicators && (
                    <>
                      {Object.entries(indicators.indicators as Record<string, string[]>).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 text-primary">{category}</h4>
                      <ul className="space-y-2">
                        {(items as string[]).map((indicator) => (
                          <li key={indicator} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Code2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Installation */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Installation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Install via pip (recommended):</p>
                <div className="bg-card border border-border/50 rounded-lg p-4">
                  <code className="text-sm font-mono">pip install nautilus_trader</code>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Verify installation:</p>
                <div className="bg-card border border-border/50 rounded-lg p-4">
                  <code className="text-sm font-mono">
                    python -c "import nautilus_trader; print(nautilus_trader.__version__)"
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>External Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="https://nautilustrader.io/docs" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Official Documentation
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="https://github.com/nautechsystems/nautilus_trader" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Repository
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="https://discord.gg/AJHWrGk" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Discord Community
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

