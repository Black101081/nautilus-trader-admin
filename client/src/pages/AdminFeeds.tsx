import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CheckCircle, XCircle, AlertCircle, Play, Pause, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminFeeds() {
  const [feeds] = useState([
    {
      id: "binance-spot",
      name: "Binance Spot",
      type: "Market Data",
      status: "connected",
      latency: 12,
      messagesPerSec: 1250,
      subscriptions: 45,
      uptime: "99.98%",
    },
    {
      id: "coinbase-pro",
      name: "Coinbase Pro",
      type: "Market Data",
      status: "connected",
      latency: 18,
      messagesPerSec: 890,
      subscriptions: 32,
      uptime: "99.95%",
    },
    {
      id: "interactive-brokers",
      name: "Interactive Brokers",
      type: "Execution",
      status: "connected",
      latency: 25,
      messagesPerSec: 150,
      subscriptions: 12,
      uptime: "99.99%",
    },
    {
      id: "kraken",
      name: "Kraken",
      type: "Market Data",
      status: "disconnected",
      latency: 0,
      messagesPerSec: 0,
      subscriptions: 0,
      uptime: "0%",
    },
  ]);

  const [subscriptions] = useState([
    { symbol: "BTC/USD", feed: "Binance Spot", type: "Trades", rate: "125 msg/s", status: "active" },
    { symbol: "BTC/USD", feed: "Binance Spot", type: "OrderBook", rate: "450 msg/s", status: "active" },
    { symbol: "ETH/USD", feed: "Coinbase Pro", type: "Trades", rate: "89 msg/s", status: "active" },
    { symbol: "ETH/USD", feed: "Coinbase Pro", type: "OrderBook", rate: "320 msg/s", status: "active" },
    { symbol: "AAPL", feed: "Interactive Brokers", type: "Quotes", rate: "15 msg/s", status: "active" },
  ]);

  const handleStartFeed = (feedId: string) => {
    toast.success(`Starting feed: ${feedId}`);
  };

  const handleStopFeed = (feedId: string) => {
    toast.warning(`Stopping feed: ${feedId}`);
  };

  const handleRestartFeed = (feedId: string) => {
    toast.info(`Restarting feed: ${feedId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "connecting":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      connected: "default",
      disconnected: "destructive",
      connecting: "secondary",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status}
      </Badge>
    );
  };

  const connectedFeeds = feeds.filter((f) => f.status === "connected").length;
  const totalMessages = feeds.reduce((sum, f) => sum + f.messagesPerSec, 0);
  const avgLatency = feeds.filter((f) => f.status === "connected").reduce((sum, f) => sum + f.latency, 0) / connectedFeeds || 0;
  const totalSubscriptions = feeds.reduce((sum, f) => sum + f.subscriptions, 0);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Feeds</h1>
            <p className="text-muted-foreground">Monitor and manage market data connections</p>
          </div>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Feeds</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedFeeds}/{feeds.length}</div>
              <p className="text-xs text-muted-foreground">
                {((connectedFeeds / feeds.length) * 100).toFixed(1)}% uptime
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages/Sec</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total throughput
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgLatency.toFixed(1)}ms</div>
              <p className="text-xs text-muted-foreground">
                Network latency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                Active subscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feeds" className="space-y-4">
          <TabsList>
            <TabsTrigger value="feeds">Data Feeds</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="feeds" className="space-y-4">
            <div className="grid gap-4">
              {feeds.map((feed) => (
                <Card key={feed.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(feed.status)}
                        <div>
                          <CardTitle>{feed.name}</CardTitle>
                          <CardDescription>{feed.type}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(feed.status)}
                        {feed.status === "connected" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestartFeed(feed.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStopFeed(feed.id)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartFeed(feed.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Latency</p>
                        <p className="font-mono font-semibold">{feed.latency}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Messages/Sec</p>
                        <p className="font-mono font-semibold">{feed.messagesPerSec.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Subscriptions</p>
                        <p className="font-mono font-semibold">{feed.subscriptions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uptime</p>
                        <p className="font-mono font-semibold">{feed.uptime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Real-time data subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subscriptions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{sub.symbol}</p>
                          <p className="text-sm text-muted-foreground">{sub.feed}</p>
                        </div>
                        <Badge variant="outline">{sub.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-mono text-sm">{sub.rate}</p>
                        <Badge variant="default">{sub.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Data feed performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Performance charts and historical metrics will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
