import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingDown, Activity, DollarSign, Percent } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Progress } from "@/components/ui/progress";

export default function RiskAnalysis() {
  const { data: positions } = trpc.trading.positions.useQuery();
  const { data: trades } = trpc.trading.trades.useQuery();

  // Calculate risk metrics
  const calculateRiskMetrics = () => {
    const initialBalance = 100000;
    const currentBalance = 100000;

    // Portfolio risk (simplified VaR)
    const portfolioRisk = 6.0; // TODO: Calculate actual VaR

    // Max drawdown
    const maxDrawdown = 5.23; // TODO: Calculate from equity curve

    // Sharpe ratio
    const sharpeRatio = 1.45; // TODO: Calculate from returns

    // Current exposure
    const openPositions = positions?.filter(p => p.status === 'OPEN') || [];
    const totalExposure = openPositions.reduce((sum, pos) => {
      const quantity = Number(pos.quantity) || 0;
      const currentPrice = Number(pos.current_price) || 0;
      return sum + (quantity * currentPrice);
    }, 0);

    const exposurePercent = currentBalance > 0 ? (totalExposure / currentBalance) * 100 : 0;

    // Position size limits
    const maxPositionSize = currentBalance * 0.25; // 25% max per position
    const largestPosition = Math.max(...openPositions.map(pos => {
      const quantity = Number(pos.quantity) || 0;
      const currentPrice = Number(pos.current_price) || 0;
      return quantity * currentPrice;
    }), 0);
    const positionSizeUsage = maxPositionSize > 0 ? (largestPosition / maxPositionSize) * 100 : 0;

    // Daily loss limit
    const dailyLossLimit = 1000; // $1000 max daily loss
    const todayPnL = trades?.reduce((sum, trade) => {
      // TODO: Filter by today's date
      return sum + (Number(trade.pnl) || 0);
    }, 0) || 0;
    const dailyLossUsage = dailyLossLimit > 0 ? Math.abs(Math.min(todayPnL, 0) / dailyLossLimit) * 100 : 0;

    // Leverage
    const maxLeverage = 5.0; // 5x max leverage
    const currentLeverage = currentBalance > 0 ? totalExposure / currentBalance : 0;
    const leverageUsage = maxLeverage > 0 ? (currentLeverage / maxLeverage) * 100 : 0;

    // Concentration risk
    const maxConcentration = 0.25; // 25% max per instrument
    const instrumentExposure = openPositions.reduce((acc, pos) => {
      const instrument = pos.instrument_id;
      const quantity = Number(pos.quantity) || 0;
      const currentPrice = Number(pos.current_price) || 0;
      const value = quantity * currentPrice;
      acc[instrument] = (acc[instrument] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    const exposureValues = Object.values(instrumentExposure) as number[];
    const maxInstrumentExposure = exposureValues.length > 0 ? Math.max(...exposureValues) : 0;
    const concentrationPercent = totalExposure > 0 ? maxInstrumentExposure / totalExposure : 0;
    const concentrationUsage = maxConcentration > 0 ? (concentrationPercent / maxConcentration) * 100 : 0;

    // Risk alerts
    const alerts: Array<{type: 'warning' | 'danger', message: string}> = [];
    
    if (positionSizeUsage > 90) {
      alerts.push({ type: 'danger', message: 'Position size limit nearly exceeded' });
    } else if (positionSizeUsage > 75) {
      alerts.push({ type: 'warning', message: 'High position size usage' });
    }

    if (dailyLossUsage > 90) {
      alerts.push({ type: 'danger', message: 'Daily loss limit nearly exceeded' });
    } else if (dailyLossUsage > 75) {
      alerts.push({ type: 'warning', message: 'Approaching daily loss limit' });
    }

    if (leverageUsage > 90) {
      alerts.push({ type: 'danger', message: 'Leverage limit nearly exceeded' });
    } else if (leverageUsage > 75) {
      alerts.push({ type: 'warning', message: 'High leverage usage' });
    }

    if (concentrationUsage > 90) {
      alerts.push({ type: 'danger', message: 'Concentration risk too high' });
    } else if (concentrationUsage > 75) {
      alerts.push({ type: 'warning', message: 'High concentration in single instrument' });
    }

    return {
      portfolioRisk,
      maxDrawdown,
      sharpeRatio,
      exposurePercent,
      positionSizeUsage,
      dailyLossUsage,
      dailyLossLimit,
      todayPnL,
      leverageUsage,
      currentLeverage,
      maxLeverage,
      concentrationUsage,
      concentrationPercent,
      maxConcentration,
      alerts,
    };
  };

  const risk = calculateRiskMetrics();

  // Get risk level color
  const getRiskColor = (value: number) => {
    if (value < 5) return 'text-green-500';
    if (value < 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get progress color
  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-bold">Risk Analysis</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Risk Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Risk</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getRiskColor(risk.portfolioRisk)}`}>
                {risk.portfolioRisk.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {risk.portfolioRisk < 5 ? 'Low Risk' : risk.portfolioRisk < 10 ? 'Medium Risk' : 'High Risk'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                -{risk.maxDrawdown.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Peak to trough
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {risk.sharpeRatio.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Risk-adjusted return
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exposure</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {risk.exposurePercent.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Of available capital
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Limits */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Risk Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Position Size Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Position Size Limit</span>
                <span className="text-sm text-muted-foreground">
                  {risk.positionSizeUsage.toFixed(0)}% / 100%
                </span>
              </div>
              <Progress value={risk.positionSizeUsage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Maximum 25% of capital per position
              </p>
            </div>

            {/* Daily Loss Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Daily Loss Limit</span>
                <span className="text-sm text-muted-foreground">
                  ${Math.abs(Math.min(risk.todayPnL, 0)).toFixed(2)} / ${risk.dailyLossLimit.toFixed(2)}
                </span>
              </div>
              <Progress value={risk.dailyLossUsage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Maximum $1,000 loss per day
              </p>
            </div>

            {/* Leverage Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Leverage Limit</span>
                <span className="text-sm text-muted-foreground">
                  {risk.currentLeverage.toFixed(1)}x / {risk.maxLeverage.toFixed(1)}x
                </span>
              </div>
              <Progress value={risk.leverageUsage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Maximum 5x leverage allowed
              </p>
            </div>

            {/* Concentration Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Concentration Limit</span>
                <span className="text-sm text-muted-foreground">
                  {(risk.concentrationPercent * 100).toFixed(0)}% / {(risk.maxConcentration * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={risk.concentrationUsage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Maximum 25% exposure per instrument
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Risk Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {risk.alerts.length > 0 ? (
              <div className="space-y-3">
                {risk.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      alert.type === 'danger'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 mt-0.5 ${
                        alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {alert.type === 'danger' ? 'Critical' : 'Warning'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-green-500/50 mb-4" />
                <h3 className="text-lg font-medium text-green-500 mb-2">No Active Risk Alerts</h3>
                <p className="text-muted-foreground">
                  All risk metrics are within acceptable limits
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TraderLayout>
  );
}

