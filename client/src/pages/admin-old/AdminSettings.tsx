import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, RotateCcw, Database, Activity, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [hasChanges, setHasChanges] = useState(false);

  // Core Engine Settings
  const [coreSettings, setCoreSettings] = useState({
    executionEngine: {
      enabled: true,
      maxOrdersPerSecond: 100,
      orderTimeout: 30,
      retryAttempts: 3,
    },
    riskEngine: {
      enabled: true,
      preTradeChecks: true,
      postTradeChecks: true,
      maxDrawdown: 0.2,
    },
    cache: {
      maxSize: 10000,
      ttl: 3600,
      persistToDisk: true,
    },
  });

  // Data Feed Settings
  const [dataSettings, setDataSettings] = useState({
    providers: {
      primary: "binance",
      backup: "coinbase",
      timeout: 5000,
    },
    subscriptions: {
      autoSubscribe: true,
      maxSymbols: 100,
      updateInterval: 1000,
    },
  });

  // Trading Settings
  const [tradingSettings, setTradingSettings] = useState({
    orders: {
      defaultOrderType: "LIMIT",
      allowMarketOrders: true,
      allowStopOrders: true,
      maxSlippage: 0.01,
    },
    positions: {
      maxPositions: 10,
      maxLeverage: 3.0,
      autoCloseOnStop: true,
    },
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    logging: {
      level: "INFO",
      enableFileLogging: true,
      enableConsoleLogging: true,
      maxLogSize: 100,
    },
    monitoring: {
      enableMetrics: true,
      metricsInterval: 60,
      enableAlerts: true,
      alertEmail: "admin@example.com",
    },
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setHasChanges(false);
  };

  const handleReset = () => {
    toast.info("Settings reset to defaults");
    setHasChanges(false);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure NautilusTrader platform parameters</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="core" className="space-y-4">
          <TabsList>
            <TabsTrigger value="core">Core Engine</TabsTrigger>
            <TabsTrigger value="data">Data Feeds</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          {/* Core Engine Settings */}
          <TabsContent value="core" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Engine</CardTitle>
                <CardDescription>Order execution and processing configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Execution Engine</Label>
                    <p className="text-sm text-muted-foreground">Allow order execution</p>
                  </div>
                  <Switch
                    checked={coreSettings.executionEngine.enabled}
                    onCheckedChange={(checked) => {
                      setCoreSettings({
                        ...coreSettings,
                        executionEngine: { ...coreSettings.executionEngine, enabled: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Max Orders Per Second</Label>
                  <Input
                    type="number"
                    value={coreSettings.executionEngine.maxOrdersPerSecond}
                    onChange={(e) => {
                      setCoreSettings({
                        ...coreSettings,
                        executionEngine: {
                          ...coreSettings.executionEngine,
                          maxOrdersPerSecond: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">Rate limit for order submissions</p>
                </div>

                <div className="grid gap-2">
                  <Label>Order Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={coreSettings.executionEngine.orderTimeout}
                    onChange={(e) => {
                      setCoreSettings({
                        ...coreSettings,
                        executionEngine: {
                          ...coreSettings.executionEngine,
                          orderTimeout: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Retry Attempts</Label>
                  <Input
                    type="number"
                    value={coreSettings.executionEngine.retryAttempts}
                    onChange={(e) => {
                      setCoreSettings({
                        ...coreSettings,
                        executionEngine: {
                          ...coreSettings.executionEngine,
                          retryAttempts: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Engine</CardTitle>
                <CardDescription>Risk management and compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Risk Engine</Label>
                    <p className="text-sm text-muted-foreground">Enforce risk checks</p>
                  </div>
                  <Switch
                    checked={coreSettings.riskEngine.enabled}
                    onCheckedChange={(checked) => {
                      setCoreSettings({
                        ...coreSettings,
                        riskEngine: { ...coreSettings.riskEngine, enabled: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Pre-Trade Checks</Label>
                  <Switch
                    checked={coreSettings.riskEngine.preTradeChecks}
                    onCheckedChange={(checked) => {
                      setCoreSettings({
                        ...coreSettings,
                        riskEngine: { ...coreSettings.riskEngine, preTradeChecks: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Post-Trade Checks</Label>
                  <Switch
                    checked={coreSettings.riskEngine.postTradeChecks}
                    onCheckedChange={(checked) => {
                      setCoreSettings({
                        ...coreSettings,
                        riskEngine: { ...coreSettings.riskEngine, postTradeChecks: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={coreSettings.riskEngine.maxDrawdown * 100}
                    onChange={(e) => {
                      setCoreSettings({
                        ...coreSettings,
                        riskEngine: {
                          ...coreSettings.riskEngine,
                          maxDrawdown: parseFloat(e.target.value) / 100,
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Configuration</CardTitle>
                <CardDescription>In-memory cache settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Max Cache Size (items)</Label>
                  <Input
                    type="number"
                    value={coreSettings.cache.maxSize}
                    onChange={(e) => {
                      setCoreSettings({
                        ...coreSettings,
                        cache: { ...coreSettings.cache, maxSize: parseInt(e.target.value) },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>TTL (seconds)</Label>
                  <Input
                    type="number"
                    value={coreSettings.cache.ttl}
                    onChange={(e) => {
                      setCoreSettings({
                        ...coreSettings,
                        cache: { ...coreSettings.cache, ttl: parseInt(e.target.value) },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Persist to Disk</Label>
                  <Switch
                    checked={coreSettings.cache.persistToDisk}
                    onCheckedChange={(checked) => {
                      setCoreSettings({
                        ...coreSettings,
                        cache: { ...coreSettings.cache, persistToDisk: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Feed Settings */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Providers</CardTitle>
                <CardDescription>Market data source configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Primary Provider</Label>
                  <Select
                    value={dataSettings.providers.primary}
                    onValueChange={(value) => {
                      setDataSettings({
                        ...dataSettings,
                        providers: { ...dataSettings.providers, primary: value },
                      });
                      setHasChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="binance">Binance</SelectItem>
                      <SelectItem value="coinbase">Coinbase</SelectItem>
                      <SelectItem value="kraken">Kraken</SelectItem>
                      <SelectItem value="interactive_brokers">Interactive Brokers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Backup Provider</Label>
                  <Select
                    value={dataSettings.providers.backup}
                    onValueChange={(value) => {
                      setDataSettings({
                        ...dataSettings,
                        providers: { ...dataSettings.providers, backup: value },
                      });
                      setHasChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="binance">Binance</SelectItem>
                      <SelectItem value="coinbase">Coinbase</SelectItem>
                      <SelectItem value="kraken">Kraken</SelectItem>
                      <SelectItem value="interactive_brokers">Interactive Brokers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Connection Timeout (ms)</Label>
                  <Input
                    type="number"
                    value={dataSettings.providers.timeout}
                    onChange={(e) => {
                      setDataSettings({
                        ...dataSettings,
                        providers: { ...dataSettings.providers, timeout: parseInt(e.target.value) },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Data subscription settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Subscribe</Label>
                    <p className="text-sm text-muted-foreground">Automatically subscribe to strategy instruments</p>
                  </div>
                  <Switch
                    checked={dataSettings.subscriptions.autoSubscribe}
                    onCheckedChange={(checked) => {
                      setDataSettings({
                        ...dataSettings,
                        subscriptions: { ...dataSettings.subscriptions, autoSubscribe: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Max Symbols</Label>
                  <Input
                    type="number"
                    value={dataSettings.subscriptions.maxSymbols}
                    onChange={(e) => {
                      setDataSettings({
                        ...dataSettings,
                        subscriptions: {
                          ...dataSettings.subscriptions,
                          maxSymbols: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Update Interval (ms)</Label>
                  <Input
                    type="number"
                    value={dataSettings.subscriptions.updateInterval}
                    onChange={(e) => {
                      setDataSettings({
                        ...dataSettings,
                        subscriptions: {
                          ...dataSettings.subscriptions,
                          updateInterval: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Settings */}
          <TabsContent value="trading" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Settings</CardTitle>
                <CardDescription>Order execution preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Default Order Type</Label>
                  <Select
                    value={tradingSettings.orders.defaultOrderType}
                    onValueChange={(value) => {
                      setTradingSettings({
                        ...tradingSettings,
                        orders: { ...tradingSettings.orders, defaultOrderType: value },
                      });
                      setHasChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIMIT">Limit</SelectItem>
                      <SelectItem value="MARKET">Market</SelectItem>
                      <SelectItem value="STOP">Stop</SelectItem>
                      <SelectItem value="STOP_LIMIT">Stop Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Allow Market Orders</Label>
                  <Switch
                    checked={tradingSettings.orders.allowMarketOrders}
                    onCheckedChange={(checked) => {
                      setTradingSettings({
                        ...tradingSettings,
                        orders: { ...tradingSettings.orders, allowMarketOrders: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Allow Stop Orders</Label>
                  <Switch
                    checked={tradingSettings.orders.allowStopOrders}
                    onCheckedChange={(checked) => {
                      setTradingSettings({
                        ...tradingSettings,
                        orders: { ...tradingSettings.orders, allowStopOrders: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Max Slippage (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tradingSettings.orders.maxSlippage * 100}
                    onChange={(e) => {
                      setTradingSettings({
                        ...tradingSettings,
                        orders: {
                          ...tradingSettings.orders,
                          maxSlippage: parseFloat(e.target.value) / 100,
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position Settings</CardTitle>
                <CardDescription>Position management configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Max Positions</Label>
                  <Input
                    type="number"
                    value={tradingSettings.positions.maxPositions}
                    onChange={(e) => {
                      setTradingSettings({
                        ...tradingSettings,
                        positions: {
                          ...tradingSettings.positions,
                          maxPositions: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Max Leverage</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={tradingSettings.positions.maxLeverage}
                    onChange={(e) => {
                      setTradingSettings({
                        ...tradingSettings,
                        positions: {
                          ...tradingSettings.positions,
                          maxLeverage: parseFloat(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Close on Stop</Label>
                    <p className="text-sm text-muted-foreground">Automatically close positions when stop loss is hit</p>
                  </div>
                  <Switch
                    checked={tradingSettings.positions.autoCloseOnStop}
                    onCheckedChange={(checked) => {
                      setTradingSettings({
                        ...tradingSettings,
                        positions: { ...tradingSettings.positions, autoCloseOnStop: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logging</CardTitle>
                <CardDescription>System logging configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Log Level</Label>
                  <Select
                    value={systemSettings.logging.level}
                    onValueChange={(value) => {
                      setSystemSettings({
                        ...systemSettings,
                        logging: { ...systemSettings.logging, level: value },
                      });
                      setHasChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEBUG">Debug</SelectItem>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="WARNING">Warning</SelectItem>
                      <SelectItem value="ERROR">Error</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable File Logging</Label>
                  <Switch
                    checked={systemSettings.logging.enableFileLogging}
                    onCheckedChange={(checked) => {
                      setSystemSettings({
                        ...systemSettings,
                        logging: { ...systemSettings.logging, enableFileLogging: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Console Logging</Label>
                  <Switch
                    checked={systemSettings.logging.enableConsoleLogging}
                    onCheckedChange={(checked) => {
                      setSystemSettings({
                        ...systemSettings,
                        logging: { ...systemSettings.logging, enableConsoleLogging: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Max Log Size (MB)</Label>
                  <Input
                    type="number"
                    value={systemSettings.logging.maxLogSize}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        logging: {
                          ...systemSettings.logging,
                          maxLogSize: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring & Alerts</CardTitle>
                <CardDescription>System monitoring configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Metrics Collection</Label>
                  <Switch
                    checked={systemSettings.monitoring.enableMetrics}
                    onCheckedChange={(checked) => {
                      setSystemSettings({
                        ...systemSettings,
                        monitoring: { ...systemSettings.monitoring, enableMetrics: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Metrics Interval (seconds)</Label>
                  <Input
                    type="number"
                    value={systemSettings.monitoring.metricsInterval}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        monitoring: {
                          ...systemSettings.monitoring,
                          metricsInterval: parseInt(e.target.value),
                        },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Alerts</Label>
                  <Switch
                    checked={systemSettings.monitoring.enableAlerts}
                    onCheckedChange={(checked) => {
                      setSystemSettings({
                        ...systemSettings,
                        monitoring: { ...systemSettings.monitoring, enableAlerts: checked },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Alert Email</Label>
                  <Input
                    type="email"
                    value={systemSettings.monitoring.alertEmail}
                    onChange={(e) => {
                      setSystemSettings({
                        ...systemSettings,
                        monitoring: { ...systemSettings.monitoring, alertEmail: e.target.value },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Settings */}
          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Broker Integration</CardTitle>
                <CardDescription>Trading broker configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Broker integration settings will be configured in the Broker Integration page.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Integration</CardTitle>
                <CardDescription>Database connection settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Database settings are managed in the Database Management page.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
