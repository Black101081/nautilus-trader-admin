import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  Plus, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Clock,
  Zap,
  Link2,
  Key
} from "lucide-react";

export default function AdminBrokers() {
  const [isAddBrokerDialogOpen, setIsAddBrokerDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [newBroker, setNewBroker] = useState({ name: "", type: "", apiKey: "", apiSecret: "" });

  // Broker connections data (would come from database/API)
  const brokers = [
    {
      id: "broker_1",
      name: "Interactive Brokers",
      type: "Stock & Options",
      status: "connected",
      health: "healthy",
      apiVersion: "9.81",
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      latency: 45,
      uptime: 99.98,
      accountId: "U1234567",
      tradingEnabled: true,
      dataFeedEnabled: true,
      ordersToday: 127,
      fillRate: 99.2,
      rejectionRate: 0.8,
      avgExecutionTime: 0.12,
      commission: 0.005,
      supportedAssets: ["Stocks", "Options", "Futures", "Forex"],
      rateLimit: { current: 45, max: 100, unit: "req/min" },
    },
    {
      id: "broker_2",
      name: "Binance",
      type: "Cryptocurrency",
      status: "connected",
      health: "healthy",
      apiVersion: "v3",
      lastSync: new Date(Date.now() - 30 * 1000),
      latency: 120,
      uptime: 99.95,
      accountId: "binance_main",
      tradingEnabled: true,
      dataFeedEnabled: true,
      ordersToday: 342,
      fillRate: 98.5,
      rejectionRate: 1.5,
      avgExecutionTime: 0.08,
      commission: 0.001,
      supportedAssets: ["Crypto Spot", "Crypto Futures", "Crypto Options"],
      rateLimit: { current: 1150, max: 1200, unit: "req/min" },
    },
    {
      id: "broker_3",
      name: "Coinbase Pro",
      type: "Cryptocurrency",
      status: "connected",
      health: "warning",
      apiVersion: "2023-01-01",
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      latency: 180,
      uptime: 98.5,
      accountId: "coinbase_trading",
      tradingEnabled: true,
      dataFeedEnabled: false,
      ordersToday: 89,
      fillRate: 97.1,
      rejectionRate: 2.9,
      avgExecutionTime: 0.15,
      commission: 0.005,
      supportedAssets: ["Crypto Spot"],
      rateLimit: { current: 8, max: 10, unit: "req/sec" },
    },
    {
      id: "broker_4",
      name: "Kraken",
      type: "Cryptocurrency",
      status: "disconnected",
      health: "error",
      apiVersion: "v2",
      lastSync: new Date(Date.now() - 45 * 60 * 1000),
      latency: null,
      uptime: 95.2,
      accountId: "kraken_main",
      tradingEnabled: false,
      dataFeedEnabled: false,
      ordersToday: 0,
      fillRate: 0,
      rejectionRate: 0,
      avgExecutionTime: null,
      commission: 0.002,
      supportedAssets: ["Crypto Spot", "Crypto Futures"],
      rateLimit: { current: 0, max: 15, unit: "req/sec" },
    },
  ];

  // Aggregate statistics
  const totalBrokers = brokers.length;
  const connectedBrokers = brokers.filter(b => b.status === "connected").length;
  const totalOrders = brokers.reduce((sum, b) => sum + b.ordersToday, 0);
  const avgFillRate = (brokers.reduce((sum, b) => sum + b.fillRate, 0) / brokers.length).toFixed(1);

  const handleReconnect = (brokerId: string) => {
    console.log("Reconnecting broker:", brokerId);
    // Would trigger reconnection logic
  };

  const handleDisconnect = (brokerId: string) => {
    console.log("Disconnecting broker:", brokerId);
    // Would trigger disconnection logic
  };

  const handleToggleTrading = (brokerId: string, enabled: boolean) => {
    console.log("Toggle trading for broker:", brokerId, enabled);
    // Would update broker trading status
  };

  const handleAddBroker = () => {
    console.log("Adding new broker:", newBroker);
    setIsAddBrokerDialogOpen(false);
    setNewBroker({ name: "", type: "", apiKey: "", apiSecret: "" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Broker Integration</h1>
            <p className="text-muted-foreground">Manage broker connections, APIs, and trading venues</p>
          </div>
          <Button onClick={() => setIsAddBrokerDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Broker
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Brokers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBrokers}</div>
              <p className="text-xs text-muted-foreground">Configured brokers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedBrokers}/{totalBrokers}</div>
              <p className="text-xs text-muted-foreground">Active connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Across all brokers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fill Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgFillRate}%</div>
              <p className="text-xs text-muted-foreground">Order execution rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="connections" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connections">Broker Connections</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Connection Logs</TabsTrigger>
          </TabsList>

          {/* Broker Connections Tab */}
          <TabsContent value="connections" className="space-y-4">
            {brokers.map((broker) => (
              <Card key={broker.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(broker.status)}
                      <div>
                        <CardTitle className="text-xl">{broker.name}</CardTitle>
                        <CardDescription>{broker.type} • Account: {broker.accountId}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getHealthBadge(broker.health)}
                      <Badge variant="outline">API {broker.apiVersion}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(broker.status)}
                        <p className="font-medium capitalize">{broker.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Latency</p>
                      <p className="font-medium mt-1">
                        {broker.latency ? `${broker.latency}ms` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="font-medium mt-1">{broker.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Sync</p>
                      <p className="font-medium mt-1">
                        {Math.floor((Date.now() - broker.lastSync.getTime()) / 60000)}m ago
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Orders Today</p>
                      <p className="font-medium mt-1">{broker.ordersToday}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fill Rate</p>
                      <p className="font-medium mt-1 text-green-500">{broker.fillRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rejection Rate</p>
                      <p className="font-medium mt-1 text-red-500">{broker.rejectionRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Execution</p>
                      <p className="font-medium mt-1">
                        {broker.avgExecutionTime ? `${broker.avgExecutionTime}s` : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Rate Limit Usage</p>
                      <p className="text-sm text-muted-foreground">
                        {broker.rateLimit.current}/{broker.rateLimit.max} {broker.rateLimit.unit}
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(broker.rateLimit.current / broker.rateLimit.max) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Supported Assets</p>
                    <div className="flex flex-wrap gap-2">
                      {broker.supportedAssets.map((asset) => (
                        <Badge key={asset} variant="secondary">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={broker.tradingEnabled}
                          onCheckedChange={(checked) => handleToggleTrading(broker.id, checked)}
                          disabled={broker.status !== "connected"}
                        />
                        <Label>Trading Enabled</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={broker.dataFeedEnabled}
                          disabled={broker.status !== "connected"}
                        />
                        <Label>Data Feed</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {broker.status === "connected" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBroker(broker);
                              setIsConfigDialogOpen(true);
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(broker.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleReconnect(broker.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reconnect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Broker Performance Metrics</CardTitle>
                <CardDescription>Compare execution quality across brokers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Broker</th>
                        <th className="p-3 text-left font-medium">Orders</th>
                        <th className="p-3 text-left font-medium">Fill Rate</th>
                        <th className="p-3 text-left font-medium">Rejection Rate</th>
                        <th className="p-3 text-left font-medium">Avg Execution</th>
                        <th className="p-3 text-left font-medium">Latency</th>
                        <th className="p-3 text-left font-medium">Commission</th>
                        <th className="p-3 text-left font-medium">Uptime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brokers.map((broker) => (
                        <tr key={broker.id} className="border-b">
                          <td className="p-3 font-medium">{broker.name}</td>
                          <td className="p-3">{broker.ordersToday}</td>
                          <td className="p-3">
                            <span className="text-green-500 font-medium">{broker.fillRate}%</span>
                          </td>
                          <td className="p-3">
                            <span className="text-red-500 font-medium">{broker.rejectionRate}%</span>
                          </td>
                          <td className="p-3">{broker.avgExecutionTime ? `${broker.avgExecutionTime}s` : "N/A"}</td>
                          <td className="p-3">{broker.latency ? `${broker.latency}ms` : "N/A"}</td>
                          <td className="p-3">{(broker.commission * 100).toFixed(3)}%</td>
                          <td className="p-3">{broker.uptime}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Broker Settings</CardTitle>
                <CardDescription>Configure system-wide broker integration settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Auto-Reconnect</p>
                    <p className="text-sm text-muted-foreground">Automatically reconnect on connection loss</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Health Check Interval</p>
                    <p className="text-sm text-muted-foreground">Check broker health every 30 seconds</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10s</SelectItem>
                      <SelectItem value="30">30s</SelectItem>
                      <SelectItem value="60">60s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Rate Limit Protection</p>
                    <p className="text-sm text-muted-foreground">Throttle requests to prevent rate limit violations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Failover Mode</p>
                    <p className="text-sm text-muted-foreground">Route orders to backup broker on failure</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Log All API Calls</p>
                    <p className="text-sm text-muted-foreground">Record all broker API requests and responses</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connection Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connection Activity Log</CardTitle>
                <CardDescription>Recent broker connection events and API calls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "2 min ago", broker: "Binance", event: "Order executed", status: "success" },
                    { time: "5 min ago", broker: "Interactive Brokers", event: "Position update received", status: "success" },
                    { time: "8 min ago", broker: "Coinbase Pro", event: "Connection timeout", status: "warning" },
                    { time: "12 min ago", broker: "Binance", event: "Market data received", status: "success" },
                    { time: "15 min ago", broker: "Kraken", event: "Authentication failed", status: "error" },
                    { time: "18 min ago", broker: "Interactive Brokers", event: "Order placed", status: "success" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {log.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {log.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {log.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                        <div>
                          <p className="font-medium">{log.event}</p>
                          <p className="text-sm text-muted-foreground">{log.broker}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Broker Dialog */}
        <Dialog open={isAddBrokerDialogOpen} onOpenChange={setIsAddBrokerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Broker</DialogTitle>
              <DialogDescription>Connect a new broker to your trading system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="broker-name">Broker Name</Label>
                <Select value={newBroker.name} onValueChange={(value) => setNewBroker({ ...newBroker, name: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interactive Brokers">Interactive Brokers</SelectItem>
                    <SelectItem value="Binance">Binance</SelectItem>
                    <SelectItem value="Coinbase">Coinbase</SelectItem>
                    <SelectItem value="Kraken">Kraken</SelectItem>
                    <SelectItem value="Alpaca">Alpaca</SelectItem>
                    <SelectItem value="TD Ameritrade">TD Ameritrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="broker-type">Broker Type</Label>
                <Select value={newBroker.type} onValueChange={(value) => setNewBroker({ ...newBroker, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock & Options</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="futures">Futures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={newBroker.apiKey}
                  onChange={(e) => setNewBroker({ ...newBroker, apiKey: e.target.value })}
                  placeholder="Enter API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  id="api-secret"
                  type="password"
                  value={newBroker.apiSecret}
                  onChange={(e) => setNewBroker({ ...newBroker, apiSecret: e.target.value })}
                  placeholder="Enter API secret"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBrokerDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBroker}>
                <Link2 className="mr-2 h-4 w-4" />
                Connect Broker
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configure Broker Dialog */}
        <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configure {selectedBroker?.name}</DialogTitle>
              <DialogDescription>Update broker connection settings</DialogDescription>
            </DialogHeader>
            {selectedBroker && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input defaultValue={selectedBroker.accountId} />
                </div>
                <div className="space-y-2">
                  <Label>API Version</Label>
                  <Input defaultValue={selectedBroker.apiVersion} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <Label>Enable Trading</Label>
                  <Switch defaultChecked={selectedBroker.tradingEnabled} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <Label>Enable Data Feed</Label>
                  <Switch defaultChecked={selectedBroker.dataFeedEnabled} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

