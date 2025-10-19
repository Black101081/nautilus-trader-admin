# Technical Implementation Guide - Button Functionality

**Document Version**: 1.0  
**Date**: October 19, 2025  
**Purpose**: Complete technical guide for implementing button functionality across all admin pages

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Implementation Workflow](#implementation-workflow)
5. [Step-by-Step Guide](#step-by-step-guide)
6. [Code Examples](#code-examples)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

---

## Overview

### Current State

**What Exists**:
- ✅ 7 service files with 60 methods
- ✅ Toast notification system (Toast.tsx, useToast hook)
- ✅ 7 admin pages with UI complete
- ✅ ~318 buttons/controls rendered

**What's Missing**:
- ❌ Integration of services into pages
- ❌ Toast notifications in UI
- ❌ Button click handlers
- ❌ Loading states
- ❌ Error handling in UI

### Goal

Make all 318 buttons/controls functional by:
1. Integrating services into pages
2. Adding toast notifications
3. Implementing loading states
4. Handling errors gracefully
5. Providing user feedback

---

## Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│         UI Layer (Pages)            │
│  - User interactions                │
│  - Visual feedback (toasts)         │
│  - Loading states                   │
└──────────────┬──────────────────────┘
               │
               │ useToast hook
               │ service imports
               │
┌──────────────▼──────────────────────┐
│      Service Layer (Services)       │
│  - Business logic                   │
│  - API calls                        │
│  - Demo mode fallback               │
└──────────────┬──────────────────────┘
               │
               │ fetch()
               │
┌──────────────▼──────────────────────┐
│       API Layer (Backend)           │
│  - Nautilus Bridge                  │
│  - tRPC endpoints                   │
│  - Python integration               │
└─────────────────────────────────────┘
```

### Data Flow

```
User Click → Handler → Service → API → Response → Toast → UI Update
     ↓          ↓         ↓       ↓        ↓        ↓        ↓
  Button    Loading   Fetch   Backend  Success  Success   Hide
  Click     State     Call    Process  /Error   Message   Loading
```

---

## Prerequisites

### Files Already Created

1. **Services** (7 files):
   - `client/src/services/databaseService.ts`
   - `client/src/services/componentService.ts`
   - `client/src/services/featureService.ts`
   - `client/src/services/serviceManagementService.ts`
   - `client/src/services/adapterService.ts`
   - `client/src/services/monitoringService.ts`
   - `client/src/services/settingsService.ts`

2. **Toast System**:
   - `client/src/components/Toast.tsx`
   - Exports: `Toast`, `ToastContainer`, `useToast`

3. **Pages** (7 files):
   - `client/src/pages/admin/AdminDashboard.tsx`
   - `client/src/pages/admin/ComponentsPage.tsx`
   - `client/src/pages/admin/FeaturesPage.tsx`
   - `client/src/pages/admin/AdaptersPage.tsx`
   - `client/src/pages/admin/MonitoringPage.tsx`
   - `client/src/pages/admin/DatabasePage.tsx`
   - `client/src/pages/admin/SettingsPage.tsx`

### Required Knowledge

- React hooks (useState, useEffect)
- Async/await patterns
- TypeScript basics
- Service layer pattern

---

## Implementation Workflow

### Phase-by-Phase Approach

```
Phase 1: Setup (per page)
  ├─ Import useToast hook
  ├─ Import required services
  ├─ Add ToastContainer to JSX
  └─ Create loading state

Phase 2: Handlers (per button)
  ├─ Create async handler function
  ├─ Add loading state management
  ├─ Call service method
  ├─ Handle success/error
  └─ Show toast notification

Phase 3: UI Integration
  ├─ Connect handler to onClick
  ├─ Add loading spinner
  ├─ Disable button during loading
  └─ Update UI after success

Phase 4: Testing
  ├─ Test button click
  ├─ Verify toast appears
  ├─ Check loading state
  ├─ Test error scenarios
  └─ Verify demo mode fallback
```

### Time Estimates

| Phase | Time per Page | Notes |
|-------|---------------|-------|
| Phase 1: Setup | 15 min | One-time per page |
| Phase 2: Handlers | 5-10 min per button | Depends on complexity |
| Phase 3: UI Integration | 5 min per button | Straightforward |
| Phase 4: Testing | 30 min | Test all buttons |
| **Total** | **2-3 hours per page** | For average page |

---

## Step-by-Step Guide

### Step 1: Page Setup (15 minutes)

#### 1.1 Import Dependencies

Add these imports at the top of your page file:

```typescript
// Toast system
import { ToastContainer } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

// Services (import only what you need)
import { databaseService } from '../../services/databaseService';
import { componentService } from '../../services/componentService';
// ... other services as needed
```

#### 1.2 Add useToast Hook

Inside your component function:

```typescript
const YourPage = () => {
  // Add toast hook
  const { toasts, removeToast, success, error, warning, info } = useToast();
  
  // Add loading state
  const [loading, setLoading] = useState<string | null>(null);
  
  // ... rest of component
};
```

#### 1.3 Add ToastContainer to JSX

At the top of your return statement:

```typescript
return (
  <div className="p-6">
    {/* Toast Container - MUST be first */}
    <ToastContainer toasts={toasts} onRemove={removeToast} />
    
    {/* Rest of your UI */}
    <h1>Page Title</h1>
    {/* ... */}
  </div>
);
```

---

### Step 2: Create Button Handlers (10 minutes per button)

#### 2.1 Basic Handler Pattern

```typescript
const handleOperationName = async () => {
  // 1. Set loading state (use unique ID)
  setLoading('operation-name');
  
  // 2. Show info toast (optional)
  info('Starting operation...');
  
  try {
    // 3. Call service
    const result = await serviceName.methodName();
    
    // 4. Handle success
    if (result.success) {
      success(result.message);
      // Optional: Update local state, refresh data, etc.
    } else {
      error('Operation failed');
    }
  } catch (err) {
    // 5. Handle error
    error('An error occurred');
    console.error('Operation error:', err);
  } finally {
    // 6. Clear loading state
    setLoading(null);
  }
};
```

#### 2.2 Handler with Confirmation

For destructive operations (delete, flush, etc.):

```typescript
const handleDestructiveOperation = async () => {
  // 1. Confirm with user
  if (!window.confirm('Are you sure? This action cannot be undone.')) {
    return;
  }
  
  // 2. Set loading
  setLoading('destructive-op');
  info('Processing...');
  
  try {
    // 3. Call service
    const result = await serviceName.destructiveMethod();
    
    // 4. Handle result
    if (result.success) {
      success(result.message);
    } else {
      error('Operation failed');
    }
  } catch (err) {
    error('An error occurred');
  } finally {
    setLoading(null);
  }
};
```

#### 2.3 Handler with Parameters

For operations that need input:

```typescript
const handleParameterizedOperation = async (itemId: string, itemName: string) => {
  setLoading(`operation-${itemId}`);
  info(`Processing ${itemName}...`);
  
  try {
    const result = await serviceName.methodWithParams(itemId);
    
    if (result.success) {
      success(`${itemName} ${result.message}`);
    } else {
      error(`Failed to process ${itemName}`);
    }
  } catch (err) {
    error(`Error processing ${itemName}`);
  } finally {
    setLoading(null);
  }
};
```

---

### Step 3: UI Integration (5 minutes per button)

#### 3.1 Connect Handler to Button

Update your button JSX:

```typescript
<button
  onClick={handleOperationName}
  disabled={loading === 'operation-name'}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading === 'operation-name' ? (
    <>
      <svg className="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      Processing...
    </>
  ) : (
    <>
      <Icon className="h-4 w-4 inline mr-2" />
      Button Text
    </>
  )}
</button>
```

#### 3.2 Simplified with Existing Icons

If you already have icons:

```typescript
<button
  onClick={handleOperationName}
  disabled={loading === 'operation-name'}
  className="..."
>
  {loading === 'operation-name' ? (
    <ArrowPathIcon className="h-4 w-4 animate-spin" />
  ) : (
    <YourIcon className="h-4 w-4" />
  )}
  Button Text
</button>
```

---

### Step 4: Testing (30 minutes per page)

#### 4.1 Manual Testing Checklist

For each button:

- [ ] Click button
- [ ] Verify info toast appears (if applicable)
- [ ] Verify button shows loading state (spinner)
- [ ] Verify button is disabled during operation
- [ ] Wait for operation to complete
- [ ] Verify success/error toast appears
- [ ] Verify toast auto-dismisses after 5 seconds
- [ ] Verify button returns to normal state
- [ ] Test in demo mode (API unavailable)
- [ ] Test error scenario (if possible)

#### 4.2 Console Verification

Open browser console and verify:

```
✓ No errors in console
✓ Service method called
✓ Demo mode message (if API unavailable)
✓ Success/error logged
```

#### 4.3 Network Tab Verification

Check Network tab:

```
✓ API request sent (if backend available)
✓ 400 error handled gracefully (demo mode)
✓ No infinite loops
✓ Request completed
```

---

## Code Examples

### Example 1: Database Page (Complete Implementation)

```typescript
import React, { useState } from 'react';
import { ToastContainer } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { databaseService } from '../../services/databaseService';

const DatabasePage = () => {
  const { toasts, removeToast, success, error, info } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  // Handler 1: Backup PostgreSQL
  const handleBackupPostgreSQL = async () => {
    setLoading('backup-postgres');
    info('Starting PostgreSQL backup...');
    
    try {
      const result = await databaseService.backupPostgreSQL();
      if (result.success) {
        success(result.message);
      } else {
        error('Backup failed');
      }
    } catch (err) {
      error('Backup error occurred');
    } finally {
      setLoading(null);
    }
  };

  // Handler 2: Optimize PostgreSQL
  const handleOptimizePostgreSQL = async () => {
    setLoading('optimize-postgres');
    info('Optimizing PostgreSQL database...');
    
    try {
      const result = await databaseService.optimizePostgreSQL();
      if (result.success) {
        success(result.message);
      } else {
        error('Optimization failed');
      }
    } catch (err) {
      error('Optimization error occurred');
    } finally {
      setLoading(null);
    }
  };

  // Handler 3: Flush Redis (with confirmation)
  const handleFlushRedis = async () => {
    if (!window.confirm('Are you sure you want to flush Redis cache? This will clear all cached data.')) {
      return;
    }
    
    setLoading('flush-redis');
    info('Flushing Redis cache...');
    
    try {
      const result = await databaseService.flushRedis();
      if (result.success) {
        success(result.message);
      } else {
        error('Flush failed');
      }
    } catch (err) {
      error('Flush error occurred');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6">Database Management</h1>
      
      {/* PostgreSQL Card */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">PostgreSQL Cache</h2>
        
        <div className="flex gap-4">
          {/* Backup Button */}
          <button
            onClick={handleBackupPostgreSQL}
            disabled={loading === 'backup-postgres'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading === 'backup-postgres' ? 'Backing up...' : 'Backup'}
          </button>
          
          {/* Optimize Button */}
          <button
            onClick={handleOptimizePostgreSQL}
            disabled={loading === 'optimize-postgres'}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading === 'optimize-postgres' ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>
      </div>
      
      {/* Redis Card */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Redis Cache</h2>
        
        <button
          onClick={handleFlushRedis}
          disabled={loading === 'flush-redis'}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading === 'flush-redis' ? 'Flushing...' : 'Flush Cache'}
        </button>
      </div>
    </div>
  );
};

export default DatabasePage;
```

---

### Example 2: Components Page (Bulk Actions)

```typescript
import React, { useState } from 'react';
import { ToastContainer } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { componentService } from '../../services/componentService';

const ComponentsPage = () => {
  const { toasts, removeToast, success, error, info } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  // Individual component control
  const handleRestartComponent = async (componentName: string) => {
    setLoading(`restart-${componentName}`);
    info(`Restarting ${componentName}...`);
    
    try {
      const result = await componentService.restartComponent(componentName);
      if (result.success) {
        success(result.message);
      } else {
        error(`Failed to restart ${componentName}`);
      }
    } catch (err) {
      error(`Error restarting ${componentName}`);
    } finally {
      setLoading(null);
    }
  };

  // Bulk action
  const handleRestartAll = async () => {
    if (!window.confirm('Restart all components? This may cause brief service interruption.')) {
      return;
    }
    
    setLoading('restart-all');
    info('Restarting all components...');
    
    try {
      const result = await componentService.restartAll();
      if (result.success) {
        success(result.message);
      } else {
        error('Failed to restart all components');
      }
    } catch (err) {
      error('Error restarting components');
    } finally {
      setLoading(null);
    }
  };

  const components = [
    { name: 'DataEngine', status: 'running' },
    { name: 'ExecutionEngine', status: 'running' },
    { name: 'RiskEngine', status: 'running' },
  ];

  return (
    <div className="p-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Components</h1>
        
        {/* Bulk Actions */}
        <button
          onClick={handleRestartAll}
          disabled={loading === 'restart-all'}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading === 'restart-all' ? 'Restarting All...' : 'Restart All'}
        </button>
      </div>
      
      {/* Component List */}
      <div className="grid gap-4">
        {components.map((component) => (
          <div key={component.name} className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{component.name}</h3>
                <p className="text-sm text-gray-600">Status: {component.status}</p>
              </div>
              
              <button
                onClick={() => handleRestartComponent(component.name)}
                disabled={loading === `restart-${component.name}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === `restart-${component.name}` ? 'Restarting...' : 'Restart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentsPage;
```

---

### Example 3: Features Page (Toggle Pattern)

```typescript
import React, { useState } from 'react';
import { ToastContainer } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { featureService } from '../../services/featureService';

const FeaturesPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [features, setFeatures] = useState([
    { name: 'AdvancedOrders', enabled: true, category: 'Trading' },
    { name: 'RiskLimits', enabled: true, category: 'Risk' },
    { name: 'AutoHedging', enabled: false, category: 'Trading' },
  ]);

  // Toggle individual feature
  const handleToggleFeature = async (featureName: string, currentState: boolean) => {
    const newState = !currentState;
    setLoading(`toggle-${featureName}`);
    
    try {
      const result = await featureService.toggleFeature(featureName, newState);
      
      if (result.success) {
        // Update local state
        setFeatures(prev => prev.map(f => 
          f.name === featureName ? { ...f, enabled: newState } : f
        ));
        success(result.message);
      } else {
        error(`Failed to toggle ${featureName}`);
      }
    } catch (err) {
      error(`Error toggling ${featureName}`);
    } finally {
      setLoading(null);
    }
  };

  // Bulk enable
  const handleEnableAll = async () => {
    setLoading('enable-all');
    
    try {
      const featureNames = features.map(f => f.name);
      const result = await featureService.bulkEnableFeatures(featureNames);
      
      if (result.success) {
        setFeatures(prev => prev.map(f => ({ ...f, enabled: true })));
        success(result.message);
      } else {
        error('Failed to enable all features');
      }
    } catch (err) {
      error('Error enabling features');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Features</h1>
        
        <button
          onClick={handleEnableAll}
          disabled={loading === 'enable-all'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading === 'enable-all' ? 'Enabling...' : 'Enable All'}
        </button>
      </div>
      
      <div className="grid gap-4">
        {features.map((feature) => (
          <div key={feature.name} className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.category}</p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggleFeature(feature.name, feature.enabled)}
                disabled={loading === `toggle-${feature.name}`}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  feature.enabled ? 'bg-green-600' : 'bg-gray-300'
                } ${loading === `toggle-${feature.name}` ? 'opacity-50' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    feature.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
```

---

## Testing Checklist

### Per-Page Testing

```
Page: _______________

Setup:
[ ] useToast imported
[ ] Services imported
[ ] ToastContainer rendered
[ ] Loading state created

Buttons:
[ ] Button 1: _____________ - Works ✓ / Fails ✗
[ ] Button 2: _____________ - Works ✓ / Fails ✗
[ ] Button 3: _____________ - Works ✓ / Fails ✗
... (list all buttons)

Toast Notifications:
[ ] Info toast appears
[ ] Success toast appears
[ ] Error toast appears
[ ] Toast auto-dismisses (5s)
[ ] Multiple toasts stack correctly

Loading States:
[ ] Button shows loading spinner
[ ] Button is disabled during operation
[ ] Button returns to normal after operation

Error Handling:
[ ] API error handled gracefully
[ ] Demo mode works (400 error)
[ ] Console shows no unexpected errors

User Experience:
[ ] Confirmation dialogs for destructive actions
[ ] Clear feedback messages
[ ] No UI freezing
[ ] Responsive on mobile
```

---

## Troubleshooting

### Issue 1: Toast Not Appearing

**Symptoms**: Button works but no toast notification

**Causes**:
1. ToastContainer not rendered
2. useToast not called
3. Z-index too low
4. Toast removed too quickly

**Solutions**:
```typescript
// 1. Verify ToastContainer is in JSX
<ToastContainer toasts={toasts} onRemove={removeToast} />

// 2. Verify useToast is called
const { toasts, removeToast, success, error } = useToast();

// 3. Check Toast.tsx has correct z-index
className="fixed top-4 right-4 z-[9999] ..."

// 4. Check useToast hook timeout (should be 5000ms)
```

---

### Issue 2: Button Stays Disabled

**Symptoms**: Button disabled after click, never re-enables

**Cause**: Loading state not cleared in finally block

**Solution**:
```typescript
try {
  // ... operation
} catch (err) {
  // ... error handling
} finally {
  setLoading(null); // ← MUST be in finally
}
```

---

### Issue 3: Multiple Toasts Not Stacking

**Symptoms**: Only one toast visible at a time

**Cause**: Toast IDs not unique

**Solution**: Check useToast hook generates unique IDs:
```typescript
const id = Date.now().toString() + Math.random().toString(36);
```

---

### Issue 4: Demo Mode Not Working

**Symptoms**: Error toast instead of success in demo mode

**Cause**: Service not catching fetch errors

**Solution**: Verify service has try-catch:
```typescript
async operation() {
  try {
    const response = await fetch(...);
    if (!response.ok) throw new Error();
    return await response.json();
  } catch (error) {
    // Demo mode fallback
    return { success: true, message: '... (demo mode)' };
  }
}
```

---

## API Reference

### useToast Hook

```typescript
const {
  toasts,        // ToastMessage[] - Array of active toasts
  removeToast,   // (id: string) => void - Remove a toast
  success,       // (message: string) => void - Show success toast
  error,         // (message: string) => void - Show error toast
  warning,       // (message: string) => void - Show warning toast
  info,          // (message: string) => void - Show info toast
} = useToast();
```

### Service Methods Pattern

All service methods return:

```typescript
interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
  affectedCount?: number;
}
```

### Available Services

#### databaseService
- `backupPostgreSQL()` - Backup PostgreSQL database
- `optimizePostgreSQL()` - Optimize PostgreSQL
- `exportParquet()` - Export Parquet data
- `cleanParquet()` - Clean old Parquet files
- `flushRedis()` - Flush Redis cache
- `getRedisStats()` - Get Redis statistics
- `fullBackup()` - Backup all databases
- `getTableDetails(tableName)` - Get table info

#### componentService
- `startComponent(name)` - Start a component
- `stopComponent(name)` - Stop a component
- `restartComponent(name)` - Restart a component
- `getComponentConfig(name)` - Get component config
- `updateComponentConfig(name, config)` - Update config
- `startAll()` - Start all components
- `stopAll()` - Stop all components
- `restartAll()` - Restart all components

#### featureService
- `toggleFeature(name, enabled)` - Toggle feature on/off
- `bulkEnableFeatures(names[])` - Enable multiple features
- `bulkDisableFeatures(names[])` - Disable multiple features
- `getFeatureConfig(name)` - Get feature config
- `getAllFeatures()` - Get all features

#### serviceManagementService
- `startService(name)` - Start a service
- `stopService(name)` - Stop a service
- `restartService(name)` - Restart a service
- `getServiceStatus(name)` - Get service status
- `startAllServices()` - Start all services
- `stopAllServices()` - Stop all services
- `restartAllServices()` - Restart all services
- `getAllServices()` - Get all services

#### adapterService
- `connectAdapter(name)` - Connect adapter
- `disconnectAdapter(name)` - Disconnect adapter
- `testConnection(name)` - Test adapter connection
- `getAdapterConfig(name)` - Get adapter config
- `updateAdapterConfig(name, config)` - Update config
- `connectAll()` - Connect all adapters
- `disconnectAll()` - Disconnect all adapters
- `testAll()` - Test all adapters
- `exportConfig()` - Export adapter configs

#### monitoringService
- `getLogs(filters)` - Get logs with filters
- `exportLogs(format)` - Export logs to file
- `clearLogs()` - Clear all logs
- `getMetrics(component)` - Get metrics
- `exportMetrics(format)` - Export metrics
- `runHealthCheck()` - Run health check
- `runDiagnostics()` - Run diagnostics
- `getComponentDetails(name)` - Get component details

#### settingsService
- `getSettings()` - Get system settings
- `updateSettings(settings)` - Update settings
- `resetSettings()` - Reset to defaults
- `getUsers()` - Get all users
- `addUser(user)` - Add new user
- `updateUser(id, user)` - Update user
- `deleteUser(id)` - Delete user
- `getSecuritySettings()` - Get security settings
- `updateSecuritySettings(settings)` - Update security
- `regenerateApiKey()` - Regenerate API key
- `getNotificationSettings()` - Get notification settings
- `updateNotificationSettings(settings)` - Update notifications
- `testEmail()` - Test email notification
- `testSlack()` - Test Slack notification

---

## Implementation Checklist

### Overall Progress

```
[ ] Phase 1: Database Page (2-3 hours)
    [ ] Setup (imports, hooks, ToastContainer)
    [ ] 11 button handlers
    [ ] UI integration
    [ ] Testing

[ ] Phase 2: Dashboard Page (2-3 hours)
    [ ] Setup
    [ ] 8 button handlers
    [ ] UI integration
    [ ] Testing

[ ] Phase 3: Components Page (3-4 hours)
    [ ] Setup
    [ ] 24 button handlers (6 components × 4 actions)
    [ ] Bulk actions
    [ ] UI integration
    [ ] Testing

[ ] Phase 4: Features Page (4-5 hours)
    [ ] Setup
    [ ] 64 feature toggles
    [ ] 126 service controls
    [ ] Bulk actions
    [ ] UI integration
    [ ] Testing

[ ] Phase 5: Adapters Page (3-4 hours)
    [ ] Setup
    [ ] 40 button handlers (8 adapters × 5 actions)
    [ ] Bulk actions
    [ ] UI integration
    [ ] Testing

[ ] Phase 6: Monitoring Page (2-3 hours)
    [ ] Setup
    [ ] 15 button handlers
    [ ] Log filtering
    [ ] UI integration
    [ ] Testing

[ ] Phase 7: Settings Page (3-4 hours)
    [ ] Setup
    [ ] 20 button handlers
    [ ] Form submissions
    [ ] UI integration
    [ ] Testing
```

**Total Estimated Time**: 19-26 hours

---

## Conclusion

This guide provides a complete workflow for implementing button functionality across all admin pages. Follow the step-by-step process for each page, use the code examples as templates, and refer to the troubleshooting section when issues arise.

**Key Principles**:
1. Always use try-catch-finally
2. Always clear loading state in finally
3. Always show user feedback (toasts)
4. Always handle demo mode gracefully
5. Always test thoroughly

**Success Criteria**:
- All buttons functional
- Toast notifications working
- Loading states visible
- Error handling graceful
- Demo mode working
- User experience smooth

---

**Document End**

For questions or issues, refer to:
- Service implementations in `client/src/services/`
- Toast component in `client/src/components/Toast.tsx`
- Example pages in code examples section

