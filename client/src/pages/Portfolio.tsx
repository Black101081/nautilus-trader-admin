import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portfolio() {
  const { data: positions, isLoading } = trpc.trading.positions.useQuery();

  // Calculate portfolio metrics
  const calculateMetrics = () => {
    if (!positions || positions.length === 0) {
      return {
        totalValue: 100000,
        cashBalance: 100000,
        totalPnL: 0,
        unrealizedPnL: 0,
        realizedPnL: 0,
        returnPercent: 0,
        openPositions: 0,
      };
    }

    const unrealizedPnL = positions.reduce((sum, pos) => {
      const pnl = parseFloat(pos.unrealized_pnl || "0");
      return sum + pnl;
    }, 0);

    const realizedPnL = positions.reduce((sum, pos) => {
      const pnl = parseFloat(pos.realized_pnl || "0");
      return sum + pnl;
    }, 0);

    const totalPnL = unrealizedPnL + realizedPnL;
    const startingBalance = 100000;
    const totalValue = startingBalance + totalPnL;
    
    const positionsValue = positions.reduce((sum, pos) => {
      if (pos.status === 'OPEN') {
        const quantity = parseFloat(pos.quantity || "0");
        const currentPrice = parseFloat(pos.current_price || "0");
        return sum + (quantity * currentPrice);
      }
      return sum;
    }, 0);

    const cashBalance = totalValue - positionsValue;
    const returnPercent = (totalPnL / startingBalance) * 100;
    const openPositions = positions.filter(p => p.status === 'OPEN').length;

    return {
      totalValue,
      cashBalance,
      totalPnL,
      unrealizedPnL,
      realizedPnL,
      returnPercent,
      openPositions,
    };
  };

  const metrics = calculateMetrics();

  // Calculate asset allocation
  const calculateAllocation = () => {
    if (!positions || positions.length === 0) return [];

    const allocation: { [key: string]: number } = {};
    
    positions.forEach(pos => {
      if (pos.status === 'OPEN') {
        const quantity = parseFloat(pos.quantity || "0");
        const currentPrice = parseFloat(pos.current_price || "0");
        const value = quantity * currentPrice;
        
        const instrument = pos.instrument_id.split('.')[0]; // Get base symbol
        allocation[instrument] = (allocation[instrument] || 0) + value;
      }
    });

    return Object.entries(allocation).map(([symbol, value]) => ({
      symbol,
      value,
      percentage: (value / metrics.totalValue) * 100,
    }));
  };

  const allocation = calculateAllocation();

  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Portfolio</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Portfolio Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                Starting: $100,000.00
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.returnPercent >= 0 ? '+' : ''}{metrics.returnPercent.toFixed(2)}% return
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                Available for trading
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.openPositions}</div>
              <p className="text-xs text-muted-foreground">
                Active instruments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading positions...</div>
                ) : positions && positions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/40">
                          <th className="text-left p-2 font-medium">Instrument</th>
                          <th className="text-left p-2 font-medium">Side</th>
                          <th className="text-right p-2 font-medium">Quantity</th>
                          <th className="text-right p-2 font-medium">Entry Price</th>
                          <th className="text-right p-2 font-medium">Current Price</th>
                          <th className="text-right p-2 font-medium">Unrealized P&L</th>
                          <th className="text-right p-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((position) => {
                          const unrealizedPnL = parseFloat(position.unrealized_pnl || "0");
                          const quantity = parseFloat(position.quantity || "0");
                          const entryPrice = parseFloat(position.entry_price || "0");
                          const currentPrice = parseFloat(position.current_price || "0");
                          const pnlPercent = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;

                          return (
                            <tr key={position.id} className="border-b border-border/20 hover:bg-muted/50">
                              <td className="p-2 font-medium">{position.instrument_id}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  position.side === 'LONG' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {position.side}
                                </span>
                              </td>
                              <td className="p-2 text-right font-mono">{quantity.toFixed(8)}</td>
                              <td className="p-2 text-right font-mono">${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="p-2 text-right font-mono">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className={`p-2 text-right font-mono font-medium ${unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toFixed(2)}
                                <span className="text-xs ml-1">({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
                              </td>
                              <td className="p-2 text-right">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  position.status === 'OPEN' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-500'
                                }`}>
                                  {position.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No open positions. Start trading to see your portfolio here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Allocation Tab */}
          <TabsContent value="allocation" className="space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                {allocation.length > 0 ? (
                  <div className="space-y-4">
                    {allocation.map((asset) => (
                      <div key={asset.symbol} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{asset.symbol}</span>
                          <span className="text-sm text-muted-foreground">
                            ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({asset.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${asset.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2 pt-4 border-t border-border/40">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Cash</span>
                        <span className="text-sm text-muted-foreground">
                          ${metrics.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({((metrics.cashBalance / metrics.totalValue) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(metrics.cashBalance / metrics.totalValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No assets to display. Start trading to build your portfolio.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>P&L Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Realized P&L</span>
                    <span className={`font-mono font-medium ${metrics.realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.realizedPnL >= 0 ? '+' : ''}{metrics.realizedPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Unrealized P&L</span>
                    <span className={`font-mono font-medium ${metrics.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.unrealizedPnL >= 0 ? '+' : ''}{metrics.unrealizedPnL.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border/40">
                    <span className="font-medium">Total P&L</span>
                    <span className={`font-mono font-bold text-lg ${metrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnL.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle>Return Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Return</span>
                    <span className={`font-mono font-medium ${metrics.returnPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrics.returnPercent >= 0 ? '+' : ''}{metrics.returnPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Starting Balance</span>
                    <span className="font-mono">$100,000.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border/40">
                    <span className="font-medium">Current Value</span>
                    <span className="font-mono font-bold text-lg">
                      ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TraderLayout>
  );
}

