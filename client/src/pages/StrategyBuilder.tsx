import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { ArrowLeft, Plus, Save, Trash2, Play } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function StrategyBuilder() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(DEFAULT_STRATEGY_CODE);
  const [parameters, setParameters] = useState("");

  const utils = trpc.useUtils();
  const { data: strategies } = trpc.strategies.list.useQuery();
  
  const createStrategy = trpc.strategies.create.useMutation({
    onSuccess: () => {
      toast.success("Strategy created successfully!");
      utils.strategies.list.invalidate();
      setName("");
      setDescription("");
      setCode(DEFAULT_STRATEGY_CODE);
      setParameters("");
    },
    onError: (error) => {
      toast.error(`Failed to create strategy: ${error.message}`);
    },
  });

  const deleteStrategy = trpc.strategies.delete.useMutation({
    onSuccess: () => {
      toast.success("Strategy deleted");
      utils.strategies.list.invalidate();
    },
  });

  const handleSave = () => {
    if (!name || !code) {
      toast.error("Name and code are required");
      return;
    }
    createStrategy.mutate({ name, description, code, parameters });
  };

  const handleLoadStrategy = (strategy: any) => {
    setName(strategy.name);
    setDescription(strategy.description || "");
    setCode(strategy.code);
    setParameters(strategy.parameters || "");
    toast.info(`Loaded strategy: ${strategy.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Strategy Builder</h1>
            <Link href="/reports">
              <Button variant="outline" size="sm">View Reports</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Strategy Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Create New Strategy</CardTitle>
                <CardDescription>
                  Write your trading strategy using NautilusTrader Python API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Strategy Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Moving Average Crossover"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your strategy..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Strategy Code</Label>
                  <Textarea
                    id="code"
                    placeholder="Enter your Python strategy code..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parameters">Parameters (JSON, Optional)</Label>
                  <Textarea
                    id="parameters"
                    placeholder='{"fast_period": 10, "slow_period": 20}'
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={createStrategy.isPending}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Strategy
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Play className="w-4 h-4" />
                    Test Run
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Code Template */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Strategy Template Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Import necessary modules from nautilus_trader</p>
                <p>• Define your strategy class inheriting from Strategy</p>
                <p>• Implement on_start(), on_bar(), on_data() methods</p>
                <p>• Use self.buy() and self.sell() for order execution</p>
                <p>• Access indicators via self.indicators</p>
                <p>• Log events using self.log.info()</p>
              </CardContent>
            </Card>
          </div>

          {/* Saved Strategies */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Saved Strategies
                </CardTitle>
                <CardDescription>
                  {strategies?.length || 0} strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {strategies && strategies.length > 0 ? (
                  <div className="space-y-3">
                    {strategies.map((strategy) => (
                      <div
                        key={strategy.id}
                        className="p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {strategy.name}
                            </h4>
                            {strategy.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {strategy.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(strategy.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLoadStrategy(strategy)}
                            >
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStrategy.mutate({ id: strategy.id })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No saved strategies yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Load Example Strategy
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Import from File
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Export Current
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_STRATEGY_CODE = `from nautilus_trader.trading.strategy import Strategy
from nautilus_trader.model.data import Bar

class MyStrategy(Strategy):
    """
    A simple example trading strategy.
    """
    
    def on_start(self):
        """Called when the strategy starts."""
        self.log.info("Strategy started")
    
    def on_bar(self, bar: Bar):
        """Called when a new bar is received."""
        self.log.info(f"Received bar: {bar}")
        
        # Your trading logic here
        # Example: Buy when price crosses above moving average
        # if bar.close > self.sma.value:
        #     self.buy()
    
    def on_stop(self):
        """Called when the strategy stops."""
        self.log.info("Strategy stopped")
`;

