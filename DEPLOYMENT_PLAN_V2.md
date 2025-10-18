# 🚀 Nautilus Trader Admin - Comprehensive Deployment Plan V2

**Ngày:** 19 Tháng 10, 2025  
**Phiên bản:** 2.1 (Updated with Historical Context)  
**Trạng thái:** 📋 DRAFT - Chờ phê duyệt

---

## 📚 Document History

Deployment plan này được tạo ra dựa trên:
1. **Phân tích repo hiện tại** - Clone từ GitHub và review code
2. **Historical context** - Conversation trước về deployment Nautilus Core
3. **Existing documentation** - README, PHASE_1_FINAL_REPORT, PHASE_2_PLAN, TRADER_README
4. **Code analysis** - Review 46 pages, 7 Python modules, 9 tRPC routers

---

## 📋 Mục Lục

1. [Executive Summary](#1-executive-summary)
2. [Detailed Project Status](#2-detailed-project-status)
3. [Architecture Overview](#3-architecture-overview)
4. [Deployment Strategy](#4-deployment-strategy)
5. [Implementation Roadmap](#5-implementation-roadmap)
6. [Technical Specifications](#6-technical-specifications)
7. [Risk Assessment](#7-risk-assessment)
8. [Success Criteria](#8-success-criteria)

---

## 1. Executive Summary

### 1.1. Project Overview

**Nautilus Trader Admin** là một **comprehensive web interface** để quản trị và monitor **NautilusTrader Core** - một high-performance algorithmic trading platform.

**Hệ thống bao gồm 2 phần chính:**

#### **A. Nautilus Core** (Trading Engine)
- **Nguồn:** https://github.com/nautechsystems/nautilus_trader
- **Version:** 1.220.0 ✅ (đã cài đặt và verified)
- **Ngôn ngữ:** Rust + Python
- **Chức năng:** Backtesting, Live Trading, Risk Management, Order Management

#### **B. Web Interface** (Admin Dashboard)
- **Nguồn:** https://github.com/Black101081/nautilus-trader-admin
- **Ngôn ngữ:** TypeScript + React 19.1.1
- **Chức năng:** 
  - **Admin Section:** 15 admin pages + 6 docs pages = 21 pages
  - **Trader Section:** 23 trader pages + 2 utility pages = 25 pages
  - **Total:** 46 pages

### 1.2. Current Status

| Component | Status | Completion | Notes |
|-----------|--------|------------|-------|
| **Admin Section** | ✅ Complete | 100% | 15 admin + 6 docs pages |
| **Trader Section (Phase 1)** | ✅ Complete | 100% | 17 core trading pages |
| **Trader Section (Phase 2)** | ⚠️ Partial | ~40% | 6 pages cần hoàn thiện |
| **Backend APIs** | ✅ Mostly Complete | ~85% | Thiếu mutations |
| **Databases** | ❌ Not Setup | 0% | Cần install và configure |
| **Nautilus Core** | ✅ Ready | 100% | Installed và working |
| **Docker Setup** | ❌ Not Created | 0% | Cần tạo Dockerfiles |
| **Production Deploy** | ❌ Not Done | 0% | Chưa deploy |

**Overall Completion:** ~70%

---

## 2. Detailed Project Status

### 2.1. Frontend Pages Inventory (46 Total)

#### **Admin Section (21 pages)** ✅ 100%

**Core Admin Pages (15):**
1. ✅ AdminDashboard.tsx - System overview
2. ✅ AdminAnalytics.tsx - Analytics dashboard
3. ✅ AdminCoreManagement.tsx - Nautilus Core control ⭐
4. ✅ AdminHealth.tsx - Component health monitoring
5. ✅ AdminFeeds.tsx - Data feed management
6. ✅ AdminExecution.tsx - Execution management
7. ✅ AdminRisk.tsx - Risk controls
8. ✅ AdminBrokers.tsx - Broker integration
9. ✅ AdminDatabase.tsx - Database management ⭐
10. ✅ AdminUsers.tsx - User management
11. ✅ AdminAccess.tsx - Access control
12. ✅ AdminAPIKeys.tsx - API key management
13. ✅ AdminLogs.tsx - Audit logs
14. ✅ AdminSettings.tsx - System settings
15. ✅ AdminSystem.tsx - System configuration

**Documentation Pages (6):**
16. ✅ Docs.tsx - Documentation hub
17. ✅ DocsGettingStarted.tsx - Getting started guide
18. ✅ DocsUserGuide.tsx - User guide
19. ✅ DocsAPI.tsx - API documentation
20. ✅ DocsArchitecture.tsx - Architecture docs
21. ✅ DocsDatabase.tsx - Database docs
22. ✅ DocsTroubleshooting.tsx - Troubleshooting guide

#### **Trader Section (25 pages)** ⚠️ ~68%

**Phase 1 - Core Trading Pages (17)** ✅ 100%
1. ✅ TraderDashboard.tsx - Trader overview
2. ✅ Portfolio.tsx - Portfolio management (4 cards, 3 tabs)
3. ✅ Positions.tsx - Position tracking (filters, close functionality)
4. ✅ Orders.tsx - Order management (4 tabs, cancel functionality)
5. ✅ TradeHistory.tsx - Trade history (10-column table)
6. ✅ Performance.tsx - Performance analytics (KPIs, 3 tabs)
7. ✅ RiskAnalysis.tsx - Risk monitoring (limits, alerts)
8. ✅ Optimization.tsx - Strategy optimization
9. ✅ WalkForward.tsx - Walk-forward analysis
10. ✅ TradeJournal.tsx - Trade journaling
11. ✅ Reports.tsx - Report generation
12. ✅ Dashboard.tsx - Main dashboard
13. ✅ Home.tsx - Home page
14. ✅ Landing.tsx - Landing page
15. ✅ Demo.tsx - Demo page
16. ✅ ComponentShowcase.tsx - UI component showcase
17. ✅ NotFound.tsx - 404 page

**Phase 2 - Advanced Trading Pages (6)** ⚠️ ~40%
18. ⚠️ MarketWatch.tsx - Real-time market data (placeholder, ~5%)
19. ⚠️ LiveTrading.tsx - Live trading interface (partial, ~40%)
20. ⚠️ LiveTradingNew.tsx - New live trading UI (unknown status)
21. ⚠️ StrategyLibrary.tsx - Strategy browser (placeholder, ~5%)
22. ⚠️ DeployStrategy.tsx - Strategy deployment (unknown status)
23. ⚠️ StrategyBuilder.tsx - Strategy creation (unknown status)
24. ⚠️ AdvancedBacktest.tsx - Advanced backtesting (unknown status)

**Utility Pages (2):**
25. ✅ NotFound.tsx - 404 error page

### 2.2. Backend Components Inventory

#### **Node.js Backend (TypeScript)**

**tRPC Routers (9 routers, 1012 lines):**
```
server/routers.ts (1012 lines)
├── auth          - Authentication & authorization
├── nautilus      - Nautilus Core integration
├── strategies    - Strategy management (CRUD)
├── backtests     - Backtest management
├── trading       - Trading operations (queries only)
├── admin         - Admin operations
├── risk          - Risk management
├── analytics     - Analytics data
└── nautilusCore  - Core component monitoring
```

**Key Features:**
- ✅ Type-safe tRPC endpoints
- ✅ Authentication middleware
- ✅ Rate limiting
- ✅ Security middleware
- ✅ Error handling
- ❌ Trading mutations (missing)
- ❌ WebSocket server (missing)

#### **Python Bridge (7 modules)**

**Core Python Modules:**
1. ✅ **nautilus_bridge.py** (346 lines)
   - NautilusCoreManager class
   - System status monitoring
   - Component health checks
   - System metrics (CPU, memory, disk, network)
   - Trading metrics
   - Logs management
   - Component control (start/stop/restart)
   - Adapter management
   - Emergency stop functionality

2. ✅ **postgres_manager.py**
   - PostgreSQL connection management
   - Table creation and management
   - Query execution
   - Data retrieval

3. ✅ **redis_manager.py**
   - Redis connection management
   - Cache operations
   - Live trading state management

4. ✅ **parquet_manager.py**
   - Parquet file management
   - Historical data storage
   - Backtest archive management

5. ✅ **feature_manager.py**
   - Feature flag management
   - 64 Nautilus features tracked

6. ✅ **nautilus_api.py**
   - API wrapper for Nautilus Core
   - Strategy execution
   - Backtest execution

7. ✅ **populate_database.py** (312 lines)
   - Database population script
   - Generates realistic test data
   - Supports 6 instruments (BTC, ETH, EUR/USD, GBP/USD, USD/JPY, AUD/USD)
   - Creates orders, trades, positions
   - Configurable data volume

### 2.3. Database Schema

#### **MySQL/TiDB (Web Interface Data)** - Drizzle ORM

**10 Tables Defined:**
1. ✅ **users** - User accounts (id, name, email, role, loginMethod)
2. ✅ **systemLogs** - System logs (level, category, message, metadata)
3. ✅ **auditTrail** - Audit trail (userId, action, resource, details)
4. ✅ **apiKeys** - API keys (userId, name, keyHash, permissions)
5. ✅ **riskLimits** - Risk limits (type, value, enabled)
6. ✅ **liveTrades** - Live trades (symbol, side, quantity, pnl)
7. ✅ **positions** - Positions (symbol, quantity, avgPrice, pnl)
8. ✅ **performanceMetrics** - Performance metrics (period, returns, ratios)
9. ✅ **strategies** - Strategies (name, code, parameters)
10. ✅ **backtests** - Backtests (strategyId, results, status)

**Status:** Schema defined, migrations created, **NOT deployed**

#### **PostgreSQL (Nautilus Core Data)**

**Expected Tables (created by Nautilus):**
1. instruments - Trading instruments
2. orders - Order history
3. trades - Executed trades
4. positions - Position history
5. accounts - Account snapshots
6. bars - OHLCV bar data
7. quotes - Quote tick data
8. trades_tick - Trade tick data

**Status:** **NOT installed, NOT configured**

#### **Redis (Cache & Live State)**

**Expected Key Patterns:**
- `nautilus:orders:*` - Active orders
- `nautilus:positions:*` - Open positions
- `nautilus:accounts:*` - Account state
- `nautilus:cache:*` - Cached data

**Status:** **NOT installed**

#### **Parquet (Historical Archives)**

**Directory Structure:**
```
~/nautilus-data/
├── bars/          - OHLCV bar data
├── quotes/        - Quote tick data
├── trades/        - Trade tick data
└── backtests/     - Backtest results
```

**Status:** **NOT created**

---

## 3. Architecture Overview

### 3.1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEB INTERFACE (Frontend)                      │
│                  React 19.1.1 + TypeScript + Vite                │
│                                                                   │
│  ┌────────────────────────┐  ┌────────────────────────────────┐ │
│  │   ADMIN SECTION        │  │    TRADER SECTION              │ │
│  │   (21 pages)           │  │    (25 pages)                  │ │
│  ├────────────────────────┤  ├────────────────────────────────┤ │
│  │ System Management:     │  │ Phase 1 (17 pages) ✅:        │ │
│  │ • Dashboard            │  │ • Trader Dashboard             │ │
│  │ • Analytics            │  │ • Portfolio                    │ │
│  │ • Core Management ⭐   │  │ • Positions                    │ │
│  │ • Health Monitoring    │  │ • Orders                       │ │
│  │ • Data Feeds           │  │ • Trade History                │ │
│  │ • Execution Mgmt       │  │ • Performance                  │ │
│  │ • Risk Controls        │  │ • Risk Analysis                │ │
│  │ • Broker Integration   │  │ • Optimization                 │ │
│  │ • Database Mgmt ⭐     │  │ • Walk Forward                 │ │
│  │ • User Management      │  │ • Trade Journal                │ │
│  │ • Access Control       │  │ • Reports                      │ │
│  │ • API Keys             │  │ + 6 more pages                 │ │
│  │ • Audit Logs           │  │                                 │ │
│  │ • Settings             │  │ Phase 2 (6 pages) ⚠️:         │ │
│  │ • System Config        │  │ • Market Watch (5%)            │ │
│  │                         │  │ • Live Trading (40%)           │ │
│  │ Documentation (6):     │  │ • Live Trading New (?)         │ │
│  │ • Getting Started      │  │ • Strategy Library (5%)        │ │
│  │ • User Guide           │  │ • Deploy Strategy (?)          │ │
│  │ • API Docs             │  │ • Strategy Builder (?)         │ │
│  │ • Architecture         │  │ • Advanced Backtest (?)        │ │
│  │ • Database             │  │                                 │ │
│  │ • Troubleshooting      │  │ Utility (2):                   │ │
│  └────────────────────────┘  │ • 404 Page                     │ │
│                               │ • Component Showcase           │ │
│                               └────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │ tRPC API (Type-safe)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              NODE.JS BACKEND SERVER                              │
│                    Port: 3000                                     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  tRPC Routers (9 routers, 1012 lines)                    │   │
│  │                                                            │   │
│  │  ✅ auth          - Authentication & authorization        │   │
│  │  ✅ nautilus      - Nautilus Core integration            │   │
│  │  ✅ strategies    - Strategy CRUD operations             │   │
│  │  ✅ backtests     - Backtest management                  │   │
│  │  ✅ trading       - Trading queries (positions, orders)  │   │
│  │  ✅ admin         - Admin operations                     │   │
│  │  ✅ risk          - Risk management                      │   │
│  │  ✅ analytics     - Analytics data                       │   │
│  │  ✅ nautilusCore  - Core monitoring                      │   │
│  │                                                            │   │
│  │  ❌ Missing: Trading mutations (placeOrder, etc.)        │   │
│  │  ❌ Missing: WebSocket server                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Python Bridge (7 modules)                               │   │
│  │                                                            │   │
│  │  ✅ nautilus_bridge.py    (346 lines)                    │   │
│  │     - NautilusCoreManager class                          │   │
│  │     - System status & metrics                            │   │
│  │     - Component control                                  │   │
│  │     - Adapter management                                 │   │
│  │                                                            │   │
│  │  ✅ postgres_manager.py   - PostgreSQL operations        │   │
│  │  ✅ redis_manager.py      - Redis cache operations       │   │
│  │  ✅ parquet_manager.py    - Parquet file management      │   │
│  │  ✅ feature_manager.py    - Feature flags (64 features)  │   │
│  │  ✅ nautilus_api.py       - Nautilus API wrapper         │   │
│  │  ✅ populate_database.py  (312 lines)                    │   │
│  │     - Test data generation                               │   │
│  │     - 6 instruments support                              │   │
│  │     - Realistic orders/trades/positions                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Python subprocess calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              NAUTILUS CORE (Trading Engine)                      │
│                    Version: 1.220.0 ✅                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  TradingNode / BacktestNode                              │   │
│  │  - Live trading execution                                │   │
│  │  - Backtest simulation                                   │   │
│  │  - Nanosecond resolution                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────────────┐   │
│  │  Data   │Execution│  Risk   │Portfolio│   Cache         │   │
│  │ Engine  │ Engine  │ Engine  │         │                 │   │
│  │         │         │         │         │                 │   │
│  │ Market  │ Order   │ Pre-    │ P&L     │ In-memory       │   │
│  │ data    │ lifecycle│ trade   │ tracking│ state           │   │
│  │ routing │ mgmt    │ checks  │         │                 │   │
│  └─────────┴─────────┴─────────┴─────────┴─────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Adapters (14 venues available)                          │   │
│  │                                                            │   │
│  │  Crypto Exchanges (CEX):                                 │   │
│  │  • Binance, BitMEX, Bybit, Coinbase INTX, OKX           │   │
│  │                                                            │   │
│  │  Decentralized (DEX):                                    │   │
│  │  • dYdX, Hyperliquid, Polymarket                         │   │
│  │                                                            │   │
│  │  Traditional Brokers:                                    │   │
│  │  • Interactive Brokers (Stocks, Futures, Options, FX)    │   │
│  │                                                            │   │
│  │  Sports Betting:                                         │   │
│  │  • Betfair                                               │   │
│  │                                                            │   │
│  │  Data Providers:                                         │   │
│  │  • Databento, Tardis                                     │   │
│  │                                                            │   │
│  │  Development:                                            │   │
│  │  • Sandbox, _template                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASES & STORAGE                           │
│                                                                   │
│  ┌─────────┬─────────┬─────────────┬────────────────────────┐   │
│  │  MySQL  │  Redis  │ PostgreSQL  │     Parquet            │   │
│  │ /TiDB   │         │             │                        │   │
│  │         │         │             │                        │   │
│  │ Web DB  │ Cache & │ Nautilus    │ Historical Archives    │   │
│  │ (Drizzle│ Live    │ Core Data   │ & Backtest Results     │   │
│  │  ORM)   │ State   │             │                        │   │
│  │         │         │             │                        │   │
│  │10 tables│ Live    │ 8 tables    │ ~/nautilus-data/       │   │
│  │ defined │ trading │ (created by │   bars/                │   │
│  │         │ state   │  Nautilus)  │   quotes/              │   │
│  │         │         │             │   trades/              │   │
│  │ ❌ NOT  │ ❌ NOT  │ ❌ NOT      │   backtests/           │   │
│  │ SETUP   │ SETUP   │ SETUP       │                        │   │
│  │         │         │             │ ❌ NOT CREATED         │   │
│  └─────────┴─────────┴─────────────┴────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2. Data Flow

#### **Query Flow (Read Operations)**
```
User Browser
    │
    │ HTTP Request
    ▼
React Component
    │
    │ tRPC Query
    ▼
Node.js Server (tRPC Router)
    │
    ├─► MySQL/TiDB (Web data)
    │   └─► Return: users, strategies, backtests
    │
    ├─► Python Bridge (subprocess)
    │   └─► Nautilus Core
    │       ├─► PostgreSQL (Nautilus data)
    │       │   └─► Return: positions, orders, trades
    │       │
    │       └─► Redis (Live state)
    │           └─► Return: active positions, orders
    │
    └─► Return JSON Response
        │
        ▼
React Component (render)
```

#### **Mutation Flow (Write Operations)**
```
User Action (e.g., Place Order)
    │
    ▼
React Component
    │
    │ tRPC Mutation
    ▼
Node.js Server (tRPC Router)
    │
    │ Call Python Bridge
    ▼
Python Bridge
    │
    │ Call Nautilus Core API
    ▼
Nautilus Core
    │
    ├─► ExecutionEngine
    │   └─► Place order on venue
    │
    ├─► Write to PostgreSQL
    │   └─► Order record
    │
    └─► Update Redis
        └─► Live state
```

---

## 4. Deployment Strategy

### 4.1. Deployment Options

Tôi đề xuất **3 options** với độ phức tạp tăng dần:

#### **Option 1: Monolithic (Development/Testing)** 🟢 RECOMMENDED

**Đặc điểm:**
- Tất cả components chạy trên **1 server/container**
- Node.js server spawn Python processes
- Databases chạy local hoặc managed services
- **Đơn giản nhất**, dễ debug, phù hợp cho development

**Architecture:**
```
┌──────────────────────────────────────────┐
│         Single Server/Container          │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  Web Interface (React + Node.js)   │  │
│  │  Port: 3000                        │  │
│  └────────────┬───────────────────────┘  │
│               │                           │
│  ┌────────────▼───────────────────────┐  │
│  │  Python Bridge (spawn subprocess)  │  │
│  └────────────┬───────────────────────┘  │
│               │                           │
│  ┌────────────▼───────────────────────┐  │
│  │  Nautilus Core (Python + Rust)     │  │
│  └────────────────────────────────────┘  │
│                                           │
└──────────────────┬────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Databases (External) │
        │  • MySQL/TiDB         │
        │  • Redis              │
        │  • PostgreSQL         │
        └──────────────────────┘
```

**Pros:**
- ✅ Đơn giản nhất để setup
- ✅ Dễ debug và troubleshoot
- ✅ Chi phí thấp (1 server)
- ✅ Phù hợp cho development và testing

**Cons:**
- ❌ Không scalable
- ❌ Single point of failure
- ❌ Resource contention

**Use case:** Development, Testing, Small-scale production

---

#### **Option 2: Microservices (Production)** 🟡 RECOMMENDED FOR PRODUCTION

**Đặc điểm:**
- Web Interface và Nautilus Core chạy **riêng biệt**
- Communication qua **REST API** hoặc **gRPC**
- Databases deploy riêng
- Scalable, maintainable

**Architecture:**
```
┌─────────────────────┐     ┌─────────────────────┐
│  Web Interface      │     │  Nautilus Core      │
│  (React + Node.js)  │────▶│  API Service        │
│  Port: 3000         │ HTTP│  (Python + Rust)    │
│                     │◀────│  Port: 8000         │
└─────────────────────┘     └─────────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  MySQL/TiDB         │     │  PostgreSQL         │
│  (Web DB)           │     │  (Nautilus Data)    │
│  Port: 3306/4000    │     │  Port: 5432         │
└─────────────────────┘     └─────────────────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
         ┌───────────────────────┐
         │  Redis (Cache)        │
         │  Port: 6379           │
         └───────────────────────┘
```

**Pros:**
- ✅ Scalable independently
- ✅ Better fault isolation
- ✅ Easier to maintain
- ✅ Production-ready

**Cons:**
- ❌ Phức tạp hơn
- ❌ Cần API gateway
- ❌ Chi phí cao hơn

**Use case:** Production, High traffic

---

#### **Option 3: Cloud-Native (Enterprise)** 🔴 ADVANCED

**Đặc điểm:**
- Frontend: Vercel/Netlify
- Backend API: AWS Lambda/Cloud Run
- Nautilus Core: ECS/Kubernetes
- Databases: Managed services

**Architecture:**
```
┌─────────────────────┐
│  Vercel/Netlify     │
│  (Frontend)         │
│  CDN + SSR          │
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  AWS Lambda/        │     │  ECS/Kubernetes     │
│  Cloud Run          │────▶│  (Nautilus Core)    │
│  (Node.js API)      │ gRPC│                     │
└─────────────────────┘     └─────────────────────┘
           │                         │
           ▼                         ▼
┌─────────────────────┐     ┌─────────────────────┐
│  AWS RDS/           │     │  ElastiCache/       │
│  Cloud SQL          │     │  Memorystore        │
│  (Databases)        │     │  (Redis)            │
└─────────────────────┘     └─────────────────────┘
```

**Pros:**
- ✅ Auto-scaling
- ✅ High availability
- ✅ Global CDN
- ✅ Managed infrastructure

**Cons:**
- ❌ Rất phức tạp
- ❌ Chi phí cao
- ❌ Vendor lock-in

**Use case:** Enterprise, Global scale

---

### 4.2. Recommended Approach

Tôi đề xuất **phương pháp tiếp cận từng bước**:

**Phase 1: Development (Option 1)** ← **BẮT ĐẦU TỪ ĐÂY**
- Deploy local trong sandbox
- Setup databases
- Complete Phase 2 pages
- Test integration
- **Duration:** 1-2 weeks
- **Deliverable:** Fully functional local deployment

**Phase 2: Containerization (Option 1 + Docker)**
- Create Docker setup
- Test containerized deployment
- **Duration:** 3-5 days
- **Deliverable:** Docker Compose deployment

**Phase 3: Production (Option 2)** (Optional)
- Deploy to VPS/Cloud
- Setup monitoring
- **Duration:** 1 week
- **Deliverable:** Production deployment

**Phase 4: Scale (Option 3)** (Future)
- Migrate to cloud-native
- **Duration:** 2-4 weeks
- **Deliverable:** Enterprise-grade deployment

---

## 5. Implementation Roadmap

### 5.1. Phase 1: Local Development Setup (Week 1-2)

**Goal:** Setup đầy đủ trong sandbox để development và testing

#### **Day 1-2: Database Setup** (Priority: 🔴 HIGH)

**Task 1.1: Install PostgreSQL**
```bash
# Install PostgreSQL 14
sudo apt-get update
sudo apt-get install -y postgresql-14 postgresql-client-14

# Start service
sudo service postgresql start

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE nautilus;
CREATE USER nautilus_user WITH PASSWORD 'nautilus_pass';
GRANT ALL PRIVILEGES ON DATABASE nautilus TO nautilus_user;

-- Create tables (Nautilus will auto-create on first run)
\c nautilus
CREATE TABLE IF NOT EXISTS instruments (
    instrument_id VARCHAR(64) PRIMARY KEY,
    symbol VARCHAR(64) NOT NULL,
    asset_class VARCHAR(32),
    base_currency VARCHAR(16),
    quote_currency VARCHAR(16),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(64) PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    order_type VARCHAR(32) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8),
    filled_qty DECIMAL(20,8) DEFAULT 0,
    avg_px DECIMAL(20,8),
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trades (
    trade_id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64),
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    commission DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    executed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS positions (
    position_id VARCHAR(64) PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    entry_price DECIMAL(20,8) NOT NULL,
    current_price DECIMAL(20,8),
    unrealized_pnl DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    status VARCHAR(32) NOT NULL,
    opened_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP
);

\q
EOF

# Verify connection
psql -h localhost -U nautilus_user -d nautilus -c "SELECT version();"
```

**Task 1.2: Install Redis**
```bash
# Install Redis
sudo apt-get install -y redis-server

# Start service
sudo service redis-server start

# Verify connection
redis-cli PING
# Expected: PONG
```

**Task 1.3: Setup MySQL (TiDB alternative)**
```bash
# Install MySQL 8
sudo apt-get install -y mysql-server

# Start service
sudo service mysql start

# Create database
sudo mysql << EOF
CREATE DATABASE nautilus_web;
CREATE USER 'nautilus_web'@'localhost' IDENTIFIED BY 'nautilus_web_pass';
GRANT ALL PRIVILEGES ON nautilus_web.* TO 'nautilus_web'@'localhost';
FLUSH PRIVILEGES;
EOF

# Verify connection
mysql -u nautilus_web -pnautilus_web_pass -e "SELECT DATABASE();"
```

**Task 1.4: Create Parquet directories**
```bash
mkdir -p ~/nautilus-data/{bars,quotes,trades,backtests}
```

**Task 1.5: Run Drizzle migrations**
```bash
cd /home/ubuntu/nautilus-trader-admin

# Update drizzle.config.ts with MySQL connection
# Then run migrations
pnpm run db:push
```

**Task 1.6: Populate test data**
```bash
# Populate PostgreSQL with test data
cd /home/ubuntu/nautilus-trader-admin/server
python3.11 populate_database.py

# Expected output:
# ✅ Populated 6 instruments
# ✅ Populated 50 orders
# ✅ Populated 30 trades
# ✅ Populated 15 positions
```

**Estimated Time:** 4-6 hours

---

#### **Day 3-4: Complete Phase 2 Pages** (Priority: 🔴 HIGH)

**Task 2.1: Complete MarketWatch.tsx**

Current status: Placeholder (22 lines, ~5% complete)

**Requirements:**
- Watchlist table with instruments
- Add/remove instruments functionality
- Real-time price display (mock data initially)
- Price change indicators (up/down arrows, colors)
- Volume metrics
- Market status indicators
- Filter by asset class (Crypto, FX, Stocks)

**Implementation:**
```typescript
// MarketWatch.tsx structure
import { TraderLayout } from "@/components/TraderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function MarketWatch() {
  const [filter, setFilter] = useState<'all' | 'crypto' | 'fx' | 'stocks'>('all');
  const { data: watchlist } = trpc.trading.watchlist.useQuery();
  
  return (
    <TraderLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Market Watch</h1>
          <Button>+ Add Instrument</Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Instruments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlist?.length || 0}</div>
            </CardContent>
          </Card>
          {/* More cards */}
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} 
                  onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'crypto' ? 'default' : 'outline'} 
                  onClick={() => setFilter('crypto')}>Crypto</Button>
          <Button variant={filter === 'fx' ? 'default' : 'outline'} 
                  onClick={() => setFilter('fx')}>FX</Button>
          <Button variant={filter === 'stocks' ? 'default' : 'outline'} 
                  onClick={() => setFilter('stocks')}>Stocks</Button>
        </div>
        
        {/* Watchlist Table */}
        <Card>
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Last Price</th>
                  <th>Change</th>
                  <th>Change %</th>
                  <th>Volume</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {watchlist?.map(item => (
                  <tr key={item.symbol}>
                    <td>{item.symbol}</td>
                    <td>${item.lastPrice}</td>
                    <td className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.change >= 0 ? '↑' : '↓'} ${Math.abs(item.change)}
                    </td>
                    <td className={item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.changePercent}%
                    </td>
                    <td>{item.volume}</td>
                    <td>${item.high}</td>
                    <td>${item.low}</td>
                    <td>
                      <Button size="sm" variant="ghost">Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </TraderLayout>
  );
}
```

**Backend API needed:**
```typescript
// In server/routers.ts
trading: router({
  watchlist: publicProcedure.query(async () => {
    // Return mock data or query from database
    return [
      { symbol: 'BTCUSD', lastPrice: 45000, change: 500, changePercent: 1.12, volume: 1234567, high: 46000, low: 44000 },
      // More instruments
    ];
  }),
  
  addToWatchlist: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .mutation(async ({ input }) => {
      // Add to watchlist
      return { success: true };
    }),
    
  removeFromWatchlist: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .mutation(async ({ input }) => {
      // Remove from watchlist
      return { success: true };
    }),
}),
```

**Estimated Time:** 3-4 hours

---

**Task 2.2: Complete LiveTrading.tsx**

Current status: Partial implementation (~40% complete)

**Requirements:**
- Order entry form (instrument, side, type, quantity, price)
- Position sizing calculator
- Risk calculator (stop loss, take profit)
- Place order button with confirmation
- Active orders display
- Open positions display
- Recent trades display

**Implementation:**
```typescript
// LiveTrading.tsx enhanced structure
export default function LiveTrading() {
  const [orderForm, setOrderForm] = useState({
    instrument: '',
    side: 'BUY',
    type: 'MARKET',
    quantity: 0,
    price: 0,
    stopLoss: 0,
    takeProfit: 0,
  });
  
  const placeOrder = trpc.trading.placeOrder.useMutation();
  
  const handlePlaceOrder = async () => {
    // Confirmation dialog
    const confirmed = window.confirm('Place order?');
    if (!confirmed) return;
    
    // Place order
    await placeOrder.mutateAsync(orderForm);
  };
  
  return (
    <TraderLayout>
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Order Entry */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {/* Instrument selector */}
              <div>
                <label>Instrument</label>
                <select value={orderForm.instrument} 
                        onChange={(e) => setOrderForm({...orderForm, instrument: e.target.value})}>
                  <option value="">Select...</option>
                  <option value="BTCUSD">BTC/USD</option>
                  <option value="ETHUSD">ETH/USD</option>
                </select>
              </div>
              
              {/* Side selector */}
              <div className="flex gap-2">
                <Button variant={orderForm.side === 'BUY' ? 'default' : 'outline'}
                        onClick={() => setOrderForm({...orderForm, side: 'BUY'})}>
                  Buy
                </Button>
                <Button variant={orderForm.side === 'SELL' ? 'default' : 'outline'}
                        onClick={() => setOrderForm({...orderForm, side: 'SELL'})}>
                  Sell
                </Button>
              </div>
              
              {/* Order type */}
              <div>
                <label>Order Type</label>
                <select value={orderForm.type}
                        onChange={(e) => setOrderForm({...orderForm, type: e.target.value})}>
                  <option value="MARKET">Market</option>
                  <option value="LIMIT">Limit</option>
                  <option value="STOP">Stop</option>
                </select>
              </div>
              
              {/* Quantity */}
              <div>
                <label>Quantity</label>
                <input type="number" value={orderForm.quantity}
                       onChange={(e) => setOrderForm({...orderForm, quantity: parseFloat(e.target.value)})} />
              </div>
              
              {/* Price (if limit order) */}
              {orderForm.type !== 'MARKET' && (
                <div>
                  <label>Price</label>
                  <input type="number" value={orderForm.price}
                         onChange={(e) => setOrderForm({...orderForm, price: parseFloat(e.target.value)})} />
                </div>
              )}
              
              {/* Risk Management */}
              <div>
                <label>Stop Loss</label>
                <input type="number" value={orderForm.stopLoss}
                       onChange={(e) => setOrderForm({...orderForm, stopLoss: parseFloat(e.target.value)})} />
              </div>
              
              <div>
                <label>Take Profit</label>
                <input type="number" value={orderForm.takeProfit}
                       onChange={(e) => setOrderForm({...orderForm, takeProfit: parseFloat(e.target.value)})} />
              </div>
              
              {/* Place Order Button */}
              <Button onClick={handlePlaceOrder} className="w-full">
                Place Order
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Middle: Active Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Orders table */}
          </CardContent>
        </Card>
        
        {/* Right: Open Positions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Positions table */}
          </CardContent>
        </Card>
      </div>
    </TraderLayout>
  );
}
```

**Estimated Time:** 4-5 hours

---

**Task 2.3: Complete StrategyLibrary.tsx**

Current status: Placeholder (22 lines, ~5% complete)

**Requirements:**
- Strategy list view with cards
- Filter by category (Trend, Mean Reversion, Arbitrage, etc.)
- Search functionality
- Strategy details (name, description, parameters, performance)
- CRUD operations (Create, Read, Update, Delete)
- Deploy button

**Estimated Time:** 3-4 hours

---

**Task 2.4: Check and Complete Remaining Pages**

**Pages to review:**
- DeployStrategy.tsx (unknown status)
- StrategyBuilder.tsx (unknown status)
- AdvancedBacktest.tsx (unknown status)
- LiveTradingNew.tsx (unknown status)

**Process:**
1. Read each file
2. Assess completion percentage
3. Identify missing features
4. Implement missing features
5. Test functionality

**Estimated Time:** 6-8 hours

**Total Day 3-4 Time:** 16-21 hours

---

#### **Day 5-6: Backend API Development** (Priority: 🔴 HIGH)

**Task 3.1: Implement Trading Mutations**

Create file `server/trading_mutations.ts`:

```typescript
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { spawn } from "child_process";

export const tradingMutations = router({
  placeOrder: publicProcedure
    .input(z.object({
      instrumentId: z.string(),
      side: z.enum(['BUY', 'SELL']),
      orderType: z.enum(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT']),
      quantity: z.number().positive(),
      price: z.number().positive().optional(),
      stopPrice: z.number().positive().optional(),
      stopLoss: z.number().positive().optional(),
      takeProfit: z.number().positive().optional(),
    }))
    .mutation(async ({ input }) => {
      // Call Nautilus Core via Python bridge
      const result = await callNautilusCore('place_order', input);
      
      if (result.success) {
        return { 
          success: true, 
          orderId: result.order_id,
          message: 'Order placed successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
    }),
    
  closePosition: publicProcedure
    .input(z.object({
      positionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const result = await callNautilusCore('close_position', input);
      
      if (result.success) {
        return { 
          success: true,
          message: 'Position closed successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to close position');
      }
    }),
    
  cancelOrder: publicProcedure
    .input(z.object({
      orderId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const result = await callNautilusCore('cancel_order', input);
      
      if (result.success) {
        return { 
          success: true,
          message: 'Order cancelled successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to cancel order');
      }
    }),
    
  modifyOrder: publicProcedure
    .input(z.object({
      orderId: z.string(),
      quantity: z.number().positive().optional(),
      price: z.number().positive().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await callNautilusCore('modify_order', input);
      
      if (result.success) {
        return { 
          success: true,
          message: 'Order modified successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to modify order');
      }
    }),
});

// Helper function to call Nautilus Core
async function callNautilusCore(action: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const python = spawn('python3.11', [
      'server/nautilus_api.py',
      action,
      JSON.stringify(params)
    ]);
    
    let output = '';
    let error = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          reject(new Error('Failed to parse Nautilus response'));
        }
      } else {
        reject(new Error(error || 'Nautilus Core error'));
      }
    });
  });
}
```

**Task 3.2: Update nautilus_api.py**

Enhance `server/nautilus_api.py` to handle trading operations:

```python
#!/usr/bin/env python3
"""
Nautilus Core API - Handle trading operations
"""
import sys
import json
from nautilus_trader.live.node import TradingNode
from nautilus_trader.model.identifiers import InstrumentId, OrderId, PositionId
from nautilus_trader.model.orders import MarketOrder, LimitOrder
from nautilus_trader.model.enums import OrderSide

class NautilusTradingAPI:
    def __init__(self):
        # Initialize TradingNode (simplified - needs proper config)
        self.node = None  # Would be initialized with proper config
        
    def place_order(self, params):
        """Place a new order"""
        try:
            instrument_id = InstrumentId.from_str(params['instrumentId'])
            side = OrderSide.BUY if params['side'] == 'BUY' else OrderSide.SELL
            quantity = params['quantity']
            
            if params['orderType'] == 'MARKET':
                # Create market order
                order = MarketOrder(
                    instrument_id=instrument_id,
                    order_side=side,
                    quantity=quantity,
                )
            elif params['orderType'] == 'LIMIT':
                # Create limit order
                order = LimitOrder(
                    instrument_id=instrument_id,
                    order_side=side,
                    quantity=quantity,
                    price=params['price'],
                )
            
            # Submit order (simplified)
            # self.node.submit_order(order)
            
            return {
                'success': True,
                'order_id': f'ORDER-{int(time.time())}',
                'message': 'Order placed successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def close_position(self, params):
        """Close an existing position"""
        try:
            position_id = PositionId(params['positionId'])
            
            # Close position (simplified)
            # self.node.close_position(position_id)
            
            return {
                'success': True,
                'message': 'Position closed successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def cancel_order(self, params):
        """Cancel an existing order"""
        try:
            order_id = OrderId(params['orderId'])
            
            # Cancel order (simplified)
            # self.node.cancel_order(order_id)
            
            return {
                'success': True,
                'message': 'Order cancelled successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

def main():
    if len(sys.argv) < 3:
        print(json.dumps({'success': False, 'error': 'Missing arguments'}))
        sys.exit(1)
    
    action = sys.argv[1]
    params = json.loads(sys.argv[2])
    
    api = NautilusTradingAPI()
    
    if action == 'place_order':
        result = api.place_order(params)
    elif action == 'close_position':
        result = api.close_position(params)
    elif action == 'cancel_order':
        result = api.cancel_order(params)
    elif action == 'modify_order':
        result = api.modify_order(params)
    else:
        result = {'success': False, 'error': f'Unknown action: {action}'}
    
    print(json.dumps(result))

if __name__ == '__main__':
    main()
```

**Task 3.3: Integrate mutations into main router**

Update `server/routers.ts`:

```typescript
import { tradingMutations } from './trading_mutations';

export const appRouter = router({
  // ... existing routers
  trading: router({
    // ... existing queries
    ...tradingMutations,
  }),
});
```

**Estimated Time:** 6-8 hours

---

#### **Day 7: Integration Testing**

**Task 4.1: Test Database Connections**
```bash
# Test PostgreSQL
psql -h localhost -U nautilus_user -d nautilus -c "SELECT COUNT(*) FROM orders;"

# Test Redis
redis-cli PING

# Test MySQL
mysql -u nautilus_web -pnautilus_web_pass nautilus_web -e "SHOW TABLES;"
```

**Task 4.2: Test Nautilus Core Integration**
```bash
# Run sample backtest to populate data
cd /home/ubuntu/nautilus-trader-admin/server
python3.11 populate_database.py

# Verify data
psql -h localhost -U nautilus_user -d nautilus -c "SELECT COUNT(*) FROM positions;"
psql -h localhost -U nautilus_user -d nautilus -c "SELECT COUNT(*) FROM orders;"
psql -h localhost -U nautilus_user -d nautilus -c "SELECT COUNT(*) FROM trades;"
```

**Task 4.3: Test Web Interface**
```bash
# Start dev server
cd /home/ubuntu/nautilus-trader-admin
pnpm run dev

# Access at http://localhost:3000
# Test all pages
# Verify data loading
```

**Task 4.4: Test Trading Mutations**
- Test place order (market, limit, stop)
- Test close position
- Test cancel order
- Verify error handling
- Check database updates

**Task 4.5: End-to-End Testing**
- Complete trading workflow: View portfolio → Place order → Monitor order → Close position
- Backtest workflow: Create strategy → Run backtest → View results
- Risk management: Set limits → Monitor alerts → Trigger breaches

**Estimated Time:** 8-10 hours

---

### 5.2. Phase 2: Docker Containerization (Week 2)

**Goal:** Package application into Docker containers

#### **Day 1-2: Create Docker Setup**

**Task 1: Create Dockerfile for Web Interface**

```dockerfile
# File: Dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm install -g pnpm && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Copy server files
COPY server ./server

# Install Python for bridge
RUN apk add --no-cache python3 py3-pip postgresql-client
RUN pip3 install psycopg2-binary redis nautilus_trader

EXPOSE 3000

CMD ["pnpm", "start"]
```

**Task 2: Create docker-compose.yml**

```yaml
# File: docker-compose.yml
version: '3.8'

services:
  # PostgreSQL for Nautilus Core data
  postgres:
    image: postgres:14-alpine
    container_name: nautilus-postgres
    environment:
      POSTGRES_DB: nautilus
      POSTGRES_USER: nautilus_user
      POSTGRES_PASSWORD: nautilus_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-postgres.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nautilus_user -d nautilus"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - nautilus-network

  # Redis for cache and live state
  redis:
    image: redis:7-alpine
    container_name: nautilus-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - nautilus-network

  # MySQL for web interface data
  mysql:
    image: mysql:8
    container_name: nautilus-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: nautilus_web
      MYSQL_USER: nautilus_web
      MYSQL_PASSWORD: nautilus_web_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "nautilus_web", "-pnautilus_web_pass"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - nautilus-network

  # Web Interface
  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nautilus-web
    ports:
      - "3000:3000"
    environment:
      # Database URLs
      DATABASE_URL: mysql://nautilus_web:nautilus_web_pass@mysql:3306/nautilus_web
      POSTGRES_URL: postgresql://nautilus_user:nautilus_pass@postgres:5432/nautilus
      REDIS_URL: redis://redis:6379
      
      # Node environment
      NODE_ENV: production
      
      # Nautilus config
      NAUTILUS_DATA_DIR: /app/nautilus-data
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      mysql:
        condition: service_healthy
    volumes:
      - nautilus_data:/app/nautilus-data
      - ./server:/app/server
    networks:
      - nautilus-network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  mysql_data:
    driver: local
  nautilus_data:
    driver: local

networks:
  nautilus-network:
    driver: bridge
```

**Task 3: Create init-postgres.sql**

```sql
-- File: init-postgres.sql
-- Initialize PostgreSQL schema for Nautilus Core

CREATE TABLE IF NOT EXISTS instruments (
    instrument_id VARCHAR(64) PRIMARY KEY,
    symbol VARCHAR(64) NOT NULL,
    asset_class VARCHAR(32),
    base_currency VARCHAR(16),
    quote_currency VARCHAR(16),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(64) PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    order_type VARCHAR(32) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8),
    filled_qty DECIMAL(20,8) DEFAULT 0,
    avg_px DECIMAL(20,8),
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id)
);

CREATE TABLE IF NOT EXISTS trades (
    trade_id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64),
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    commission DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    executed_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id)
);

CREATE TABLE IF NOT EXISTS positions (
    position_id VARCHAR(64) PRIMARY KEY,
    instrument_id VARCHAR(64) NOT NULL,
    side VARCHAR(16) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    entry_price DECIMAL(20,8) NOT NULL,
    current_price DECIMAL(20,8),
    unrealized_pnl DECIMAL(20,8),
    realized_pnl DECIMAL(20,8),
    status VARCHAR(32) NOT NULL,
    opened_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP,
    FOREIGN KEY (instrument_id) REFERENCES instruments(instrument_id)
);

-- Create indexes
CREATE INDEX idx_orders_instrument ON orders(instrument_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_trades_order ON trades(order_id);
CREATE INDEX idx_positions_instrument ON positions(instrument_id);
CREATE INDEX idx_positions_status ON positions(status);
```

**Task 4: Create .dockerignore**

```
# File: .dockerignore
node_modules
.next
.git
.gitignore
README.md
*.md
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**Task 5: Create docker-compose.dev.yml for development**

```yaml
# File: docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    extends:
      file: docker-compose.yml
      service: postgres
    ports:
      - "5433:5432"  # Different port for dev

  redis:
    extends:
      file: docker-compose.yml
      service: redis
    ports:
      - "6380:6379"  # Different port for dev

  mysql:
    extends:
      file: docker-compose.yml
      service: mysql
    ports:
      - "3307:3306"  # Different port for dev

  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      DATABASE_URL: mysql://nautilus_web:nautilus_web_pass@mysql:3306/nautilus_web
      POSTGRES_URL: postgresql://nautilus_user:nautilus_pass@postgres:5432/nautilus
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    command: pnpm run dev
```

**Estimated Time:** 8-10 hours

---

#### **Day 3-4: Testing Docker Deployment**

**Task 1: Build and run containers**
```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check service health
docker-compose ps
```

**Task 2: Verify database connections**
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U nautilus_user -d nautilus

# Connect to Redis
docker-compose exec redis redis-cli

# Connect to MySQL
docker-compose exec mysql mysql -u nautilus_web -pnautilus_web_pass nautilus_web
```

**Task 3: Populate test data**
```bash
# Run populate script inside container
docker-compose exec web python3 server/populate_database.py
```

**Task 4: Test web interface**
```bash
# Access at http://localhost:3000
# Test all pages
# Verify data loading
# Test mutations
```

**Task 5: Performance testing**
- Load testing with Apache Bench or k6
- Monitor resource usage
- Optimize if needed

**Estimated Time:** 6-8 hours

---

#### **Day 5: Documentation**

**Task 1: Write Docker deployment guide**
- Prerequisites
- Installation steps
- Configuration
- Running the application
- Troubleshooting

**Task 2: Update README.md**
- Add Docker section
- Update installation instructions
- Add environment variables documentation

**Task 3: Create DEPLOYMENT.md**
- Detailed deployment guide
- Production considerations
- Scaling strategies
- Monitoring setup

**Estimated Time:** 2-3 hours

---

### 5.3. Phase 3: Production Deployment (Week 3) - OPTIONAL

**Goal:** Deploy to production environment (VPS or Cloud)

#### **Option A: VPS Deployment (DigitalOcean, Linode, Vultr)**

**Step 1: Provision Server**
- Ubuntu 22.04 LTS
- 4 CPU cores
- 8GB RAM
- 100GB SSD
- Cost: ~$40-60/month

**Step 2: Server Setup**
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/Black101081/nautilus-trader-admin.git
cd nautilus-trader-admin

# Create .env file
cat > .env << EOF
DATABASE_URL=mysql://nautilus_web:nautilus_web_pass@mysql:3306/nautilus_web
POSTGRES_URL=postgresql://nautilus_user:nautilus_pass@postgres:5432/nautilus
REDIS_URL=redis://redis:6379
NODE_ENV=production
EOF

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

**Step 3: Setup Nginx Reverse Proxy**
```bash
# Install Nginx
apt-get install -y nginx

# Configure Nginx
cat > /etc/nginx/sites-available/nautilus << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/nautilus /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**Step 4: Setup SSL (Let's Encrypt)**
```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal test
certbot renew --dry-run
```

**Step 5: Setup Firewall**
```bash
# Install UFW
apt-get install -y ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

**Estimated Time:** 8-10 hours

---

#### **Option B: Cloud Deployment (AWS)**

**AWS Services:**
- EC2 (t3.medium) for application
- RDS PostgreSQL (db.t3.micro)
- ElastiCache Redis (cache.t3.micro)
- RDS MySQL (db.t3.micro)
- S3 for Parquet data
- CloudFront CDN
- Route 53 for DNS
- ELB for load balancing

**Estimated Cost:** ~$100-150/month

**Estimated Time:** 16-20 hours

---

## 6. Technical Specifications

### 6.1. System Requirements

#### **Development Environment**
- OS: Ubuntu 22.04 LTS
- Node.js: 22.13.0
- Python: 3.11
- pnpm: 10.4.1+
- PostgreSQL: 14+
- Redis: 6.0+
- MySQL: 8.0+
- Docker: 20.10+ (optional)
- Docker Compose: 2.0+ (optional)

#### **Production Environment**

**Minimum:**
- 2 CPU cores
- 4GB RAM
- 50GB SSD
- 100Mbps network

**Recommended:**
- 4 CPU cores
- 8GB RAM
- 100GB SSD
- 1Gbps network

**Optimal:**
- 8 CPU cores
- 16GB RAM
- 200GB SSD
- 10Gbps network

### 6.2. Database Sizing

**PostgreSQL (Nautilus Data):**
- Initial: 1GB
- Growth: ~100MB/day (active trading)
- Recommended: 50GB

**Redis (Cache):**
- Initial: 100MB
- Peak: 1-2GB
- Recommended: 4GB

**MySQL/TiDB (Web DB):**
- Initial: 500MB
- Growth: ~10MB/day
- Recommended: 20GB

**Parquet (Archives):**
- Initial: 1GB
- Growth: ~500MB/month
- Recommended: 100GB

### 6.3. Network Requirements

**Bandwidth:**
- Inbound: 10Mbps (minimum)
- Outbound: 10Mbps (minimum)
- Recommended: 100Mbps+

**Latency:**
- Database: <5ms
- API: <50ms
- WebSocket: <100ms

### 6.4. Security Requirements

**Authentication:**
- JWT tokens
- Session management
- Password hashing (bcrypt)

**Authorization:**
- Role-based access control (RBAC)
- Permission matrix
- API key management

**Network Security:**
- HTTPS only (TLS 1.3)
- Firewall rules
- Rate limiting
- DDoS protection

**Data Security:**
- Database encryption at rest
- Encrypted backups
- Secure environment variables
- Secrets management

---

## 7. Risk Assessment

### 7.1. Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database performance issues | Medium | High | Connection pooling, query optimization, caching |
| Nautilus Core integration failures | Medium | High | Comprehensive testing, error handling, fallbacks |
| WebSocket connection drops | Medium | Medium | Reconnection logic, heartbeat, fallback to polling |
| Memory leaks | Low | High | Monitoring, regular restarts, profiling |
| Security vulnerabilities | Medium | Critical | Security audits, penetration testing, updates |
| Data loss | Low | Critical | Regular backups, replication, disaster recovery |
| Docker container issues | Low | Medium | Health checks, restart policies, monitoring |
| Python bridge failures | Medium | High | Error handling, retry logic, fallback mechanisms |

### 7.2. Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Server downtime | Low | High | High availability setup, monitoring, alerts |
| Deployment failures | Medium | Medium | Staging environment, rollback procedures, CI/CD |
| Configuration errors | Medium | Medium | Configuration validation, documentation, checklists |
| Insufficient resources | Medium | High | Monitoring, auto-scaling, capacity planning |
| Vendor lock-in | Low | Medium | Use open standards, avoid proprietary services |
| Database migration issues | Medium | High | Test migrations, backup before migration, rollback plan |

### 7.3. Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cost overruns | Medium | Medium | Budget monitoring, cost optimization, reserved instances |
| Scope creep | High | Medium | Clear requirements, change management, prioritization |
| Timeline delays | Medium | Medium | Buffer time, parallel work, regular checkpoints |
| User adoption issues | Low | High | User training, documentation, support |
| Regulatory compliance | Low | High | Legal review, compliance audits, data protection |

---

## 8. Success Criteria

### 8.1. Functional Requirements

**Must Have (P0):**
- ✅ All 46 pages functional
- ✅ All databases connected and working
- ✅ Nautilus Core integration working
- ✅ Authentication and authorization working
- ✅ Basic trading operations working (view data)
- ✅ Trading mutations working (place, cancel, close)

**Should Have (P1):**
- ✅ Strategy deployment working
- ✅ Backtest execution working
- ✅ Real-time updates (WebSocket or polling)
- ✅ Performance analytics
- ✅ Risk management

**Nice to Have (P2):**
- ⭐ Advanced charting (TradingView integration)
- ⭐ Mobile responsive design
- ⭐ Dark/light theme toggle
- ⭐ Export functionality (CSV, PDF)
- ⭐ Notifications (email, SMS, push)

### 8.2. Non-Functional Requirements

**Performance:**
- Page load time: <2s
- API response time: <100ms
- Database query time: <50ms
- WebSocket latency: <100ms (if implemented)

**Reliability:**
- Uptime: >99.5%
- Error rate: <0.1%
- Data accuracy: 100%

**Security:**
- HTTPS: 100%
- Authentication: Required for all protected routes
- Authorization: RBAC implemented
- Audit logging: All actions logged

**Scalability:**
- Concurrent users: 100+
- Requests/second: 1000+
- Database size: 100GB+

**Maintainability:**
- Code coverage: >80% (future goal)
- Documentation: Complete
- Monitoring: Comprehensive
- Logging: Detailed

---

## 9. Next Steps - Approval Required

### 9.1. Decision Points

**Bạn cần quyết định:**

1. **Deployment Strategy?**
   - [ ] Option 1: Monolithic (Development) ← RECOMMENDED
   - [ ] Option 2: Microservices (Production)
   - [ ] Option 3: Cloud-Native (Enterprise)

2. **Timeline?**
   - [ ] 1 week (minimum viable - databases + Phase 2 pages)
   - [ ] 2 weeks (recommended - includes Docker)
   - [ ] 3 weeks (comprehensive - includes production deployment)

3. **Scope Priority?**
   - [ ] Complete Phase 2 pages first, then infrastructure
   - [ ] Setup infrastructure first, then complete pages
   - [ ] Both in parallel (requires more coordination)

4. **Infrastructure?**
   - [ ] Local sandbox only (testing)
   - [ ] Docker containers (portable)
   - [ ] VPS deployment (production)
   - [ ] Cloud deployment (enterprise)

5. **Database Strategy?**
   - [ ] Use MySQL instead of TiDB (simpler, recommended)
   - [ ] Setup TiDB (as designed, more complex)
   - [ ] Use managed database services (cloud)

6. **Phase 2 Pages Priority?**
   - [ ] Complete all 6 pages (MarketWatch, LiveTrading, StrategyLibrary, DeployStrategy, StrategyBuilder, AdvancedBacktest)
   - [ ] Complete only critical pages (MarketWatch, LiveTrading, StrategyLibrary)
   - [ ] Complete based on assessment (check status first)

### 9.2. Recommended Approach

Tôi đề xuất **phương pháp từng bước**:

**Week 1: Local Development** ← **BẮT ĐẦU TỪ ĐÂY**
- Day 1-2: Setup databases (PostgreSQL, Redis, MySQL)
- Day 3-4: Complete Phase 2 pages (assess status, complete missing features)
- Day 5-6: Implement backend APIs (trading mutations)
- Day 7: Integration testing
- **Deliverable:** Fully functional local deployment

**Week 2: Containerization** (Optional)
- Day 1-2: Create Docker setup
- Day 3-4: Test containerized deployment
- Day 5: Documentation
- **Deliverable:** Docker Compose deployment ready

**Week 3: Production Deployment** (Optional)
- Day 1-2: Server provisioning + setup
- Day 3-4: Deployment + SSL setup
- Day 5: Monitoring + logging setup
- **Deliverable:** Production-ready deployment

### 9.3. Questions for You

1. **Bạn muốn bắt đầu từ Phase nào?**
   - Week 1: Local Development?
   - Week 2: Docker Containerization?
   - Week 3: Production Deployment?

2. **Bạn có server/VPS sẵn chưa?**
   - Nếu có, specs là gì?
   - Nếu chưa, bạn muốn dùng service nào? (DigitalOcean, AWS, GCP, Azure?)

3. **Bạn muốn tôi tập trung vào phần nào trước?**
   - Complete Phase 2 pages?
   - Setup databases?
   - Implement backend APIs?
   - Docker setup?
   - Production deployment?

4. **Bạn có domain name chưa?**
   - Nếu có, là gì?
   - Nếu chưa, bạn muốn dùng subdomain hoặc IP tạm thời?

5. **Budget cho infrastructure?**
   - Development only (free tier/local)?
   - Production (paid services)?
   - Estimated monthly budget?

6. **Bạn muốn kiểm tra status của 4 pages unknown trước không?**
   - DeployStrategy.tsx
   - StrategyBuilder.tsx
   - AdvancedBacktest.tsx
   - LiveTradingNew.tsx

---

## 10. Conclusion

Deployment plan này cung cấp **roadmap chi tiết và thực tế** để deploy Nautilus Trader Admin Interface từ development đến production, dựa trên:

1. **Historical context** từ conversation trước về deployment Nautilus Core
2. **Detailed code analysis** của 46 pages, 7 Python modules, 9 tRPC routers
3. **Existing documentation** (README, PHASE_1_FINAL_REPORT, TRADER_README, etc.)
4. **Best practices** cho web application deployment

**Key Takeaways:**
- ✅ Hệ thống đã hoàn thành ~70%
- ✅ Nautilus Core ready và working (v1.220.0)
- ✅ Admin section hoàn chỉnh 100% (21 pages)
- ✅ Trader section Phase 1 hoàn chỉnh 100% (17 pages)
- ⚠️ Trader section Phase 2 cần hoàn thiện (6 pages, ~40%)
- ⚠️ Databases chưa setup
- ⚠️ Trading mutations chưa implement
- 🎯 Estimated effort: 1-3 weeks tùy scope

**Recommended Next Step:**
Bắt đầu với **Week 1: Local Development Setup** trong sandbox này:
1. Setup databases (PostgreSQL, Redis, MySQL)
2. Assess và complete Phase 2 pages
3. Implement trading mutations
4. Integration testing
5. Sau đó mới tiến tới containerization và production deployment

**Unique Insights from Historical Context:**
- Populate database script đã sẵn sàng với 6 instruments support
- NautilusCoreManager class đã implement comprehensive monitoring
- Python bridge architecture đã được thiết kế tốt
- tRPC routers đã có structure tốt, chỉ thiếu mutations

---

**Prepared by:** Manus AI Assistant  
**Date:** 19 Tháng 10, 2025  
**Status:** 📋 DRAFT - Awaiting Approval  
**Version:** 2.1 (Updated with Historical Context)

---

**⚠️ IMPORTANT: Đây chỉ là PLAN chi tiết dựa trên phân tích toàn diện. Tôi sẽ KHÔNG thực thi bất kỳ bước nào cho đến khi bạn:**
1. Review và approve plan này
2. Trả lời các questions trong Section 9.3
3. Chỉ định rõ ràng bắt đầu từ đâu và scope ưu tiên

**Sau khi bạn confirm, tôi sẽ:**
1. Bắt đầu thực thi từ bước được chỉ định
2. Báo cáo tiến độ sau mỗi task
3. Xin approval trước khi chuyển sang phase mới

