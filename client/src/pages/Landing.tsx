import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  TrendingUp,
  Shield,
  Activity,
  Users,
  Zap,
  Database,
  Settings,
  BarChart3,
  Target,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NautilusTrader
              </h1>
              <p className="text-sm text-muted-foreground">Professional Algorithmic Trading Platform</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-2 px-4 py-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm">v1.220.0 • System Online</span>
          </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Interface
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the interface that matches your role: System Administration or Trading Operations
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Admin Card */}
          <Card className="border-2 border-border/40 bg-background/50 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <Server className="h-8 w-8 text-white" />
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  Admin
                </Badge>
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">System Administration</CardTitle>
                <CardDescription className="text-base">
                  Manage NautilusTrader infrastructure, monitor system health, and configure platform components
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Server className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-muted-foreground">System Components Management</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Database className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-muted-foreground">Data Feed Configuration</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-muted-foreground">User & Access Management</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-muted-foreground">Risk Controls & Compliance</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Settings className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-muted-foreground">System Configuration</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white group/btn"
                onClick={() => setLocation("/admin/system")}
              >
                <span>Enter Admin Panel</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Requires administrator privileges
              </p>
            </CardContent>
          </Card>

          {/* Trader Card */}
          <Card className="border-2 border-border/40 bg-background/50 backdrop-blur-xl hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 group">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  Trader
                </Badge>
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">Trading Operations</CardTitle>
                <CardDescription className="text-base">
                  Execute strategies, manage positions, analyze performance, and monitor live trading activities
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <Activity className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-muted-foreground">Live Trading & Execution</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <Target className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-muted-foreground">Position & Order Management</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-muted-foreground">Strategy Development & Testing</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-muted-foreground">Performance Analytics</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <Shield className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-muted-foreground">Risk Management Tools</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group/btn"
                onClick={() => setLocation("/")}
              >
                <span>Enter Trading Platform</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Standard user access
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-8 text-muted-foreground">
            Powered by NautilusTrader Core
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium">High Performance</p>
              <p className="text-xs text-muted-foreground">Rust Core Engine</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium">Multi-Asset</p>
              <p className="text-xs text-muted-foreground">Equities, Forex, Crypto</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">Enterprise Grade</p>
              <p className="text-xs text-muted-foreground">Production Ready</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                <Settings className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-sm font-medium">Flexible</p>
              <p className="text-xs text-muted-foreground">Highly Customizable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 bg-background/30 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 NautilusTrader. Open source algorithmic trading platform.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://nautilustrader.io" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="https://github.com/nautechsystems/nautilus_trader" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="https://discord.gg/AUWVyZT" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

