# tRPC Hooks to Direct Fetch API Conversion Guide

**Date:** October 19, 2025  
**Purpose:** Guide for converting pages from tRPC hooks to direct fetch API  
**Reason:** tRPC React Query hooks have stability issues with batching

---

## Why Convert?

**Problem:** tRPC hooks (`trpc.*.useQuery()`) have HTTP 400 errors due to batching issues  
**Solution:** Use direct fetch API which is proven to work 100%

**Pages Already Converted:**
- ✅ AdminSystem.tsx
- ✅ AdminCoreManagement.tsx
- ✅ AdminHealth.tsx

**Pages To Convert:** 21 pages remaining

---

## Conversion Pattern

### Before (tRPC Hooks)

```typescript
import { trpc } from "@/lib/trpc";

export default function MyPage() {
  const { data: systemStatus } = trpc.nautilusCore.getSystemStatus.useQuery();
  const { data: components } = trpc.nautilusCore.getAllComponents.useQuery(undefined, {
    refetchInterval: 5000,
  });

  return (
    <div>
      <p>Status: {systemStatus?.status}</p>
      <p>Components: {components?.length}</p>
    </div>
  );
}
```

### After (Direct Fetch with API Client)

```typescript
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { SystemStatus, Component } from "@/types/api";

export default function MyPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [status, comps] = await apiClient.queryMany<[SystemStatus, Component[]]>(
        'nautilusCore.getSystemStatus',
        'nautilusCore.getAllComponents'
      );

      setSystemStatus(status);
      setComponents(comps || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !systemStatus) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <p>Status: {systemStatus?.status}</p>
      <p>Components: {components.length}</p>
    </div>
  );
}
```

---

## Step-by-Step Conversion

### Step 1: Update Imports

**Remove:**
```typescript
import { trpc } from "@/lib/trpc";
```

**Add:**
```typescript
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { SystemStatus, Component } from "@/types/api"; // Add relevant types
```

### Step 2: Replace tRPC Hooks with State

**Before:**
```typescript
const { data: systemStatus, isLoading, refetch } = trpc.nautilusCore.getSystemStatus.useQuery();
```

