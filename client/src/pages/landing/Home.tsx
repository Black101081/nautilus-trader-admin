import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Shield, TrendingUp, Users, BarChart3, Settings, Activity, Zap, Target } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: versionData } = trpc.nautilus.version.useQuery();
  
  const version = versionData && typeof versionData === 'object' && 'version' in versionData 
    ? String(versionData.version) 
    : 'Loading...';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">NautilusTrader</h1>
              <p className="text-xs text-muted-foreground">Algorithmic Trading Platform</p>
            </div>
          </div>
          <Badge variant="outline">v{version}</Badge>
        </div>
      </header>

      <main className="container py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Welcome to Your Trading Platform</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the tools and features designed for your workflow
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Admin Card */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">System Administrator</CardTitle>
              <CardDescription className="text-base">
                Manage platform operations, monitor system health, and oversee users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>User Management & Access Control</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>System Health Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Platform Configuration</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>Analytics & Reporting</span>
                </div>
              </div>
              <Link href="/admin">
                <Button className="w-full" size="lg">
                  <Shield className="mr-2 h-5 w-5" />
                  Enter Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Trader Card */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Trader</CardTitle>
              <CardDescription className="text-base">
                Develop strategies, run backtests, and manage your trading operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>Strategy Development & Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>Live Trading Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>Performance Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Risk Management Tools</span>
                </div>
              </div>
              <Link href="/trader">
                <Button className="w-full" size="lg" variant="default">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Enter Trading Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Quick Access</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/demo">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Run Demo</h4>
                  <p className="text-sm text-muted-foreground">
                    Try a sample backtest
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/strategies">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Strategy Builder</h4>
                  <p className="text-sm text-muted-foreground">
                    Create trading strategies
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reports">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">View Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze performance
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>NautilusTrader v{version} • High-Performance Algorithmic Trading Platform</p>
        </div>
      </footer>
    </div>
  );
}

