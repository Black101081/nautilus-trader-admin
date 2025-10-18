#!/bin/bash

# Script to create all missing pages

PAGES_DIR="/home/ubuntu/nautilus-trader-demo/client/src/pages"

# Portfolio page
cat > "$PAGES_DIR/Portfolio.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function Portfolio() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Portfolio</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Portfolio management features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# Market Watch page
cat > "$PAGES_DIR/MarketWatch.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function MarketWatch() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <h1 className="text-2xl font-bold">Market Watch</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Real-time market data coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# Positions page
cat > "$PAGES_DIR/Positions.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";

export default function Positions() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Positions</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Position management coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# Orders page
cat > "$PAGES_DIR/Orders.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function Orders() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Order management coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# Trade History page
cat > "$PAGES_DIR/TradeHistory.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function TradeHistory() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-bold">Trade History</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Historical Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Trade history coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# WalkForward page
cat > "$PAGES_DIR/WalkForward.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function WalkForward() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Walk-Forward Analysis</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Walk-Forward Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Walk-forward analysis coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# Optimization page
cat > "$PAGES_DIR/Optimization.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function Optimization() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            <h1 className="text-2xl font-bold">Parameter Optimization</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Strategy Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Parameter optimization coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# StrategyLibrary page
cat > "$PAGES_DIR/StrategyLibrary.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function StrategyLibrary() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-green-500" />
            <h1 className="text-2xl font-bold">Strategy Library</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Pre-built Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Strategy library coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# DeployStrategy page
cat > "$PAGES_DIR/DeployStrategy.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function DeployStrategy() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-red-500" />
            <h1 className="text-2xl font-bold">Deploy Strategy</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Strategy Deployment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Strategy deployment coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# Performance page
cat > "$PAGES_DIR/Performance.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Performance() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Performance analytics coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# RiskAnalysis page
cat > "$PAGES_DIR/RiskAnalysis.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function RiskAnalysis() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-bold">Risk Analysis</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Risk analysis coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

# TradeJournal page
cat > "$PAGES_DIR/TradeJournal.tsx" << 'EOF'
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function TradeJournal() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            <h1 className="text-2xl font-bold">Trade Journal</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Trading Journal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Trade journal coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
EOF

echo "All missing pages created successfully!"