**After:**
```typescript
const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Step 3: Create Fetch Function

```typescript
const fetchData = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const data = await apiClient.query<SystemStatus>('nautilusCore.getSystemStatus');
    setSystemStatus(data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Step 4: Add useEffect for Auto-Fetch

```typescript
useEffect(() => {
  fetchData();

  // Optional: Auto-refresh
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
```

### Step 5: Update Data Access

**Before:**
```typescript
<p>{systemStatus?.status}</p>
```

**After:** (same, no change needed)
```typescript
<p>{systemStatus?.status}</p>
```

### Step 6: Add Loading/Error States

```typescript
if (isLoading && !systemStatus) {
  return (
    <div className="flex items-center justify-center h-96">
      <RefreshCw className="h-8 w-8 animate-spin" />
      <p>Loading...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="text-center text-red-500">
      <p>Error: {error}</p>
      <Button onClick={fetchData}>Retry</Button>
    </div>
  );
}
```

---

## API Client Methods

### Query (GET)

```typescript
// Single query
const data = await apiClient.query<SystemStatus>('nautilusCore.getSystemStatus');

// Multiple queries in parallel
const [status, components, features] = await apiClient.queryMany<[
  SystemStatus,
  Component[],
  Feature[]
]>(
  'nautilusCore.getSystemStatus',
  'nautilusCore.getAllComponents',
  'nautilusCore.getAllFeatures'
);
```

### Mutate (POST)

```typescript
// With input
const result = await apiClient.mutate('nautilusCore.restartComponent', {
  componentId: 'cache'
});

// Without input
const result = await apiClient.mutate('nautilusCore.emergencyStopAll');
```

---

## Common Patterns

### Pattern 1: Simple Query

```typescript
const [data, setData] = useState<T | null>(null);

useEffect(() => {
  apiClient.query<T>('endpoint').then(setData);
}, []);
```

### Pattern 2: Query with Loading State

```typescript
const [data, setData] = useState<T | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setIsLoading(true);
  apiClient.query<T>('endpoint')
    .then(setData)
    .finally(() => setIsLoading(false));
}, []);
```

### Pattern 3: Query with Error Handling

```typescript
const [data, setData] = useState<T | null>(null);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  apiClient.query<T>('endpoint')
    .then(setData)
    .catch(err => setError(err.message));
}, []);
```

### Pattern 4: Multiple Queries

```typescript
const [data1, setData1] = useState<T1 | null>(null);
const [data2, setData2] = useState<T2 | null>(null);

useEffect(() => {
  Promise.all([
    apiClient.query<T1>('endpoint1'),
    apiClient.query<T2>('endpoint2'),
  ]).then(([d1, d2]) => {
    setData1(d1);
    setData2(d2);
  });
}, []);
```

### Pattern 5: Auto-Refresh

```typescript
useEffect(() => {
  const fetchData = () => {
    apiClient.query<T>('endpoint').then(setData);
  };

  fetchData(); // Initial fetch

  const interval = setInterval(fetchData, 5000); // Refresh every 5s
  return () => clearInterval(interval);
}, []);
```

### Pattern 6: Manual Refresh Button

```typescript
const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await apiClient.query<T>('endpoint');
    setData(data);
  } finally {
    setIsLoading(false);
  }
};

return (
  <Button onClick={fetchData} disabled={isLoading}>
    <RefreshCw className={isLoading ? 'animate-spin' : ''} />
    Refresh
  </Button>
);
```

---

## Type Definitions

All API response types are defined in `client/src/types/api.ts`:

```typescript
import type {
  SystemStatus,
  Component,
  Feature,
  Service,
  SystemMetrics,
  TradingMetrics,
  User,
  SystemStats,
  AuditLog,
  // ... etc
} from "@/types/api";
```

---

## Checklist for Each Page

- [ ] Remove `import { trpc } from "@/lib/trpc"`
- [ ] Add `import { useState, useEffect } from "react"`
- [ ] Add `import { apiClient } from "@/lib/api-client"`
- [ ] Add type imports from `@/types/api`
- [ ] Replace tRPC hooks with useState
- [ ] Create fetchData function
- [ ] Add useEffect for auto-fetch
- [ ] Add loading state UI
- [ ] Add error state UI
- [ ] Add refresh button (optional)
- [ ] Test the page works correctly
- [ ] Verify no console errors

---

## Testing After Conversion

1. **Build:** `pnpm run build`
2. **Start:** `PORT=3015 NODE_ENV=production node dist/index.js`
3. **Open page** in browser
4. **Check:**
   - Data loads correctly
   - No console errors
   - Loading state shows
   - Refresh button works (if added)
   - Auto-refresh works (if added)

---

## Pages Priority List

### High Priority (Convert First)
1. AdminDashboard.tsx - Main dashboard
2. AdminDatabase.tsx - Database management
3. AdminLogs.tsx - System logs
4. AdminAnalytics.tsx - Analytics

### Medium Priority
5. AdminAccess.tsx
6. AdminUsers.tsx
7. AdminRisk.tsx
8. LiveTradingNew.tsx
9. LiveTrading.tsx

### Low Priority
10. Dashboard.tsx
11. Portfolio.tsx
12. Positions.tsx
13. Orders.tsx
14. TradeHistory.tsx
15. Performance.tsx
16. Reports.tsx
17. RiskAnalysis.tsx
18. StrategyBuilder.tsx
19. AdvancedBacktest.tsx
20. Demo.tsx
21. Docs.tsx
22. Home.tsx

---

## Notes

- **Don't convert all at once** - Convert and test one page at a time
- **Keep tRPC provider** - Some pages may still use it temporarily
- **Document issues** - If you find edge cases, document them
- **Ask for help** - If stuck, refer to AdminCoreManagement.tsx or AdminHealth.tsx as examples

---

**Last Updated:** October 19, 2025  
**Status:** Guide complete, ready for team use

