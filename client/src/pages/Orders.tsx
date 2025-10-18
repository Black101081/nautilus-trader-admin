import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

export default function Orders() {
  const { data: orders, isLoading } = trpc.trading.orders.useQuery();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'filled' | 'cancelled'>('all');

  // Calculate summary metrics
  const calculateSummary = () => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        filledOrders: 0,
        cancelledOrders: 0,
        fillRate: 0,
      };
    }

    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'SUBMITTED').length;
    const filledOrders = orders.filter(o => o.status === 'FILLED').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
    const fillRate = orders.length > 0 ? (filledOrders / orders.length) * 100 : 0;

    return {
      totalOrders: orders.length,
      pendingOrders,
      filledOrders,
      cancelledOrders,
      fillRate,
    };
  };

  const summary = calculateSummary();

  // Filter orders by status
  const filteredOrders = orders?.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'PENDING' || order.status === 'SUBMITTED';
    if (activeTab === 'filled') return order.status === 'FILLED';
    if (activeTab === 'cancelled') return order.status === 'CANCELLED';
    return true;
  }) || [];

  // Handle cancel order
  const handleCancelOrder = (orderId: string) => {
    toast.info(`Cancelling order ${orderId}...`);
    // TODO: Implement cancel order mutation
    // cancelOrderMutation.mutate({ orderId });
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'SUBMITTED':
        return <Clock className="h-4 w-4" />;
      case 'FILLED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'SUBMITTED':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'FILLED':
        return 'bg-green-500/20 text-green-500';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{summary.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting execution
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filled</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{summary.filledOrders}</div>
              <p className="text-xs text-muted-foreground">
                Successfully executed
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.fillRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Order success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table with Tabs */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Orders ({summary.totalOrders})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({summary.pendingOrders})</TabsTrigger>
                <TabsTrigger value="filled">Filled ({summary.filledOrders})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({summary.cancelledOrders})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
                ) : filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/40">
                          <th className="text-left p-3 font-medium">Order ID</th>
                          <th className="text-left p-3 font-medium">Instrument</th>
                          <th className="text-left p-3 font-medium">Side</th>
                          <th className="text-right p-3 font-medium">Quantity</th>
                          <th className="text-right p-3 font-medium">Price</th>
                          <th className="text-right p-3 font-medium">Filled</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Time</th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => {
                          const quantity = parseFloat(order.quantity || "0");
                          const price = parseFloat(order.price || "0");
                          const filledQty = parseFloat(order.filled_quantity || "0");
                          const fillPercent = quantity > 0 ? (filledQty / quantity) * 100 : 0;

                          return (
                            <tr key={order.id} className="border-b border-border/20 hover:bg-muted/50 transition-colors">
                              <td className="p-3">
                                <div className="font-mono text-sm">{order.order_id}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-medium">{order.instrument_id}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  order.side === 'BUY' 
                                    ? 'bg-green-500/20 text-green-500' 
                                    : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {order.side}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="font-mono">{quantity.toFixed(8)}</div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="font-mono">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="font-mono">{filledQty.toFixed(8)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {fillPercent.toFixed(0)}%
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="text-sm">
                                  {order.created_at ? new Date(order.created_at).toLocaleString('en-US', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  }) : 'N/A'}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                {(order.status === 'PENDING' || order.status === 'SUBMITTED') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCancelOrder(order.order_id)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel
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
                    <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground">
                      {activeTab !== 'all' 
                        ? `No ${activeTab} orders at the moment.`
                        : 'Start trading to see your orders here.'
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TraderLayout>
  );
}

