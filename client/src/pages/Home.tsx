import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Activity, BarChart3, Code2, Rocket, TrendingUp, Zap, Database } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: versionData } = trpc.nautilus.version.useQuery();
  const { data: systemInfo } = trpc.nautilus.systemInfo.useQuery();

  const version = versionData && typeof versionData === 'object' && 'version' in versionData 
    ? String(versionData.version) 
    : 'Loading...';
    
  const indicators = systemInfo && typeof systemInfo === 'object' && 'indicators' in systemInfo
    ? String(systemInfo.indicators)
    : 'Loading...';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">NautilusTrader</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost">Demo</Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost">Docs</Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost">Reports</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              v{version}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              High-Performance <span className="text-primary">Algorithmic Trading</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              NautilusTrader is an open-source, high-performance algorithmic trading platform built with Rust and Python. 
              Backtest strategies with precision and deploy them to live markets seamlessly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link href="/demo">
            <Button size="lg" className="gap-2">
              <Zap className="h-5 w-5" />
              Run Demo
            </Button>
          </Link>
          <Link href="/trader">
            <Button size="lg" variant="default" className="gap-2">
              <BarChart3 className="h-5 w-5" />
              Trader Dashboard
            </Button>
          </Link>
          <Link href="/strategies">
            <Button size="lg" variant="outline" className="gap-2">
              <Code2 className="h-5 w-5" />
              Build Strategy
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="lg" variant="outline" className="gap-2">
              Admin Panel
            </Button>
          </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-accent/5">
        <div className="container">
          <h3 className="text-3xl font-bold text-center mb-12">Core Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>High Performance</CardTitle>
                <CardDescription>
                  Rust-powered core for microsecond-level latency and maximum throughput
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built from the ground up with performance in mind, leveraging Rust's zero-cost abstractions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Comprehensive Backtesting</CardTitle>
                <CardDescription>
                  Event-driven backtesting with tick-level precision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Test strategies against historical data with realistic market simulation and slippage modeling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>{indicators} Indicators</CardTitle>
                <CardDescription>
                  Extensive library of technical indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From simple moving averages to complex statistical indicators, all optimized for performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <h3 className="text-3xl font-bold">Ready to Start Trading?</h3>
                <p className="text-muted-foreground">
                  Explore the demo, build your first strategy, or dive into the documentation.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Link href="/demo">
                    <Button size="lg">Try Demo</Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" variant="outline">Read Docs</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with NautilusTrader v{version}</p>
          <p className="mt-2">
            Open source algorithmic trading platform
          </p>
        </div>
      </footer>
    </div>
  );
}

