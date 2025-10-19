import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function MarketWatch() {
  return (
    <TraderLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <h1 className="text-2xl font-bold">Market Watch</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Real-time market data coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </TraderLayout>
  );
}
