import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function DeployStrategy() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-red-500" />
            <h1 className="text-2xl font-bold">Deploy Strategy</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Strategy Deployment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Strategy deployment coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
