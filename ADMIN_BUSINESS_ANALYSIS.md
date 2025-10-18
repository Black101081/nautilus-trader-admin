# Phân Tích Nghiệp Vụ Chi Tiết - Admin Panel
## Nautilus Trader Admin & Trading Platform

**Date:** October 19, 2025  
**Version:** 2.0  
**Author:** Business Analyst  
**Status:** Comprehensive Analysis

---

## 📋 Mục Lục

1. [Tổng Quan Admin Panel](#tổng-quan-admin-panel)
2. [Hai Lớp Quản Trị](#hai-lớp-quản-trị)
3. [Phân Tích Chi Tiết 21 Trang Admin](#phân-tích-chi-tiết-21-trang-admin)
4. [Nghiệp Vụ Quản Trị Nautilus Core](#nghiệp-vụ-quản-trị-nautilus-core)
5. [Nghiệp Vụ Quản Trị Nautilus Admin](#nghiệp-vụ-quản-trị-nautilus-admin)
6. [Luồng Nghiệp Vụ Chi Tiết](#luồng-nghiệp-vụ-chi-tiết)
7. [Vai Trò và Quyền Hạn](#vai-trò-và-quyền-hạn)

---

## 🎯 Tổng Quan Admin Panel

### Định Nghĩa

**Admin Panel** là giao diện quản trị tổng thể cho hệ thống Nautilus Trader, cho phép quản trị viên (Administrator) quản lý **HAI LỚP HỆ THỐNG** khác nhau:

1. **Nautilus Core** - Trading engine backend (Python/Rust)
2. **Nautilus Admin** - Web interface frontend/backend (React/Node.js)

### Mục Đích Kinh Doanh

**Primary Goals:**
- Đảm bảo Nautilus Core hoạt động ổn định 24/7
- Quản lý infrastructure và resources
- Kiểm soát rủi ro và compliance
- Quản lý users và access control
- Monitor performance và troubleshooting

**Secondary Goals:**
- Optimize system performance
- Reduce operational costs
- Improve system reliability
- Enhance security posture

---

## 🏗️ Hai Lớp Quản Trị

### Lớp 1: Quản Trị Nautilus Core (Trading Engine)

**Nautilus Core** là trading engine chính, được phát triển bởi NautilusSystems, viết bằng Rust với Python bindings.

#### Thành Phần Cần Quản Trị

**1. Core Components (6 components)**
- Execution Engine - Core trading execution
- Data Feed Handler - Real-time market data ingestion
- Risk Management System - Pre/post-trade risk checks
- Order Management System - Order routing & management
- Cache Layer (Redis) - High-performance caching
- Message Queue (RabbitMQ) - Event-driven messaging

**2. Nautilus Features (64 features)**
- Actor components (8 features)
- Backtest components (6 features)
- Cache components (5 features)
- Common components (7 features)
- Data components (8 features)
- Indicators (6 features)
- Infrastructure (7 features)
- Model components (8 features)
- Network components (3 features)
- Persistence (6 features)

**3. Services (126 services)**
- Distributed across all components
- Microservices architecture
- Event-driven communication

**4. Data Feeds (14+ brokers/exchanges)**
- Binance, Bybit, Interactive Brokers, etc.
- Real-time market data
- Historical data access

**5. Execution Venues (14+ brokers)**
- Order routing
- Execution management
- Position management

#### Nghiệp Vụ Quản Trị Nautilus Core

**A. System Monitoring**
- Monitor component health (running/stopped/warning/error)
- Track resource usage (CPU, RAM, uptime)
- Monitor system metrics (orders, latency, uptime, connections)
- Alert on anomalies

**B. Component Management**
- Start/stop/restart components
- Configure component parameters
- View component logs
- Troubleshoot issues

**C. Data Feed Management**
- Configure data feed connections
- Monitor data feed health
- Handle connection failures
- Manage subscriptions

**D. Execution Management**
- Monitor order flow
- Track execution quality
- Manage broker connections
- Handle execution errors

**E. Risk Control**
- Set risk limits (position, order, exposure)
- Monitor risk metrics
- Enforce pre-trade checks
- Alert on limit breaches

**F. Performance Optimization**
- Analyze system performance
- Identify bottlenecks
- Optimize configurations
- Scale resources

---

### Lớp 2: Quản Trị Nautilus Admin (Web Interface)

**Nautilus Admin** là web application mà chúng ta đang xây dựng, cung cấp giao diện để quản trị cả Nautilus Core và chính nó.

#### Thành Phần Cần Quản Trị

**1. Web Application**
- Frontend (React + TypeScript)
- Backend (Node.js + tRPC)
- API layer
- Authentication/Authorization

**2. Databases (4 backends)**
- **TiDB (MySQL)** - Web application data
  - users, strategies, backtests, etc.
- **PostgreSQL** - Nautilus Core data
  - instruments, orders, trades, positions, accounts, bars, ticks
- **Redis** - Cache & real-time state
  - Live trading state, cache management
- **Parquet** - Archive storage
  - Historical data, long-term storage

**3. Users & Access Control**
- User accounts
- Roles & permissions
- API keys
- Session management

**4. System Configuration**
- Application settings
- Database connections
- API configurations
- Feature flags

#### Nghiệp Vụ Quản Trị Nautilus Admin

**A. Database Management**
- Monitor database health (TiDB, PostgreSQL, Redis, Parquet)
- View database statistics (tables, rows, size)
- Manage database connections
- Backup/restore data
- Query data

**B. User Management**
- Create/edit/delete users
- Assign roles (Administrator, Trader, Analyst, Viewer)
- Manage permissions
- Reset passwords
- View user activity

**C. Access Control**
- Configure RBAC policies
- Manage API access
- Set IP whitelists
- Configure session timeouts

**D. API Key Management**
- Generate API keys
- Revoke API keys
- Monitor API usage
- Set rate limits

**E. Audit & Compliance**
- View audit logs
- Track user actions
- Monitor system changes
- Generate compliance reports

**F. System Configuration**
- Configure application settings
- Manage environment variables
- Set feature flags
- Configure integrations

---

## 📊 Phân Tích Chi Tiết 21 Trang Admin

### DASHBOARD (2 pages)

#### 1. System Overview (`/admin/system`)

**Lớp Quản Trị:** Nautilus Core + Nautilus Admin

**Mục Đích:**
- Tổng quan toàn bộ hệ thống
- Quick health check
- Key metrics at a glance

**Nghiệp Vụ:**

**A. System Metrics (4 cards)**
1. **Total Orders Today** - 12,453
   - Lớp: Nautilus Core
   - Nguồn: PostgreSQL (orders table)
   - Nghiệp vụ: Monitor trading activity

2. **Avg Latency** - 2.3ms
   - Lớp: Nautilus Core
   - Nguồn: Execution Engine metrics
   - Nghiệp vụ: Monitor execution performance

3. **System Uptime** - 99.97%
   - Lớp: Nautilus Core + Admin
   - Nguồn: System monitoring
   - Nghiệp vụ: Track reliability

4. **Active Connections** - 47
   - Lớp: Nautilus Core
   - Nguồn: WebSocket/API connections
   - Nghiệp vụ: Monitor concurrent users/feeds

**B. System Components Tab**
- Hiển thị 6 Nautilus Core components
- Status: running/stopped/warning/error
- Uptime, CPU, RAM usage
- Actions: Restart button

**Nghiệp vụ chi tiết:**
- Monitor: Execution Engine, Data Feed Handler, Risk Management, OMS, Redis, RabbitMQ
- Quick restart nếu có issues
- Visual health indicators

**C. Data Feeds Tab**
- Hiển thị data feed connections
- Status và performance metrics
- Manage subscriptions

**D. Resource Usage Tab**
- CPU, RAM, Disk usage
- Network I/O
- Database connections

**E. Configuration Tab**
- View/edit system configurations
- Environment variables
- Feature flags

**User Actions:**
- View system health
- Restart components
- Check metrics
- Navigate to detailed pages

**Data Sources:**
- Nautilus Core (via Python bridge)
- PostgreSQL (orders, trades)
- Redis (live state)
- System monitoring APIs

---

#### 2. Analytics (`/admin/analytics`)

**Lớp Quản Trị:** Nautilus Core + Nautilus Admin

**Mục Đích:**
- Phân tích performance tổng thể
- Identify trends và patterns
- Data-driven decision making

**Nghiệp Vụ:**

**A. Trading Analytics**
- Order volume trends
- Execution quality metrics
- Latency distribution
- Fill rate analysis

**B. System Analytics**
- Component uptime trends
- Resource usage trends
- Error rate analysis
- Alert frequency

**C. User Analytics**
- Active users
- API usage
- Feature adoption
- User behavior

**D. Financial Analytics**
- P&L overview
- Trading costs
- Slippage analysis
- Commission analysis

**User Actions:**
- View charts and graphs
- Filter by time range
- Export reports
- Drill down into details

**Data Sources:**
- PostgreSQL (historical data)
- Redis (real-time metrics)
- TiDB (user data)
- Parquet (archived data)

---

### NAUTILUS CORE (6 pages)

#### 3. Core Management (`/admin/core`)

**Lớp Quản Trị:** Nautilus Core

**Mục Đích:**
- Quản lý toàn bộ Nautilus Core components
- Configure core settings
- Monitor core health

**Nghiệp Vụ:**

**A. Component Management**
- List all 64 Nautilus features
- Categorized by type (Actor, Backtest, Cache, etc.)
- Enable/disable features
- Configure feature parameters

**B. Service Management**
- List all 126 services
- Start/stop services
- Monitor service health
- View service logs

**C. Core Configuration**
- Trading engine settings
- Execution parameters
- Risk parameters
- Data feed settings

**D. Version Management**
- View Nautilus Core version (1.220.0)
- Check for updates
- Manage dependencies

**User Actions:**
- Enable/disable features
- Start/stop services
- Edit configurations
- View logs
- Restart core

**Data Sources:**
- Nautilus Core API (via nautilus_bridge.py)
- NautilusCoreManager (346 lines)
- System configuration files

---

#### 4. Component Health (`/admin/components`)

**Lớp Quản Trị:** Nautilus Core

**Mục Đích:**
- Deep dive vào health của từng component
- Troubleshooting
- Performance optimization

**Nghiệp Vụ:**

**A. Detailed Component Status**
- Real-time status của 6 core components
- Detailed metrics (CPU, RAM, uptime, threads, connections)
- Error logs và warnings
- Performance graphs

**B. Component Dependencies**
- View dependency graph
- Check dependency health
- Identify bottlenecks

**C. Component Logs**
- Real-time log streaming
- Filter by level (INFO, WARNING, ERROR)
- Search logs
- Export logs

**D. Component Actions**
- Start/stop/restart
- Configure parameters
- Clear cache
- Reset state

**User Actions:**
- Monitor component health
- View detailed metrics
- Troubleshoot issues
- Restart components
- View logs

**Data Sources:**
- Nautilus Core components
- System logs
- Metrics APIs
- Redis (component state)

---

#### 5. Data Feeds (`/admin/feeds`)

**Lớp Quản Trị:** Nautilus Core

**Mục Đích:**
- Quản lý data feed connections
- Monitor data quality
- Handle connection issues

**Nghiệp Vụ:**

**A. Feed Connections**
- List all 14+ data feed connections
- Status: connected/disconnected/error
- Connection details (host, port, protocol)
- Latency metrics

**B. Subscriptions**
- View active subscriptions
- Subscribe/unsubscribe to instruments
- Manage subscription levels (L1, L2, L3)

**C. Data Quality**
- Monitor data freshness
- Check for gaps
- Validate data integrity
- Alert on stale data

**D. Feed Configuration**
- Configure feed credentials
- Set connection parameters
- Configure retry logic
- Set rate limits

**User Actions:**
- Connect/disconnect feeds
- Subscribe to instruments
- Monitor data quality
- Configure feeds
- Troubleshoot connection issues

**Data Sources:**
- Nautilus Core Data Feed Handler
- Feed connection status
- Subscription registry
- Data quality metrics

---

#### 6. Execution Management (`/admin/execution`)

**Lớp Quản Trị:** Nautilus Core

**Mục Đích:**
- Quản lý order execution
- Monitor execution quality
- Manage broker connections

**Nghiệp Vụ:**

**A. Order Flow Monitoring**
- Real-time order flow
- Order status (pending, filled, cancelled, rejected)
- Execution latency
- Fill rate

**B. Broker Connections**
- List all 14+ broker connections
- Status: connected/disconnected/error
- Connection health
- API rate limits

**C. Execution Quality**
- Slippage analysis
- Fill rate by venue
- Latency by venue
- Rejection rate

**D. Order Routing**
- View routing rules
- Configure routing logic
- Smart order routing (SOR)
- Failover configuration

**User Actions:**
- Monitor order flow
- Connect/disconnect brokers
- Configure routing
- View execution reports
- Troubleshoot execution issues

**Data Sources:**
- Nautilus Core Execution Engine
- PostgreSQL (orders table)
- Broker APIs
- Execution metrics

---

#### 7. Risk Controls (`/admin/risk`)

**Lớp Quản Trị:** Nautilus Core

**Mục Đích:**
- Configure risk limits
- Monitor risk exposure
- Enforce risk policies

**Nghiệp Vụ:**

**A. Risk Limits Configuration**
- **Position Limits**
  - Max position size per instrument
  - Max position value
  - Max concentration
  
- **Order Limits**
  - Max order size
  - Max order value
  - Max orders per second
  
- **Exposure Limits**
  - Max gross exposure
  - Max net exposure
  - Max leverage

**B. Risk Monitoring**
- Current exposure vs limits
- Real-time risk metrics
- Risk alerts
- Limit breach history

**C. Pre-Trade Checks**
- Configure pre-trade rules
- Enable/disable checks
- Set check parameters

**D. Post-Trade Checks**
- Configure post-trade rules
- Monitor compliance
- Generate reports

**User Actions:**
- Set risk limits
- Monitor risk exposure
- Enable/disable checks
- View risk alerts
- Generate risk reports

**Data Sources:**
- Nautilus Core Risk Management System
- PostgreSQL (positions, orders)
- Redis (live exposure)
- Risk configuration

---

#### 8. Broker Integration (`/admin/brokers`)

**Lớp Quản Trị:** Nautilus Core

**Mục Đích:**
- Manage broker integrations
- Configure broker connections
- Monitor broker health

**Nghiệp Vụ:**

**A. Broker List**
- 14+ supported brokers:
  - Binance, Bybit, Betfair, Deribit
  - Interactive Brokers, OKX, Tardis
  - IG Markets, Databento, Polymarket
  - Apex, Kraken, Bitstamp, Coinbase

**B. Connection Management**
- Add/remove broker connections
- Configure credentials (API key, secret)
- Test connections
- Enable/disable brokers

**C. Broker Configuration**
- Set broker-specific parameters
- Configure order types
- Set rate limits
- Configure retry logic

**D. Broker Monitoring**
- Connection status
- API rate limit usage
- Error rate
- Latency

**User Actions:**
- Add broker connections
- Configure credentials
- Test connections
- Monitor broker health
- Troubleshoot issues

**Data Sources:**
- Nautilus Core broker adapters
- Broker APIs
- Connection status
- Configuration files

---

### DATA & STORAGE (1 page)

#### 9. Database Management (`/admin/database`)

**Lớp Quản Trị:** Nautilus Admin

**Mục Đích:**
- Quản lý 4 database backends
- Monitor database health
- Manage data storage

**Nghiệp Vụ:**

**A. TiDB (MySQL) Management**
- **Purpose:** Web application data
- **Tables:** users, strategies, backtests, etc.
- **Metrics:**
  - Connection status
  - Number of tables
  - Total rows
  - Database size
- **Actions:**
  - View tables
  - Query data
  - Backup/restore
  - Optimize tables

**B. PostgreSQL Management**
- **Purpose:** Nautilus Core data
- **Tables:** 8 tables
  - instruments
  - orders
  - trades
  - positions
  - accounts
  - bars
  - quote_ticks
  - trade_ticks
- **Metrics:**
  - Connection status
  - Table statistics
  - Database size
  - Query performance
- **Actions:**
  - View tables
  - Query data
  - Backup/restore
  - Vacuum/analyze

**C. Redis Management**
- **Purpose:** Cache & real-time state
- **Metrics:**
  - Connection status
  - Number of keys
  - Memory usage
  - Hit rate
- **Actions:**
  - View keys
  - Flush cache
  - Monitor performance
  - Configure eviction

**D. Parquet Management**
- **Purpose:** Archive storage
- **Metrics:**
  - Number of files
  - Total size
  - Directories
- **Actions:**
  - List files
  - Query data
  - Archive old data
  - Cleanup

**User Actions:**
- Monitor database health
- View database statistics
- Query data
- Backup/restore
- Optimize performance

**Data Sources:**
- postgres_manager.py (PostgreSQL)
- redis_manager.py (Redis)
- TiDB connection (via Drizzle ORM)
- Parquet file system

---

### USER & ACCESS (4 pages)

#### 10. Users & Roles (`/admin/users`)

**Lớp Quản Trị:** Nautilus Admin

**Mục Đích:**
- Quản lý user accounts
- Assign roles
- Monitor user activity

**Nghiệp Vụ:**

**A. User Management**
- **User List**
  - View all users
  - Filter by role, status
  - Search users
  
- **User CRUD**
  - Create new user
  - Edit user details (name, email, role)
  - Delete user
  - Deactivate/activate user

- **User Details**
  - Basic info (name, email, created date)
  - Role assignment
  - Permissions
  - Last login
  - Activity history

**B. Role Management**
- **4 Roles:**
  1. **Administrator**
     - Full system access
     - Can manage users
     - Can configure system
     - Can view all data
  
  2. **Trader**
     - Trading operations
     - View own strategies
     - Execute trades
     - View own performance
  
  3. **Analyst**
     - Read-only analytics
     - View all data
     - Generate reports
     - No trading access
  
  4. **Viewer**
     - Read-only monitoring
     - View dashboards
     - No configuration access
     - No trading access

**C. Permission Matrix**
- View permissions by role
- Granular permissions (15+ permissions):
  - view_system_overview
  - manage_users
  - manage_roles
  - configure_risk_limits
  - view_audit_logs
  - manage_api_keys
  - execute_trades
  - view_strategies
  - create_strategies
  - deploy_strategies
  - view_backtests
  - run_backtests
  - view_analytics
  - export_data
  - manage_brokers

**User Actions:**
- Create/edit/delete users
- Assign roles
- View user activity
- Reset passwords
- Manage permissions

**Data Sources:**
- TiDB (users table)
- Authentication system
- Audit logs
- Session management

---

#### 11. Access Control (`/admin/access`)

**Lớp Quản Trị:** Nautilus Admin

**Mục Đích:**
- Configure RBAC policies
- Manage access restrictions
- Enforce security policies

**Nghiệp Vụ:**

**A. RBAC Configuration**
- Define role-based access control
- Configure permission inheritance
- Set default permissions
- Override permissions

**B. IP Whitelist**
- Configure allowed IP addresses
- Block suspicious IPs
- Geo-restrictions
- VPN detection

**C. Session Management**
- Configure session timeout
- Force logout
- View active sessions
- Revoke sessions

**D. Two-Factor Authentication**
- Enable/disable 2FA
- Configure 2FA methods (TOTP, SMS)
- Backup codes
- Recovery options

**User Actions:**
- Configure RBAC
- Manage IP whitelist
- Set session policies
- Configure 2FA
- View access logs

**Data Sources:**
- TiDB (access control tables)
- Authentication system
- Session store (Redis)
- Security policies

---

#### 12. API Keys (`/admin/api-keys`)

**Lớp Quản Trị:** Nautilus Admin

**Mục Đích:**
- Manage API keys for programmatic access
- Monitor API usage
- Enforce rate limits

**Nghiệp Vụ:**

**A. API Key Management**
- **Key List**
  - View all API keys
  - Filter by user, status
  - Search keys
  
- **Key CRUD**
  - Generate new API key
  - Revoke API key
  - Regenerate key
  - Set expiration

- **Key Details**
  - Key ID
  - User
  - Permissions
  - Created date
  - Last used
  - Expiration date

**B. API Usage Monitoring**
- Request count
- Rate limit usage
- Error rate
- Latency metrics

**C. Rate Limiting**
- Configure rate limits per key
- Set burst limits
- Configure throttling
- Alert on limit breach

**D. API Permissions**
- Assign permissions to keys
- Scope restrictions
- IP restrictions
- Time-based restrictions

**User Actions:**
- Generate API keys
- Revoke keys
- Monitor usage
- Configure rate limits
- Set permissions

**Data Sources:**
- TiDB (api_keys table)
- API gateway
- Usage metrics
- Rate limiter (Redis)

---

#### 13. Audit Logs (`/admin/audit`)

**Lớp Quản Trị:** Nautilus Admin + Nautilus Core

**Mục Đích:**
- Track all system changes
- Compliance và accountability
- Security monitoring
- Troubleshooting

**Nghiệp Vụ:**

**A. Audit Log Viewing**
- **Log List**
  - View all audit events
  - Filter by:
    - User
    - Action type
    - Resource
    - Time range
    - Severity
  - Search logs
  - Export logs

**B. Audit Event Types**
- **User Actions:**
  - Login/logout
  - User created/updated/deleted
  - Role changed
  - Password reset
  
- **System Changes:**
  - Configuration changed
  - Component restarted
  - Database backup
  - System upgrade
  
- **Trading Actions:**
  - Order placed
  - Order cancelled
  - Position closed
  - Strategy deployed
  
- **Security Events:**
  - Failed login
  - API key revoked
  - Permission denied
  - Suspicious activity

**C. Audit Log Details**
- Timestamp
- User
- Action
- Resource
- Old value
- New value
- IP address
- User agent
- Result (success/failure)

**D. Compliance Reports**
- Generate compliance reports
- Export to PDF/CSV
- Schedule reports
- Email reports

**User Actions:**
- View audit logs
- Filter/search logs
- Export logs
- Generate reports
- Investigate incidents

**Data Sources:**
- TiDB (audit_logs table)
- PostgreSQL (trading events)
- System logs
- Application logs

---

### CONFIGURATION (2 pages)

#### 14. System Settings (`/admin/settings`)

**Lớp Quản Trị:** Nautilus Admin + Nautilus Core

**Mục Đích:**
- Configure system-wide settings
- Manage environment variables
- Control feature flags

**Nghiệp Vụ:**

**A. Application Settings**
- **General Settings:**
  - Application name
  - Base URL
  - Time zone
  - Language
  - Date/time format
  
- **Email Settings:**
  - SMTP configuration
  - Email templates
  - Notification preferences
  
- **Notification Settings:**
  - Email notifications
  - Slack integration
  - Webhook configuration

**B. Database Settings**
- **PostgreSQL:**
  - Host, port, database
  - User, password
  - Connection pool size
  - Timeout settings
  
- **Redis:**
  - Host, port
  - Password
  - Database number
  - TTL settings
  
- **TiDB:**
  - Connection string
  - Pool size
  - SSL settings
  
- **Parquet:**
  - Storage path
  - Compression
  - Partition strategy

**C. Nautilus Core Settings**
- **Trading Engine:**
  - Order ID format
  - Position ID format
  - Execution mode
  - Logging level
  
- **Risk Settings:**
  - Default risk limits
  - Risk check mode
  - Alert thresholds
  
- **Data Feed Settings:**
  - Default subscriptions
  - Data retention
  - Replay settings

**D. Feature Flags**
- Enable/disable features
- A/B testing
- Gradual rollout
- Feature dependencies

**User Actions:**
- View/edit settings
- Test configurations
- Reset to defaults
- Export/import settings

**Data Sources:**
- Environment variables
- Configuration files
- TiDB (settings table)
- Feature flag service

---

#### 15. Exit Admin (`/admin/exit`)

**Lớp Quản Trị:** Nautilus Admin

**Mục Đích:**
- Safely exit admin panel
- Return to landing page

**Nghiệp Vụ:**

**A. Exit Confirmation**
- Confirm exit intent
- Save unsaved changes
- Log logout event

**B. Session Cleanup**
- Clear session data
- Revoke temporary tokens
- Log audit event

**User Actions:**
- Exit admin panel
- Return to landing page

---

### DOCUMENTATION (6 pages)

#### 16. About (`/docs`)

**Lớp Quản Trị:** N/A (Documentation)

**Mục Đích:**
- Introduce the platform
- Explain purpose và features

**Nghiệp Vụ:**
- Platform overview
- Key features
- Technology stack
- Version information

---

#### 17. Installation (`/docs/installation`)

**Lớp Quản Trị:** N/A (Documentation)

**Mục Đích:**
- Guide users through installation

**Nghiệp Vụ:**
- Prerequisites
- Installation steps
- Configuration guide
- Troubleshooting

---

#### 18. Configuration (`/docs/configuration`)

**Lớp Quản Trị:** N/A (Documentation)

**Mục Đích:**
- Explain configuration options

**Nghiệp Vụ:**
- Environment variables
- Database configuration
- Nautilus Core configuration
- Advanced settings

---

#### 19. API Reference (`/docs/api`)

**Lớp Quản Trị:** N/A (Documentation)

**Mục Đích:**
- Document tRPC APIs

**Nghiệp Vụ:**
- API endpoints (14 routers)
- Request/response formats
- Authentication
- Examples

---

#### 20. Troubleshooting (`/docs/troubleshooting`)

**Lớp Quản Trị:** N/A (Documentation)

**Mục Đích:**
- Help users solve common issues

**Nghiệp Vụ:**
- Common errors
- Solutions
- Debug tips
- Support contacts

---

#### 21. FAQ (`/docs/faq`)

**Lớp Quản Trị:** N/A (Documentation)

**Mục Đích:**
- Answer frequently asked questions

**Nghiệp Vụ:**
- General questions
- Technical questions
- Billing questions
- Feature questions

---

## 🔄 Luồng Nghiệp Vụ Chi Tiết

### Workflow 1: Quản Trị Nautilus Core - System Monitoring

**Actor:** Administrator  
**Goal:** Monitor và maintain Nautilus Core health  
**Frequency:** Continuous (24/7)

**Steps:**

1. **Login to Admin Panel**
   - Navigate to landing page
   - Click "Enter Admin Panel"
   - Authenticate (username/password + 2FA)
   - Redirect to System Overview

2. **View System Overview**
   - Check system status: "All Systems Operational"
   - Review key metrics:
     - Total Orders Today: 12,453
     - Avg Latency: 2.3ms
     - System Uptime: 99.97%
     - Active Connections: 47

3. **Check Component Health**
   - Click "System Components" tab
   - Review 6 core components:
     - Execution Engine: running, 15d 7h 23m, CPU 12%, RAM 2.3GB
     - Data Feed Handler: running, 15d 7h 23m, CPU 8%, RAM 1.1GB
     - Risk Management: running, 15d 7h 23m, CPU 5%, RAM 0.8GB
     - OMS: running, 15d 7h 23m, CPU 7%, RAM 1.5GB
     - Redis: running, 15d 7h 23m, CPU 3%, RAM 0.5GB
     - RabbitMQ: warning, 2d 4h 12m, CPU 15%, RAM 1.2GB ⚠️

4. **Investigate Warning**
   - Notice RabbitMQ has warning status
   - Click on RabbitMQ component
   - Navigate to Component Health page
   - View detailed metrics:
     - High CPU usage (15%)
     - Lower uptime (2d vs 15d)
   - View error logs
   - Identify issue: Message queue backlog

5. **Take Action**
   - Click "Restart" button on RabbitMQ
   - Confirm restart
   - Monitor restart process
   - Verify status changes to "running"
   - Check CPU usage drops to normal

6. **Monitor Data Feeds**
   - Click "Data Feeds" tab
   - Review 14 data feed connections
   - Check all feeds are connected
   - Monitor latency metrics
   - Verify data freshness

7. **Review Resource Usage**
   - Click "Resource Usage" tab
   - Check CPU usage: 45% (normal)
   - Check RAM usage: 7.4GB / 16GB (normal)
   - Check Disk usage: 120GB / 500GB (normal)
   - Check Network I/O: 50 Mbps (normal)

8. **Check Configuration**
   - Click "Configuration" tab
   - Review system configurations
   - Verify all settings are correct
   - No changes needed

9. **Document Issue**
   - Navigate to Audit Logs
   - Verify restart event is logged
   - Add notes if needed

**Success Criteria:**
- All components running
- No warnings or errors
- Metrics within normal range
- Issue resolved and documented

**Data Flow:**
- System Overview → Nautilus Core (via nautilus_bridge.py)
- Component Health → Individual components
- Audit Logs → TiDB (audit_logs table)

---

### Workflow 2: Quản Trị Nautilus Core - Risk Limit Configuration

**Actor:** Risk Manager (Administrator role)  
**Goal:** Configure risk limits để protect against excessive losses  
**Frequency:** Weekly or when needed

**Steps:**

1. **Navigate to Risk Controls**
   - Login to Admin Panel
   - Click "Risk Controls" in sidebar
   - View current risk limits

2. **Review Current Limits**
   - **Position Limits:**
     - Max position size: 1000 contracts
     - Max position value: $100,000
     - Max concentration: 20%
   
   - **Order Limits:**
     - Max order size: 100 contracts
     - Max order value: $10,000
     - Max orders per second: 10
   
   - **Exposure Limits:**
     - Max gross exposure: $500,000
     - Max net exposure: $200,000
     - Max leverage: 5x

3. **Identify Need for Change**
   - Market volatility increased
   - Need to reduce risk exposure
   - Decision: Reduce max position size to 500 contracts

4. **Update Position Limit**
   - Click "Edit" on Position Limits
   - Change max position size: 1000 → 500
   - Add reason: "Increased market volatility"
   - Click "Save"

5. **Verify Change**
   - Confirm limit updated
   - Check audit log entry created
   - Notify traders via email/Slack

6. **Monitor Impact**
   - Navigate to Analytics
   - Monitor position sizes
   - Verify no positions exceed new limit
   - Check for limit breach alerts

7. **Test Pre-Trade Check**
   - Navigate to Execution Management
   - Simulate order placement > 500 contracts
   - Verify order is rejected
   - Check rejection reason: "Exceeds position limit"

8. **Document Change**
   - Navigate to Audit Logs
   - Verify limit change is logged
   - Export audit report
   - Share with compliance team

9. **Review Effectiveness**
   - After 1 week, review analytics
   - Check if limit is too restrictive
   - Adjust if needed

**Success Criteria:**
- Risk limit updated successfully
- Pre-trade checks enforced
- Traders notified
- Change documented
- No unintended impacts

**Data Flow:**
- Risk Controls page → Nautilus Core Risk Management System
- Risk limits → Configuration files
- Audit event → TiDB (audit_logs table)
- Notification → Email/Slack

---

### Workflow 3: Quản Trị Nautilus Admin - User Management

**Actor:** Administrator  
**Goal:** Create new trader account và assign permissions  
**Frequency:** As needed (onboarding)

**Steps:**

1. **Navigate to Users & Roles**
   - Login to Admin Panel
   - Click "Users & Roles" in sidebar
   - View current users list

2. **Create New User**
   - Click "Create User" button
   - Fill in user details:
     - Name: John Doe
     - Email: john.doe@example.com
     - Role: Trader
     - Password: (auto-generated)
   - Click "Create"

3. **Assign Role**
   - User created with "Trader" role
   - Review default permissions:
     - ✅ execute_trades
     - ✅ view_strategies
     - ✅ create_strategies
     - ✅ view_backtests
     - ✅ run_backtests
     - ✅ view_analytics
     - ❌ manage_users
     - ❌ configure_risk_limits
     - ❌ manage_api_keys

4. **Customize Permissions (if needed)**
   - Click "Edit Permissions"
   - Add permission: deploy_strategies
   - Remove permission: create_strategies (for now)
   - Click "Save"

5. **Generate API Key**
   - Navigate to API Keys
   - Click "Generate Key" for John Doe
   - Set permissions: trading_api
   - Set rate limit: 100 req/min
   - Copy API key
   - Send to John via secure channel

6. **Configure Access Control**
   - Navigate to Access Control
   - Add John's IP to whitelist (optional)
   - Enable 2FA requirement
   - Set session timeout: 8 hours

7. **Send Welcome Email**
   - System sends auto email with:
     - Login credentials
     - 2FA setup instructions
     - Getting started guide
     - Support contacts

8. **Verify User Can Login**
   - Ask John to login
   - Verify 2FA setup
   - Verify access to Trader dashboard
   - Verify permissions work correctly

9. **Document User Creation**
   - Navigate to Audit Logs
   - Verify user creation logged
   - Verify permission changes logged
   - Verify API key generation logged

**Success Criteria:**
- User created successfully
- Correct role and permissions assigned
- API key generated
- User can login and access Trader dashboard
- All actions documented in audit logs

**Data Flow:**
- Users & Roles page → TiDB (users table)
- API Keys page → TiDB (api_keys table)
- Access Control → TiDB (access_control table)
- Audit events → TiDB (audit_logs table)
- Email → SMTP server

---

### Workflow 4: Quản Trị Nautilus Admin - Database Management

**Actor:** Database Administrator  
**Goal:** Monitor database health và optimize performance  
**Frequency:** Daily

**Steps:**

1. **Navigate to Database Management**
   - Login to Admin Panel
   - Click "Database Management" in sidebar
   - View overview of 4 databases

2. **Check TiDB (MySQL)**
   - **Status:** Connected ✅
   - **Tables:** 10 tables
   - **Rows:** 1,245,678 rows
   - **Size:** 2.3 GB
   - **Actions:**
     - View tables list
     - Check slow queries
     - Optimize tables if needed

3. **Check PostgreSQL**
   - **Status:** Connected ✅
   - **Tables:** 8 tables
     - instruments: 6 rows, 24 KB
     - orders: 50 rows, 120 KB
     - trades: 30 rows, 80 KB
     - positions: 15 rows, 60 KB
     - accounts: 2 rows, 8 KB
     - bars: 10,000 rows, 5 MB
     - quote_ticks: 100,000 rows, 50 MB
     - trade_ticks: 50,000 rows, 25 MB
   - **Total Size:** 80.3 MB
   - **Actions:**
     - Run VACUUM ANALYZE
     - Check index usage
     - Monitor query performance

4. **Check Redis**
   - **Status:** Connected ✅
   - **Keys:** 1,234 keys
   - **Memory:** 512 MB
   - **Hit Rate:** 95.3% (good)
   - **Actions:**
     - Review key patterns
     - Check for large keys
     - Monitor eviction rate

5. **Check Parquet**
   - **Status:** Ready ✅
   - **Files:** 156 files
   - **Size:** 15.7 GB
   - **Directories:** 12 directories
   - **Actions:**
     - List recent files
     - Check compression ratio
     - Archive old data

6. **Identify Issues**
   - PostgreSQL quote_ticks table growing fast
   - Need to archive old data
   - Decision: Move data older than 30 days to Parquet

7. **Archive Old Data**
   - Query PostgreSQL for old data
   - Export to Parquet format
   - Verify data integrity
   - Delete from PostgreSQL
   - Verify space reclaimed

8. **Optimize Databases**
   - **PostgreSQL:**
     - Run VACUUM ANALYZE
     - Reindex tables
     - Update statistics
   
   - **Redis:**
     - Review eviction policy
     - Adjust maxmemory if needed
   
   - **TiDB:**
     - Optimize slow queries
     - Add indexes if needed

9. **Backup Databases**
   - Schedule automated backups
   - Verify backup success
   - Test restore process (monthly)

10. **Document Maintenance**
    - Navigate to Audit Logs
    - Verify maintenance actions logged
    - Generate maintenance report
    - Share with team

**Success Criteria:**
- All databases healthy
- Performance optimized
- Old data archived
- Backups successful
- Maintenance documented

**Data Flow:**
- Database Management page → postgres_manager.py, redis_manager.py
- PostgreSQL → Parquet (archiving)
- Audit events → TiDB (audit_logs table)

---

## 👥 Vai Trò và Quyền Hạn

### Administrator

**Responsibilities:**
- Quản trị toàn bộ hệ thống (Nautilus Core + Admin)
- Monitor system health 24/7
- Configure risk limits và system settings
- Manage users và access control
- Troubleshoot issues
- Ensure compliance

**Permissions (15 permissions):**
- ✅ view_system_overview
- ✅ manage_users
- ✅ manage_roles
- ✅ configure_risk_limits
- ✅ view_audit_logs
- ✅ manage_api_keys
- ✅ execute_trades (for testing)
- ✅ view_strategies
- ✅ create_strategies (for testing)
- ✅ deploy_strategies
- ✅ view_backtests
- ✅ run_backtests
- ✅ view_analytics
- ✅ export_data
- ✅ manage_brokers

**Access:**
- Full access to Admin Panel (21 pages)
- Full access to Trader Dashboard (25 pages)
- Full access to all APIs
- Full access to all databases

---

### Trader

**Responsibilities:**
- Execute trading strategies
- Monitor positions và P&L
- Develop và test strategies
- Analyze performance

**Permissions (7 permissions):**
- ✅ execute_trades
- ✅ view_strategies (own only)
- ✅ create_strategies
- ✅ deploy_strategies (own only)
- ✅ view_backtests (own only)
- ✅ run_backtests
- ✅ view_analytics (own only)

**Access:**
- No access to Admin Panel
- Full access to Trader Dashboard (25 pages)
- Limited API access (trading APIs only)
- Read-only access to PostgreSQL (own data)

---

### Analyst

**Responsibilities:**
- Analyze trading performance
- Generate reports
- Identify patterns và trends
- Support decision making

**Permissions (3 permissions):**
- ✅ view_strategies (all)
- ✅ view_backtests (all)
- ✅ view_analytics (all)
- ✅ export_data

**Access:**
- Limited access to Admin Panel (Analytics, Audit Logs)
- Read-only access to Trader Dashboard
- Read-only API access
- Read-only access to all databases

---

### Viewer

**Responsibilities:**
- Monitor system status
- View dashboards
- No operational access

**Permissions (1 permission):**
- ✅ view_system_overview

**Access:**
- Read-only access to Admin Panel (System Overview, Analytics)
- Read-only access to Trader Dashboard (Dashboard only)
- No API access
- No database access

---

## 📊 Tổng Kết

### Admin Panel Quản Trị 2 Lớp

**Lớp 1: Nautilus Core (Trading Engine)**
- 6 core components
- 64 features
- 126 services
- 14+ brokers/exchanges
- Real-time trading operations

**Lớp 2: Nautilus Admin (Web Interface)**
- 4 databases (TiDB, PostgreSQL, Redis, Parquet)
- User management (4 roles)
- Access control (RBAC)
- API management
- Audit & compliance

### 21 Admin Pages Breakdown

**Dashboard (2 pages):**
1. System Overview - Both layers
2. Analytics - Both layers

**Nautilus Core (6 pages):**
3. Core Management - Core layer
4. Component Health - Core layer
5. Data Feeds - Core layer
6. Execution Management - Core layer
7. Risk Controls - Core layer
8. Broker Integration - Core layer

**Data & Storage (1 page):**
9. Database Management - Admin layer

**User & Access (4 pages):**
10. Users & Roles - Admin layer
11. Access Control - Admin layer
12. API Keys - Admin layer
13. Audit Logs - Both layers

**Configuration (2 pages):**
14. System Settings - Both layers
15. Exit Admin - Admin layer

**Documentation (6 pages):**
16-21. Docs pages - N/A

### Key Insights

**Dual Management:**
- Admin Panel manages BOTH Nautilus Core và Nautilus Admin
- Clear separation of concerns
- Unified monitoring và control

**Comprehensive Coverage:**
- System monitoring
- Component management
- Risk control
- User management
- Access control
- Audit & compliance
- Database management

**Enterprise-Ready:**
- RBAC với 4 roles
- 15+ granular permissions
- Audit logging
- API management
- Multi-database support

**Scalable Architecture:**
- 4-tier architecture
- Type-safe APIs (tRPC)
- Event-driven
- Microservices-ready

---

**Document Version:** 2.0  
**Last Updated:** October 19, 2025  
**Next Review:** As needed based on system changes

