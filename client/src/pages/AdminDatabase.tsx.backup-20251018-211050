import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Database, RefreshCw, Download, Upload, Activity, HardDrive, Clock, Server, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AdminDatabase() {
  const { data: dbStats, isLoading, refetch } = trpc.admin.getDatabaseStats.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");

  // Real tRPC queries for Redis
  const { data: redisInfo } = trpc.admin.getRedisInfo.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const { data: redisKeyspaceData } = trpc.admin.getRedisKeyspaceStats.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const flushRedisMutation = trpc.admin.flushRedisCache.useMutation();

  // Real tRPC queries for PostgreSQL
  const { data: postgresInfo } = trpc.admin.getPostgresInfo.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const { data: postgresTables } = trpc.admin.getPostgresTables.useQuery(undefined, {
    refetchInterval: 10000,
  });

  // Real tRPC queries for Parquet
  const { data: parquetOverview } = trpc.admin.getParquetOverview.useQuery(undefined, {
    refetchInterval: 30000,
  });
  const { data: parquetDirectories } = trpc.admin.listParquetDirectories.useQuery(undefined, {
    refetchInterval: 30000,
  });

  // Prepare data for rendering with proper type casting
  const redisData = {
    connected: (redisInfo as any)?.connected || false,
    version: (redisInfo as any)?.version || "unknown",
    uptime: (redisInfo as any)?.uptime_formatted || "0d 0h 0m",
    memory: {
      used: (redisInfo as any)?.used_memory || "0 MB",
      peak: (redisInfo as any)?.used_memory_peak || "0 MB",
      fragmentation: (redisInfo as any)?.mem_fragmentation_ratio || 0,
    },
    stats: {
      totalKeys: (redisKeyspaceData as any)?.keyspaces?.reduce((sum: number, ks: any) => sum + ks.keys, 0) || 0,
      hitRate: (redisKeyspaceData as any)?.hit_rate || 0,
      opsPerSec: (redisInfo as any)?.instantaneous_ops_per_sec || 0,
      connectedClients: (redisInfo as any)?.connected_clients || 0,
    },
    keyspaces: (redisKeyspaceData as any)?.keyspaces || [],
  };

  const postgresData = {
    connected: (postgresInfo as any)?.connected || false,
    version: (postgresInfo as any)?.version || "unknown",
    database: (postgresInfo as any)?.database || "nautilus",
    tables: (postgresTables as any) || [],
    stats: {
      totalSize: (postgresInfo as any)?.size || "0 B",
      activeConnections: (postgresInfo as any)?.connections?.active || 0,
      maxConnections: (postgresInfo as any)?.connections?.max || 100,
      cacheHitRate: (postgresInfo as any)?.cache_hit_rate || 0,
    },
  };

  const parquetData = {
    directories: (parquetDirectories as any) || [],
    totalSize: (parquetOverview as any)?.total_size || "0 B",
    totalFiles: (parquetOverview as any)?.total_files || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Database Management</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage all database backends (TiDB, Redis, PostgreSQL, Parquet)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Backup All
            </Button>
          </div>
        </div>

        {/* Database Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TiDB (Interface)</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dbStats?.connected ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="destructive">Disconnected</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {dbStats?.tableCount || 0} tables, {dbStats?.totalRecords || 0} records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redis (Cache)</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {redisData.connected ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="destructive">Disconnected</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {redisData.stats.totalKeys.toLocaleString()} keys, {redisData.memory.used}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PostgreSQL (History)</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {postgresData.connected ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="destructive">Disconnected</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {postgresData.tables.length} tables, {postgresData.stats.totalSize}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parquet (Archive)</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="default" className="bg-green-500">Ready</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {parquetData.totalFiles} files, {parquetData.totalSize}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Database Tabs */}
        <Tabs defaultValue="tidb" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tidb">TiDB (Interface)</TabsTrigger>
            <TabsTrigger value="redis">Redis (Cache)</TabsTrigger>
            <TabsTrigger value="postgres">PostgreSQL (History)</TabsTrigger>
            <TabsTrigger value="parquet">Parquet (Archive)</TabsTrigger>
          </TabsList>

          {/* TiDB Tab */}
          <TabsContent value="tidb" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TiDB Database Tables</CardTitle>
                <CardDescription>
                  Web interface tables (users, strategies, backtests, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading tables...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Table Name</th>
                          <th className="text-left py-3 px-4">Type</th>
                          <th className="text-right py-3 px-4">Records</th>
                          <th className="text-right py-3 px-4">Size</th>
                          <th className="text-right py-3 px-4">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbStats?.tables?.map((table: any) => (
                          <tr key={table.name} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium font-mono text-sm">
                              {table.name}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={table.type === 'core' ? 'default' : 'secondary'}>
                                {table.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-sm">
                              {table.records?.toLocaleString() || 0}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                              {table.size || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                              {table.lastUpdated 
                                ? new Date(table.lastUpdated).toLocaleString()
                                : 'N/A'}
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground">
                              No tables found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redis Tab */}
          <TabsContent value="redis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Redis Server Info</CardTitle>
                  <CardDescription>Connection and server details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">{redisData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium">{redisData.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Connected Clients</span>
                    <span className="text-sm font-medium">{redisData.stats.connectedClients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Operations/sec</span>
                    <span className="text-sm font-medium">{redisData.stats.opsPerSec.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>Redis memory statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Used Memory</span>
                    <span className="text-sm font-medium">{redisData.memory.used}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peak Memory</span>
                    <span className="text-sm font-medium">{redisData.memory.peak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fragmentation Ratio</span>
                    <span className="text-sm font-medium">{redisData.memory.fragmentation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Keys</span>
                    <span className="text-sm font-medium">{redisData.stats.totalKeys.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
                <CardDescription>Hit rate and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Cache Hit Rate</span>
                      <span className="text-sm font-medium">{redisData.stats.hitRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${redisData.stats.hitRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Scan Keys
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="mr-2 h-4 w-4" />
                      Monitor
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Flush Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keyspace Statistics</CardTitle>
                <CardDescription>Database keyspace information</CardDescription>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Database</th>
                      <th className="text-right py-3 px-4">Keys</th>
                      <th className="text-right py-3 px-4">Expires</th>
                      <th className="text-right py-3 px-4">Avg TTL (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(redisData.keyspaces) && redisData.keyspaces.length > 0 ? redisData.keyspaces.map((ks: any) => (
                      <tr key={ks.db} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{ks.db}</td>
                        <td className="py-3 px-4 text-right font-mono">{ks.keys.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono">{ks.expires}</td>
                        <td className="py-3 px-4 text-right font-mono">{ks.avgTtl}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-muted-foreground">
                          No keyspaces found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PostgreSQL Tab */}
          <TabsContent value="postgres" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">{postgresData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <span className="text-sm font-medium">{postgresData.database}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Connections</span>
                    <span className="text-sm font-medium">
                      {postgresData.stats.activeConnections} / {postgresData.stats.maxConnections}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Storage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Size</span>
                    <span className="text-sm font-medium">{postgresData.stats.totalSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tables</span>
                    <span className="text-sm font-medium">{postgresData.tables.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                    <span className="text-sm font-medium">{postgresData.stats.cacheHitRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Vacuum
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Activity className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Backup
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Nautilus Tables</CardTitle>
                <CardDescription>
                  Historical trading data tables (instruments, orders, trades, positions, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Table Name</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-right py-3 px-4">Records</th>
                      <th className="text-right py-3 px-4">Size</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(postgresData.tables) && postgresData.tables.length > 0 ? (
                      postgresData.tables.map((table: any) => (
                        <tr key={table.name} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium font-mono text-sm">
                            {table.name}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="default">{table.type}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-sm">
                            {table.records?.toLocaleString() || 0}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                            {table.size || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                          No tables found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parquet Tab */}
          <TabsContent value="parquet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parquet Storage Overview</CardTitle>
                <CardDescription>
                  Archive storage for backtesting data and historical market data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Files</div>
                    <div className="text-2xl font-bold">{parquetData.totalFiles}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Size</div>
                    <div className="text-2xl font-bold">{parquetData.totalSize}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Directories</div>
                    <div className="text-2xl font-bold">{parquetData.directories.length}</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>

                    {Array.isArray(parquetData.directories) && parquetData.directories.length > 0 ? parquetData.directories.map((dir: any) => (
                  <div key={dir.name} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{dir.name}/</h3>
                        <p className="text-sm text-muted-foreground">{dir.path}</p>
                      </div>
                      <Badge variant="secondary">{dir.files.length} files</Badge>
                    </div>
                    
                    {dir.files.length > 0 ? (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 text-sm">File Name</th>
                            <th className="text-right py-2 px-3 text-sm">Size</th>
                            <th className="text-right py-2 px-3 text-sm">Records</th>
                            <th className="text-right py-2 px-3 text-sm">Modified</th>
                            <th className="text-right py-2 px-3 text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                                {Array.isArray(dir.files) && dir.files.length > 0 ? dir.files.map((file: any) => (
                            <tr key={file.name} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-3 font-mono text-sm">{file.name}</td>
                              <td className="py-2 px-3 text-right text-sm">{file.size}</td>
                              <td className="py-2 px-3 text-right font-mono text-sm">
                                {file.records.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right text-sm text-muted-foreground">
                                {new Date(file.modified).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <div className="flex gap-1 justify-end">
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={5} className="text-center py-4 text-muted-foreground text-sm">
                                No files
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg">
                        No files in this directory
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No parquet directories found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

