import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered, TrendingUp, TrendingDown, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Positions() {
  const { data: positions, isLoading, refetch } = trpc.trading.positions.useQuery();
  const [filter, setFilter] = useState<'all' | 'long' | 'short'>('all');

  // Calculate summary metrics
  const calculateSummary = () => {
    if (!positions || positions.length === 0) {
      return {
        totalPositions: 0,
        longPositions: 0,
        shortPositions: 0,
        totalUnrealizedPnL: 0,
        winningPositions: 0,
        losingPositions: 0,
      };
    }

    const openPositions = positions.filter(p => p.status === 'OPEN');
    const longPositions = openPositions.filter(p => p.side === 'LONG').length;
    const shortPositions = openPositions.filter(p => p.side === 'SHORT').length;
    
    const totalUnrealizedPnL = positions.reduce((sum, pos) => {
      const pnl = Number(pos.unrealized_pnl) || 0;
      return sum + pnl;
    }, 0);

    const winningPositions = positions.filter(p => (Number(p.unrealized_pnl) || 0) > 0).length;
    const losingPositions = positions.filter(p => (Number(p.unrealized_pnl) || 0) < 0).length;

    return {
      totalPositions: openPositions.length,
      longPositions,
      shortPositions,
      totalUnrealizedPnL,
      winningPositions,
      losingPositions,
    };
  };

  const summary = calculateSummary();

  // Filter positions
  const filteredPositions = positions?.filter(pos => {
    if (filter === 'all') return true;
    if (filter === 'long') return pos.side === 'LONG';
    if (filter === 'short') return pos.side === 'SHORT';
    return true;
  }) || [];

  // Handle close position
  const handleClosePosition = (positionId: string) => {
    toast.info(`Closing position ${positionId}...`);
    // TODO: Implement close position mutation
    // closePositionMutation.mutate({ positionId });
  };

  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold">Positions</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalPositions}</div>
              <p className="text-xs text-muted-foreground">
                {summary.longPositions} long / {summary.shortPositions} short
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.totalUnrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${summary.totalUnrealizedPnL >= 0 ? '+' : ''}{summary.totalUnrealizedPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From all positions
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Winning</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{summary.winningPositions}</div>
              <p className="text-xs text-muted-foreground">
                Positions in profit
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Losing</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{summary.losingPositions}</div>
              <p className="text-xs text-muted-foreground">
                Positions in loss
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Positions Table */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Open Positions</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({summary.totalPositions})
                </Button>
                <Button
                  variant={filter === 'long' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('long')}
                >
                  Long ({summary.longPositions})
                </Button>
                <Button
                  variant={filter === 'short' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('short')}
                >
                  Short ({summary.shortPositions})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading positions...</div>
            ) : filteredPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left p-3 font-medium">Instrument</th>
                      <th className="text-left p-3 font-medium">Side</th>
                      <th className="text-right p-3 font-medium">Quantity</th>
                      <th className="text-right p-3 font-medium">Entry Price</th>
                      <th className="text-right p-3 font-medium">Current Price</th>
                      <th className="text-right p-3 font-medium">Unrealized P&L</th>
                      <th className="text-right p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPositions.map((position) => {
                      const unrealizedPnL = Number(position.unrealized_pnl) || 0;
                      const quantity = Number(position.quantity) || 0;
                      const entryPrice = Number(position.entry_price) || 0;
                      const currentPrice = Number(position.current_price) || 0;
                      const pnlPercent = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;

                      return (
                        <tr key={position.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="font-medium">{position.instrument_id}</div>
                            <div className="text-xs text-muted-foreground">ID: {position.position_id}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              position.side === 'LONG' 
                                ? 'bg-green-500/20 text-green-500' 
                                : position.side === 'SHORT'
                                ? 'bg-red-500/20 text-red-500'
                                : 'bg-gray-500/20 text-gray-500'
                            }`}>
                              {position.side}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono">{quantity.toFixed(8)}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono">${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            <div className={`text-xs ${pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className={`font-mono font-medium ${unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ${unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toFixed(2)}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              position.status === 'OPEN' 
                                ? 'bg-blue-500/20 text-blue-500' 
                                : 'bg-gray-500/20 text-gray-500'
                            }`}>
                              {position.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {position.status === 'OPEN' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleClosePosition(position.position_id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Close
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Positions Found</h3>
                <p className="text-muted-foreground">
                  {filter !== 'all' 
                    ? `No ${filter} positions at the moment. Try changing the filter.`
                    : 'Start trading to see your positions here.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TraderLayout>
  );
}

