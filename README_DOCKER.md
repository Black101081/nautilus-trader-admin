# 🐳 Nautilus Trader Admin - Docker Quick Start

**Complete trading administration interface for NautilusTrader with Docker deployment**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Quick Start (5 minutes)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- 4GB RAM minimum

### 1. Clone Repository

```bash
git clone https://github.com/Black101081/nautilus-trader-admin.git
cd nautilus-trader-admin
```

### 2. Start Application

```bash
# Production mode
make prod

# Or development mode (with hot-reload)
make dev
```

### 3. Populate Test Data

```bash
make populate
```

### 4. Access Application

Open your browser: **http://localhost:3000**

**That's it!** 🎉

---

## 📊 What's Included

### Services

- ✅ **Web Application** - React 19.1.1 + TypeScript + Node.js
- ✅ **PostgreSQL** - Nautilus Core data storage
- ✅ **Redis** - Cache and live trading state
- ✅ **MySQL** - Web interface data

### Features

- ✅ **46 Pages** - Complete admin and trader interfaces
- ✅ **Auto-setup** - Databases initialized automatically
- ✅ **Test Data** - Sample data included
- ✅ **Hot-reload** - Development mode with instant updates
- ✅ **Production-ready** - Optimized Docker images

---

## 🎯 Common Commands

### Using Make (Recommended)

```bash
# Development
make dev          # Start dev environment
make dev-stop     # Stop dev environment
make dev-logs     # View dev logs

# Production
make prod         # Start prod environment
make prod-stop    # Stop prod environment
make prod-logs    # View prod logs

# Database
make populate     # Add test data
make db-shell     # PostgreSQL shell
make mysql-shell  # MySQL shell
make redis-shell  # Redis CLI

# Utilities
make logs         # View all logs
make shell        # Container shell
make status       # Container status
make clean        # Remove everything
make backup       # Backup databases
```

### Using Scripts

```bash
# Start
./scripts/docker-start.sh       # Production
./scripts/docker-start-dev.sh   # Development

# Stop
./scripts/docker-stop.sh

# Populate data
./scripts/populate-data.sh
```

### Using Docker Compose Directly

```bash
# Production
docker-compose up -d
docker-compose down

# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
cp .env.docker.example .env
```

Edit `.env` and update:

```bash
# Security (IMPORTANT!)
JWT_SECRET=your-very-long-random-secret-here

# Database passwords
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-secure-password
MYSQL_PASSWORD=your-secure-password

# Application
APP_URL=http://localhost:3000
WEB_PORT=3000
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` and passwords in production!

---

## 📁 Project Structure

```
nautilus-trader-admin/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # 46 pages
│   │   ├── components/    # UI components
│   │   └── lib/           # Utilities
│   └── package.json
├── server/                 # Node.js backend
│   ├── routers.ts         # tRPC routers
│   ├── nautilus_bridge.py # Python bridge
│   └── *.py               # Python modules
├── docker/                 # Docker configs
│   ├── init-postgres.sql  # PostgreSQL init
│   └── init-mysql.sql     # MySQL init
├── scripts/                # Convenience scripts
│   ├── docker-start.sh    # Start production
│   ├── docker-start-dev.sh # Start development
│   ├── docker-stop.sh     # Stop services
│   └── populate-data.sh   # Populate database
├── Dockerfile              # Production image
├── Dockerfile.dev          # Development image
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── Makefile                # Make commands
└── README.md               # This file
```

---

## 🌐 Access Points

### Web Interface

- **Main:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Trader Dashboard:** http://localhost:3000/trader

### Database Connections

**Production:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MySQL: `localhost:3306`

**Development:**
- PostgreSQL: `localhost:5433`
- Redis: `localhost:6380`
- MySQL: `localhost:3307`

---

## 📚 Documentation

- **[Docker Deployment Guide](DOCKER_DEPLOYMENT.md)** - Complete Docker documentation
- **[Deployment Plan](DEPLOYMENT_PLAN_V2.md)** - Comprehensive deployment strategy
- **[Phase 1 Report](PHASE_1_FINAL_REPORT.md)** - Phase 1 completion report
- **[Phase 2 Plan](PHASE_2_PLAN.md)** - Phase 2 roadmap
- **[Nautilus Ecosystem](NAUTILUS_ECOSYSTEM_ANALYSIS.md)** - Nautilus Core analysis

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in .env
WEB_PORT=3001
```

### Container Won't Start

```bash
# Check logs
make logs

# Or specific service
docker-compose logs web
```

### Database Connection Failed

```bash
# Wait for databases to be healthy
docker-compose ps

# Check database logs
docker-compose logs postgres
```

### Reset Everything

```bash
# Remove all containers and volumes
make clean

# Start fresh
make prod
```

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for more troubleshooting.

---

## 🚀 Production Deployment

### Deploy to VPS

```bash
# 1. SSH to server
ssh user@your-server

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone repo
git clone https://github.com/Black101081/nautilus-trader-admin.git
cd nautilus-trader-admin

# 4. Configure
cp .env.docker.example .env
nano .env  # Edit passwords and secrets

# 5. Start
make prod

# 6. Setup Nginx + SSL (see DOCKER_DEPLOYMENT.md)
```

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for complete production guide.

---

## 🔒 Security

**Before deploying to production:**

1. ✅ Change `JWT_SECRET` to a long random string
2. ✅ Change all database passwords
3. ✅ Setup HTTPS with SSL certificate
4. ✅ Configure firewall (only ports 80, 443, 22)
5. ✅ Setup regular backups
6. ✅ Enable monitoring and logging

---

## 📊 System Requirements

### Minimum

- 2 CPU cores
- 4GB RAM
- 10GB disk space

### Recommended

- 4 CPU cores
- 8GB RAM
- 20GB disk space

### Optimal

- 8 CPU cores
- 16GB RAM
- 50GB SSD

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **[NautilusTrader](https://nautilustrader.io/)** - High-performance trading platform
- **[Nautilus Systems](https://github.com/nautechsystems)** - Core development team
- **Docker** - Containerization platform

---

## 📞 Support

- **Issues:** https://github.com/Black101081/nautilus-trader-admin/issues
- **Documentation:** See `*.md` files in repository
- **Nautilus Docs:** https://nautilustrader.io/docs/

---

**Built with ❤️ by Manus AI Assistant**

**Last Updated:** October 19, 2025

