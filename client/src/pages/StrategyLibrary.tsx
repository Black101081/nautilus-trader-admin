import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function StrategyLibrary() {
  return (
    <MainLayout>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center py-4">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-green-500" />
            <h1 className="text-2xl font-bold">Strategy Library</h1>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Pre-built Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Strategy library coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
