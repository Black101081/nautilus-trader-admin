import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminAPIKeys() {
  const [apiKeys] = useState([
    {
      id: "1",
      name: "Production Trading Bot",
      key: "ntk_prod_abc123...",
      user: "trader@example.com",
      permissions: ["read", "trade", "withdraw"],
      lastUsed: "2 hours ago",
      created: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Backtest Engine",
      key: "ntk_test_xyz789...",
      user: "dev@example.com",
      permissions: ["read"],
      lastUsed: "5 minutes ago",
      created: "2024-02-01",
      status: "active",
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      key: "ntk_analytics_def456...",
      user: "analyst@example.com",
      permissions: ["read"],
      lastUsed: "1 day ago",
      created: "2024-01-20",
      status: "active",
    },
  ]);

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRevoke = (id: string) => {
    toast.warning(`API key ${id} revoked`);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-muted-foreground">Manage API access keys</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiKeys.length}</div>
              <p className="text-xs text-muted-foreground">Active API keys</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Keys used today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests Today</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground">API requests</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{key.name}</CardTitle>
                    <CardDescription>{key.user}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{key.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRevoke(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">API Key</p>
                    <p className="font-mono text-sm">
                      {showKeys[key.id] ? key.key : "••••••••••••••••"}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Permissions</p>
                      <div className="flex gap-1 mt-1">
                        {key.permissions.map((perm) => (
                          <Badge key={perm} variant="outline">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Used</p>
                      <p className="font-semibold">{key.lastUsed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-semibold">{key.created}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
