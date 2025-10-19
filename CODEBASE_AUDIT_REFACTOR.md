# Codebase Audit & Refactor Plan

**Date**: October 19, 2025  
**Purpose**: Audit entire codebase, identify what's used/unused, refactor to modular architecture

---

## 📊 Current State Analysis

### Project Structure
```
nautilus-trader-admin/
├── client/              # Frontend (React + TypeScript)
├── server/              # Backend (Node.js + Python bridge)
├── docs/                # MkDocs documentation
├── site/                # Built documentation site
├── shared/              # Shared types/utilities
├── nautilus-data/       # Nautilus trading data
├── docker/              # Docker configs
├── scripts/             # Build/deploy scripts
└── tests/               # Test suites
```

### File Count
- **Main pages**: 31 files
- **Admin pages (new)**: 8 files  
- **Admin pages (old)**: 16 files (backup)
- **Total**: 55 page components

---

## 🎯 Modular Architecture Assessment

### ✅ What Follows Modular Pattern

#### 1. Server Modules (Good Structure)
```
server/modules/
├── admin/          # Admin functionality
├── analytics/      # Analytics module
├── auth/           # Authentication
├── nautilus/       # Nautilus Core integration
├── shared/         # Shared utilities
└── trading/        # Trading operations
```
**Status**: ✅ Well-organized, modular

#### 2. Client Services (New, Good)
```
client/src/services/
├── databaseService.ts
├── componentService.ts
├── featureService.ts
├── serviceManagementService.ts
├── adapterService.ts
├── monitoringService.ts
└── settingsService.ts
```
**Status**: ✅ Follows service pattern

#### 3. Admin Components (New, Good)
```
client/src/components/admin/
├── cards/
│   ├── MetricCard.tsx
│   ├── ComponentCard.tsx
│   └── AdapterCard.tsx
├── controls/
│   ├── FeatureToggle.tsx
│   └── ServiceControl.tsx
├── ui/
│   ├── StatusBadge.tsx
│   └── LogViewer.tsx
└── charts/
    └── MetricChart.tsx
```
**Status**: ✅ Well-organized by type

---

### ⚠️ What Needs Refactoring

#### 1. Pages Directory (Mixed Structure)
```
client/src/pages/
├── *.tsx (31 files)      # Mixed: landing, trader, docs, etc.
├── admin/ (8 files)      # New admin pages
└── admin-old/ (16 files) # Old admin pages (backup)
```
**Issues**:
- Too many files in root
- No clear categorization
- Mixed concerns

**Should Be**:
```
client/src/pages/
├── landing/         # Landing & marketing
├── trader/          # Trading dashboard pages
├── admin/           # Admin pages (current)
├── docs/            # Documentation pages
└── _archive/        # Old/unused pages
```

#### 2. Components Directory (Flat Structure)
```
client/src/components/
├── AdminSidebar.tsx
├── ErrorBoundary.tsx
├── Toast.tsx
├── admin/           # Admin components (good)
└── ui/              # UI components
```
**Issues**:
- Some components in root
- Should be categorized

**Should Be**:
```
client/src/components/
├── layout/          # Layout components (Sidebar, etc.)
├── feedback/        # Toast, ErrorBoundary
├── admin/           # Admin-specific (current)
└── ui/              # Shared UI components
```

---

## 🗑️ Unused/Old Code to Archive

### 1. Old Admin Pages (Already Backed Up)
```
client/src/pages/admin-old/
├── AdminComponents.tsx
├── AdminDatabase.tsx
├── AdminFeatures.tsx
... (16 files total)
```
**Action**: ✅ Already in admin-old/, keep as backup

### 2. Potentially Unused Pages
Need to check App.tsx routes to identify:
- Pages not in routing
- Duplicate functionality
- Deprecated features

### 3. Unused Dependencies
Check package.json for:
- Unused npm packages
- Outdated dependencies
- Dev dependencies in production

---

## 🔧 Refactoring Plan

### Phase 1: Audit Routes (30 min)
1. List all routes in App.tsx
2. List all page files
3. Identify unused pages
4. Move to `_archive/`

### Phase 2: Reorganize Pages (1 hour)
1. Create category folders
2. Move pages to categories
3. Update imports in App.tsx
4. Test all routes

### Phase 3: Reorganize Components (30 min)
1. Create category folders
2. Move components
3. Update imports
4. Test build

### Phase 4: Clean Services (30 min)
1. Verify all 7 services are needed
2. Check for duplicate code
3. Consolidate if possible

### Phase 5: Update Documentation (30 min)
1. Document new structure
2. Update architecture docs
3. Create import guide

**Total Time**: 3.5 hours

---

## 📝 Sandbox Limitations & Available Tools

### ✅ What I CAN Use in Sandbox

#### System Tools
- ✅ `node` (v22.13.0)
- ✅ `pnpm` (package manager)
- ✅ `python3.11`
- ✅ `git` (version control)
- ✅ `curl` (HTTP requests)
- ✅ `grep`, `find`, `sed` (text processing)
- ✅ `tree` (directory visualization)

