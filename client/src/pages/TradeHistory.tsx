import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TradeHistory() {
  const { data: trades, isLoading } = trpc.trading.trades.useQuery();
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  // Calculate trade statistics
  const calculateStats = () => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        buyTrades: 0,
        sellTrades: 0,
        totalPnL: 0,
        totalVolume: 0,
        totalCommission: 0,
        winRate: 0,
        avgPnL: 0,
      };
    }

    const buyTrades = trades.filter(t => t.side === 'BUY').length;
    const sellTrades = trades.filter(t => t.side === 'SELL').length;
    
    const totalPnL = trades.reduce((sum, trade) => {
      const pnl = Number(trade.pnl) || 0;
      return sum + pnl;
    }, 0);

    const totalVolume = trades.reduce((sum, trade) => {
      const quantity = Number(trade.quantity) || 0;
      const price = Number(trade.price) || 0;
      return sum + (quantity * price);
    }, 0);

    const totalCommission = trades.reduce((sum, trade) => {
      const commission = Number(trade.commission) || 0;
      return sum + commission;
    }, 0);

    const winningTrades = trades.filter(t => (Number(t.pnl) || 0) > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
    const avgPnL = trades.length > 0 ? totalPnL / trades.length : 0;

    return {
      totalTrades: trades.length,
      buyTrades,
      sellTrades,
      totalPnL,
      totalVolume,
      totalCommission,
      winRate,
      avgPnL,
    };
  };

  const stats = calculateStats();

  // Filter trades
  const filteredTrades = trades?.filter(trade => {
    if (filter === 'all') return true;
    if (filter === 'buy') return trade.side === 'BUY';
    if (filter === 'sell') return trade.side === 'SELL';
    return true;
  }) || [];

  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-bold">Trade History</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrades}</div>
              <p className="text-xs text-muted-foreground">
                {stats.buyTrades} buy / {stats.sellTrades} sell
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: ${stats.avgPnL.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(stats.winRate * stats.totalTrades / 100)} wins / {stats.totalTrades - Math.floor(stats.winRate * stats.totalTrades / 100)} losses
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalVolume.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              <p className="text-xs text-muted-foreground">
                Commission: ${stats.totalCommission.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trade History Table */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Trade History</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({stats.totalTrades})
                </Button>
                <Button
                  variant={filter === 'buy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('buy')}
                >
                  Buy ({stats.buyTrades})
                </Button>
                <Button
                  variant={filter === 'sell' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('sell')}
                >
                  Sell ({stats.sellTrades})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading trades...</div>
            ) : filteredTrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left p-3 font-medium">Trade ID</th>
                      <th className="text-left p-3 font-medium">Order ID</th>
                      <th className="text-left p-3 font-medium">Instrument</th>
                      <th className="text-left p-3 font-medium">Side</th>
                      <th className="text-right p-3 font-medium">Quantity</th>
                      <th className="text-right p-3 font-medium">Price</th>
                      <th className="text-right p-3 font-medium">Value</th>
                      <th className="text-right p-3 font-medium">Commission</th>
                      <th className="text-right p-3 font-medium">P&L</th>
                      <th className="text-left p-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrades.map((trade) => {
                      const quantity = Number(trade.quantity) || 0;
                      const price = Number(trade.price) || 0;
                      const value = quantity * price;
                      const commission = Number(trade.commission) || 0;
                      const pnl = Number(trade.pnl) || 0;

                      return (
                        <tr key={trade.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="font-mono text-sm">{trade.trade_id}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-sm text-muted-foreground">{trade.order_id}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{trade.instrument_id}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              trade.side === 'BUY' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {trade.side}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono">{quantity.toFixed(8)}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-mono text-red-500">-${commission.toFixed(2)}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className={`font-mono font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pnl !== 0 ? (
                                <>${pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}</>
                              ) : (
                                <span className="text-muted-foreground">$0.00</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {trade.executed_at ? new Date(trade.executed_at).toLocaleString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              }) : 'N/A'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Trades Found</h3>
                <p className="text-muted-foreground">
                  {filter !== 'all' 
                    ? `No ${filter} trades at the moment.`
                    : 'Start trading to see your trade history here.'
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

