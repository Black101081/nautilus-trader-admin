# NautilusTrader Admin Interface

> Complete trading platform management system with 19 admin pages, 4 database backends, and 64 feature management capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NautilusTrader](https://img.shields.io/badge/NautilusTrader-1.220.0-blue.svg)](https://nautilustrader.io/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)

## 🎯 Overview

A comprehensive admin interface for [NautilusTrader](https://nautilustrader.io/) - a high-performance algorithmic trading platform. This interface provides complete system management, monitoring, and configuration capabilities through a modern web-based dashboard.

### ✨ Key Features

- **19 Admin Pages** - Complete system management across 8 functional areas
- **6 Documentation Pages** - Comprehensive guides and references
- **4 Database Backends** - TiDB, Redis, PostgreSQL, and Parquet integration
- **64 Nautilus Features** - Discovered, mapped, and managed
- **126 Services** - Mapped to core components
- **10 Core Components** - Real-time health monitoring
- **Professional UI/UX** - Dark theme with responsive design

## 📸 Screenshots

### Core Management
![Core Management](docs/screenshots/core-management.png)
*Manage 64 Nautilus features across 10 categories with real-time status tracking*

### Database Management
![Database Management](docs/screenshots/database-management.png)
*Monitor and manage 4 database backends with real-time metrics*

### Trading Operations
![Execution Management](docs/screenshots/execution-management.png)
*Real-time order execution monitoring and venue management*

## 🚀 Quick Start

### Prerequisites

- Node.js 22.13.0 or higher
- Python 3.11
- pnpm (recommended) or npm
- Redis 6.0+
- PostgreSQL 14+
- TiDB (MySQL-compatible)

### Installation

```bash
# Clone the repository
git clone https://github.com/Black101081/nautilus-trader-admin.git
cd nautilus-trader-admin

# Install dependencies
pnpm install

# Set up databases
# Redis
sudo apt-get install redis-server
sudo service redis-server start

# PostgreSQL
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE nautilus;"
sudo -u postgres psql -c "CREATE USER nautilus_user WITH PASSWORD 'nautilus_pass';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nautilus TO nautilus_user;"

# Create Parquet data directories
mkdir -p ~/nautilus-data/{bars,quotes,trades,backtests}

# Install Python dependencies
pip3 install nautilus_trader redis psycopg2-binary pyarrow

# Start development server
pnpm run dev
```

The admin interface will be available at `http://localhost:3000`

## 📚 Documentation

### Admin Pages (19 total)

#### Dashboard (2 pages)
- **System Overview** - System-wide metrics and status
- **Analytics** - Trading volume, P&L, and performance analytics

#### Nautilus Core (3 pages)
- **Core Management** ⭐ - Features, Services, and Components management
- **Component Health** - Real-time component health monitoring
- **Data Feeds** - Market data feed management

#### Trading Operations (3 pages)
- **Execution Management** - Order execution and venue monitoring
- **Risk Controls** - Risk management and limits
- **Broker Integration** - Multi-broker connection management

#### Data & Storage (1 page)
- **Database Management** ⭐ - TiDB, Redis, PostgreSQL, and Parquet management

#### User & Access (3 pages)
- **Users & Roles** - User management with RBAC
- **Access Control** - Permission matrix and session monitoring
- **API Keys** - API key generation and management

#### Monitoring (1 page)
- **Audit Logs** - System activity and security event logging

#### Configuration (1 page)
- **System Settings** - System-wide configuration

### Documentation Pages (6 total)

1. **Getting Started** - Quick start guide and key features
2. **System Architecture** - Technical architecture overview
3. **Database Guide** - Database backend documentation
4. **API Reference** - tRPC API documentation
5. **User Guide** - User manual and workflows
6. **Troubleshooting** - Common issues and solutions

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19.1.1
- TypeScript
- TailwindCSS
- Wouter (routing)
- tRPC Client
- Vite (build tool)

**Backend:**
- Node.js 22.13.0
- tRPC Server
- Express.js
- Python 3.11 (Nautilus bridge)

**Databases:**
- TiDB (MySQL-compatible) - Web interface data
- Redis 6.0.16 - Live trading cache
- PostgreSQL 14.19 - Historical data
- Parquet - Backtesting archives

**Core:**
- NautilusTrader 1.220.0
- Python bindings
- Event-driven architecture

### Project Structure

```
nautilus-trader-admin/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # 19 admin pages + 6 docs pages
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities and tRPC client
├── server/                # Backend Node.js server
│   ├── _core/            # Server entry point
│   ├── routers.ts        # tRPC routers
│   ├── nautilus_bridge.py    # Nautilus Core bridge
│   ├── redis_manager.py      # Redis management
│   ├── postgres_manager.py   # PostgreSQL management
│   ├── parquet_manager.py    # Parquet management
│   └── feature_manager.py    # Feature management
├── drizzle/              # Database schema and migrations
└── docs/                 # Documentation and guides
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=mysql://root@localhost:4000/nautilus
REDIS_URL=redis://localhost:6379
POSTGRES_URL=postgresql://nautilus_user:nautilus_pass@localhost:5432/nautilus

# Server Configuration
PORT=3000
NODE_ENV=development

# Nautilus Configuration
NAUTILUS_DATA_PATH=/home/ubuntu/nautilus-data
```

### Database Configuration

The system uses 4 database backends:

1. **TiDB** - Web interface (users, strategies, backtests, logs)
2. **Redis** - Live trading state (orders, positions, market data)
3. **PostgreSQL** - Historical data (trades, bars, quotes)
4. **Parquet** - Backtesting data (archived market data)

See `docs/database-guide.md` for detailed configuration.

## 📊 Features

### Core Management

- **64 Nautilus Features** across 10 categories:
  - Core Components (6)
  - Trading Engine (5)
  - Data Types (8)
  - Adapters (6)
  - Strategy Features (6)
  - Backtesting (7)
  - Live Trading (7)
  - Persistence (6)
  - Monitoring (6)
  - Advanced Features (7)

- **126 Services** mapped to features
- **10 Core Components** with health monitoring:
  - Kernel
  - MessageBus
  - Cache
  - Clock
  - Logger
  - DataEngine
  - ExecutionEngine
  - RiskEngine
  - StrategyEngine
  - PortfolioEngine

### Database Management

- **TiDB Management**
  - 10 tables (5 interface + 5 core)
  - Real-time record counts
  - Table metadata

- **Redis Management**
  - Server info (version, uptime, clients)
  - Memory usage tracking
  - Keyspace statistics
  - Cache performance metrics
  - Flush operations

- **PostgreSQL Management**
  - Connection info
  - Storage metrics
  - Nautilus table listing
  - Query performance
  - Maintenance operations (VACUUM, ANALYZE)

- **Parquet Management**
  - Storage overview
  - Directory browser (bars/, quotes/, trades/, backtests/)
  - File metadata
  - Upload/download operations

### Trading Operations

- **Execution Management**
  - Real-time order monitoring
  - Venue connection status
  - Execution quality metrics
  - Emergency controls

- **Risk Controls**
  - Pre-trade risk checks
  - Position limits
  - Order size limits
  - Real-time risk monitoring

- **Broker Integration**
  - Multi-broker support (Interactive Brokers, Binance, Coinbase Pro, Kraken)
  - Connection monitoring
  - Performance metrics
  - Rate limit tracking

### User & Access Management

- **RBAC** with 4 roles:
  - Administrator
  - Trader
  - Analyst
  - Viewer

- **Permission Matrix** (15+ granular permissions)
- **Session Monitoring** (device, location, duration)
- **Security Events** (login attempts, permission changes)
- **API Key Management** (generation, rotation, revocation)

## 🧪 Testing

```bash
# Run TypeScript type checking
pnpm run type-check

# Run linter
pnpm run lint

# Build production bundle
pnpm run build
```

## 📈 Performance

- **Server Response Time:** <100ms for most endpoints
- **Frontend Load Time:** <2s initial load
- **Real-time Updates:** 5-30s intervals
- **Memory Usage:** ~70-100 MB (normal operation)

## 🛠️ Development

### Adding a New Admin Page

1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add navigation link in `client/src/components/AdminSidebar.tsx`
4. Add tRPC endpoints in `server/routers.ts` (if needed)

### Adding a New Feature

1. Add feature definition in `server/feature_manager.py`
2. Map services to the feature
3. Define dependencies
4. Update feature categories

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

- **Author:** Black Sun
- **GitHub:** [@Black101081](https://github.com/Black101081)
- **Repository:** [nautilus-trader-admin](https://github.com/Black101081/nautilus-trader-admin)

## 🙏 Acknowledgments

- [NautilusTrader](https://nautilustrader.io/) - High-performance algorithmic trading platform
- [React](https://reactjs.org/) - UI framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📊 Project Status

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** October 18, 2025  

**Completion:**
- [x] 19 Admin Pages
- [x] 6 Documentation Pages
- [x] 4 Database Backends
- [x] 64 Feature Management
- [x] 126 Service Mapping
- [x] 10 Component Monitoring
- [x] Real-time Updates
- [x] Professional UI/UX

---

**Built with ❤️ for the algorithmic trading community**