#### Development Tools
- ✅ TypeScript/JavaScript
- ✅ React 18
- ✅ Vite (build tool)
- ✅ Tailwind CSS
- ✅ MkDocs (documentation)

#### Pre-installed Packages
- ✅ `bc` (calculator)
- ✅ `zip`, `unzip`, `tar`, `gzip`
- ✅ `less`, `cat`, `head`, `tail`
- ✅ `wget` (download files)

#### Python Packages
- ✅ `beautifulsoup4`
- ✅ `pandas`, `numpy`
- ✅ `matplotlib`, `plotly`
- ✅ `fastapi`, `flask`
- ✅ `requests`

#### Custom Utilities
- ✅ `manus-render-diagram` (mermaid, d2, plantuml)
- ✅ `manus-md-to-pdf`
- ✅ `manus-speech-to-text`
- ✅ `manus-upload-file`

---

### ❌ What I CANNOT Use

#### Not Available
- ❌ Docker (can't run containers in sandbox)
- ❌ Database servers (PostgreSQL, MySQL, Redis)
- ❌ External services (AWS, GCP, etc.)
- ❌ GUI applications
- ❌ System-level installations (apt install blocked)

#### Workarounds
- Use demo/mock data instead of real databases
- Use file-based storage instead of Redis
- Use HTTP APIs instead of direct DB connections
- Use Nautilus Bridge (Python) for Nautilus Core

---

## 🎯 Memory Update: What's Actually Being Used

### Active Pages (8 Admin + 23 Other = 31 Total)

#### Admin Pages (NEW - All Active)
1. ✅ `/admin` - AdminDashboard.tsx
2. ✅ `/admin/components-page` - ComponentsPage.tsx
3. ✅ `/admin/features` - FeaturesPage.tsx
4. ✅ `/admin/adapters` - AdaptersPage.tsx
5. ✅ `/admin/monitoring` - MonitoringPage.tsx
6. ✅ `/admin/settings-page` - SettingsPage.tsx
7. ✅ `/admin/database` - DatabasePage.tsx
8. ✅ `/admin/components` - ComponentShowcase.tsx (dev)

#### Other Active Pages (Need to verify in App.tsx)
- Landing.tsx
- Dashboard.tsx
- TraderDashboard.tsx
- LiveTrading.tsx
- ... (need full audit)

### Active Components

#### Layout
- ✅ AdminSidebar.tsx (admin navigation)
- ✅ ErrorBoundary.tsx (error handling)

#### Feedback
- ✅ Toast.tsx (notifications)

#### Admin Components (8 components)
- ✅ MetricCard, ComponentCard, AdapterCard
- ✅ FeatureToggle, ServiceControl
- ✅ StatusBadge, LogViewer
- ✅ MetricChart

### Active Services (7 services)
- ✅ databaseService.ts
- ✅ componentService.ts
- ✅ featureService.ts
- ✅ serviceManagementService.ts
- ✅ adapterService.ts
- ✅ monitoringService.ts
- ✅ settingsService.ts

### Active Utilities
- ✅ logger.ts (development logging)

---

## 🚀 Immediate Actions

### 1. Route Audit (Do Now)
```bash
# Extract all routes from App.tsx
grep -E "Route path=" client/src/App.tsx

# List all page files
find client/src/pages -name "*.tsx" -type f

# Compare and identify unused
```

### 2. Move Unused to Archive
```bash
# Create archive directory
mkdir -p client/src/pages/_archive

# Move unused pages
mv client/src/pages/UnusedPage.tsx client/src/pages/_archive/
```

### 3. Reorganize Active Pages
```bash
# Create category folders
mkdir -p client/src/pages/{landing,trader,admin,docs}

# Move pages to categories
# Update imports
```

### 4. Update Documentation
- Document new structure
- Update import paths
- Create migration guide

---

## 📊 Success Criteria

### After Refactor:
1. ✅ All active code in logical folders
2. ✅ All unused code in `_archive/` or `_backup/`
3. ✅ Clear separation of concerns
4. ✅ Updated documentation
5. ✅ All routes still working
6. ✅ Build succeeds
7. ✅ No broken imports

### Memory Updated:
1. ✅ Know exactly what's being used
2. ✅ Know what's available in sandbox
3. ✅ Know what's NOT available
4. ✅ Clear mental model of architecture

---

## 🎯 Next Steps

**Immediate** (Now):
1. Run route audit
2. Identify unused pages
3. Create refactor plan
4. Get approval

**After Approval** (3.5 hours):
1. Execute refactor
2. Test everything
3. Update docs
4. Commit changes

---

**Status**: Ready to begin audit  
**Estimated Time**: 3.5 hours  
**Risk**: Low (can rollback via git)  
**Value**: HIGH (clean codebase, clear architecture)

