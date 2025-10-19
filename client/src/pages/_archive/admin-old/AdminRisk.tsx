import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, TrendingUp, DollarSign, Percent, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminRisk() {
  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [riskLimits, setRiskLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trpc/risk.getRiskLimits').then(r => r.json());
      setRiskLimits(res.result?.data?.json || null);
    } catch (err) {
      console.error('Failed to fetch risk limits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimit = async (limitType: string, value: number) => {
    try {
      await fetch('/api/trpc/risk.updateRiskLimit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limitType, value })
      });
      await fetchData();
      setEditingLimit(null);
    } catch (err) {
      console.error('Failed to update risk limit:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const refetch = fetchData;

  const globalLimits = riskLimits?.globalLimits || {
    maxPositionSize: 10000,
    maxDailyLoss: 50000,
    maxLeverage: 3.0,
    maxOrderSize: 5000,
    maxPortfolioExposure: 100000,
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Risk Management</h1>
            <p className="text-muted-foreground">Configure and monitor risk controls</p>
          </div>
          <Button variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Emergency Stop All
          </Button>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Exposure</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,230</div>
              <p className="text-xs text-muted-foreground">
                Limit: ${globalLimits.maxPortfolioExposure.toLocaleString()}
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(45230 / globalLimits.maxPortfolioExposure) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+$2,340</div>
              <p className="text-xs text-muted-foreground">
                Max Loss: ${globalLimits.maxDailyLoss.toLocaleString()}
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "15%" }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Leverage</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.8x</div>
              <p className="text-xs text-muted-foreground">
                Max: {globalLimits.maxLeverage}x
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(1.8 / globalLimits.maxLeverage) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Checks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Performed today</p>
              <Badge variant="secondary" className="mt-2">2 Failures</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Risk Limits Configuration */}
        <Tabs defaultValue="global" className="space-y-4">
          <TabsList>
            <TabsTrigger value="global">Global Limits</TabsTrigger>
            <TabsTrigger value="instruments">Instrument Limits</TabsTrigger>
            <TabsTrigger value="violations">Risk Violations</TabsTrigger>
            <TabsTrigger value="controls">Risk Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Risk Limits</CardTitle>
                <CardDescription>System-wide risk parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Position Size</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={globalLimits.maxPositionSize}
                        disabled={editingLimit !== "maxPositionSize"}
                      />
                      <Button
                        size="sm"
                        variant={editingLimit === "maxPositionSize" ? "default" : "outline"}
                        onClick={() => setEditingLimit(editingLimit === "maxPositionSize" ? null : "maxPositionSize")}
                      >
                        {editingLimit === "maxPositionSize" ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Daily Loss</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={globalLimits.maxDailyLoss}
                        disabled={editingLimit !== "maxDailyLoss"}
                      />
                      <Button
                        size="sm"
                        variant={editingLimit === "maxDailyLoss" ? "default" : "outline"}
                        onClick={() => setEditingLimit(editingLimit === "maxDailyLoss" ? null : "maxDailyLoss")}
                      >
                        {editingLimit === "maxDailyLoss" ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Leverage</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={globalLimits.maxLeverage}
                        disabled={editingLimit !== "maxLeverage"}
                      />
                      <Button
                        size="sm"
                        variant={editingLimit === "maxLeverage" ? "default" : "outline"}
                        onClick={() => setEditingLimit(editingLimit === "maxLeverage" ? null : "maxLeverage")}
                      >
                        {editingLimit === "maxLeverage" ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Order Size</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={globalLimits.maxOrderSize}
                        disabled={editingLimit !== "maxOrderSize"}
                      />
                      <Button
                        size="sm"
                        variant={editingLimit === "maxOrderSize" ? "default" : "outline"}
                        onClick={() => setEditingLimit(editingLimit === "maxOrderSize" ? null : "maxOrderSize")}
                      >
                        {editingLimit === "maxOrderSize" ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instruments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Instrument-Specific Limits</CardTitle>
                <CardDescription>Per-instrument risk parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Instrument</th>
                        <th className="p-3 text-left font-medium">Max Position</th>
                        <th className="p-3 text-left font-medium">Current Position</th>
                        <th className="p-3 text-left font-medium">Utilization</th>
                        <th className="p-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { instrument: "EUR/USD", max: 100000, current: 45000, status: "OK" },
                        { instrument: "BTC/USD", max: 50000, current: 38000, status: "Warning" },
                        { instrument: "AAPL", max: 10000, current: 2500, status: "OK" },
                      ].map((item) => (
                        <tr key={item.instrument} className="border-b">
                          <td className="p-3 font-mono">{item.instrument}</td>
                          <td className="p-3">${item.max.toLocaleString()}</td>
                          <td className="p-3">${item.current.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${item.status === "Warning" ? "bg-yellow-500" : "bg-green-500"}`}
                                  style={{ width: `${(item.current / item.max) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm">{Math.round((item.current / item.max) * 100)}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={item.status === "Warning" ? "destructive" : "secondary"}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Risk Violations</CardTitle>
                <CardDescription>Risk check failures and overrides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Time</th>
                        <th className="p-3 text-left font-medium">Type</th>
                        <th className="p-3 text-left font-medium">Instrument</th>
                        <th className="p-3 text-left font-medium">Details</th>
                        <th className="p-3 text-left font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-sm">10:23:45</td>
                        <td className="p-3">Position Limit</td>
                        <td className="p-3 font-mono">EUR/USD</td>
                        <td className="p-3 text-sm">Attempted 120,000 / Limit 100,000</td>
                        <td className="p-3">
                          <Badge variant="destructive">Rejected</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm">09:15:22</td>
                        <td className="p-3">Daily Loss</td>
                        <td className="p-3 font-mono">-</td>
                        <td className="p-3 text-sm">Loss -$51,200 / Limit -$50,000</td>
                        <td className="p-3">
                          <Badge variant="destructive">Auto-Closed</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Control Settings</CardTitle>
                <CardDescription>Enable/disable specific risk checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Pre-trade Position Limit Check", enabled: true },
                  { name: "Pre-trade Daily Loss Check", enabled: true },
                  { name: "Pre-trade Leverage Check", enabled: true },
                  { name: "Post-trade Exposure Check", enabled: true },
                  { name: "Real-time P&L Monitoring", enabled: true },
                ].map((control) => (
                  <div key={control.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{control.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {control.enabled ? "Currently active" : "Currently disabled"}
                      </p>
                    </div>
                    <Badge variant={control.enabled ? "secondary" : "outline"}>
                      {control.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
