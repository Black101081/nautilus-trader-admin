import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Activity, BarChart3, Code2, Rocket, TrendingUp, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: versionData } = trpc.nautilus.version.useQuery();
  const { data: systemInfo } = trpc.nautilus.systemInfo.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NautilusTrader</h1>
                <p className="text-xs text-muted-foreground">Demo Interface</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/demo">
                <Button variant="default">
                  <Rocket className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline">Documentation</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {versionData && typeof versionData === 'object' && 'success' in versionData && versionData.success && 'version' in versionData && (
              <Badge variant="secondary" className="mb-4">
                v{String(versionData.version)}
              </Badge>
            )}
            {(!versionData || typeof versionData !== 'object' || !('success' in versionData) || !versionData.success) && (
              <Badge variant="secondary" className="mb-4">Loading...</Badge>
            )}
            <h2 className="text-5xl font-bold tracking-tight">
              High-Performance
              <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Algorithmic Trading
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              NautilusTrader is an open-source, high-performance algorithmic trading platform built with Rust and Python. 
              Backtest strategies with precision and deploy them to live markets seamlessly.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/demo">
                <Button size="lg" className="gap-2">
                  <Zap className="w-5 h-5" />
                  Run Live Demo
                </Button>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/nautechsystems/nautilus_trader" target="_blank" rel="noopener noreferrer">
                  <Code2 className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3">Core Features</h3>
            <p className="text-muted-foreground">Everything you need for professional algorithmic trading</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>High Performance</CardTitle>
                <CardDescription>
                  Core engine written in Rust for maximum speed and efficiency
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Event-Driven Backtesting</CardTitle>
                <CardDescription>
                  Test strategies on historical data with realistic market simulation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>Multi-Asset Support</CardTitle>
                <CardDescription>
                  Trade FX, Crypto, Equities, Futures, and more on a single platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Python-Native</CardTitle>
                <CardDescription>
                  Write strategies in Python while enjoying Rust-level performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Live Trading Ready</CardTitle>
                <CardDescription>
                  Deploy backtested strategies to live markets without code changes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>Rich Indicators</CardTitle>
                <CardDescription>
                  100+ built-in technical indicators and easy custom indicator creation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* System Info */}
      {systemInfo && typeof systemInfo === 'object' && 'success' in systemInfo && systemInfo.success && (
        <section className="py-16">
          <div className="container">
            <Card className="max-w-2xl mx-auto border-border/50">
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Current installation details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">NautilusTrader Version</p>
                    <p className="font-mono text-lg">{typeof systemInfo === 'object' && systemInfo && 'nautilus_version' in systemInfo ? String(systemInfo.nautilus_version) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Python Version</p>
                    <p className="font-mono text-lg">{typeof systemInfo === 'object' && systemInfo && 'python_version' in systemInfo ? String(systemInfo.python_version) : 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Platform</p>
                    <p className="font-mono text-sm">{typeof systemInfo === 'object' && systemInfo && 'platform' in systemInfo ? String(systemInfo.platform) : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground">
              Try our interactive demo to see NautilusTrader in action
            </p>
            <Link href="/demo">
              <Button size="lg" className="gap-2">
                <Rocket className="w-5 h-5" />
                Launch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 NautilusTrader. Open source under LGPL v3.0
            </p>
            <div className="flex gap-6">
              <a href="https://nautilustrader.io" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Official Website
              </a>
              <a href="https://github.com/nautechsystems/nautilus_trader" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="https://nautilustrader.io/docs" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

