# 🐳 Docker Deployment Guide - Nautilus Trader Admin

**Version:** 1.0  
**Last Updated:** October 19, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Architecture](#architecture)
5. [Configuration](#configuration)
6. [Development Mode](#development-mode)
7. [Production Deployment](#production-deployment)
8. [Database Management](#database-management)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced-topics)

---

## Overview

This Docker setup provides a complete containerized deployment of Nautilus Trader Admin with:

- **Web Application** (React + Node.js + TypeScript)
- **PostgreSQL** (Nautilus Core data)
- **Redis** (Cache and live state)
- **MySQL** (Web interface data)
- **Automated setup** with init scripts
- **Hot-reload** for development
- **Production-ready** configuration

---

## Prerequisites

### Required Software

- **Docker** 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- **Git** (to clone repository)

### System Requirements

**Minimum:**
- 2 CPU cores
- 4GB RAM
- 10GB disk space
- Linux, macOS, or Windows with WSL2

**Recommended:**
- 4 CPU cores
- 8GB RAM
- 20GB disk space

### Verify Installation

```bash
# Check Docker
docker --version
# Expected: Docker version 20.10.0 or higher

# Check Docker Compose
docker-compose --version
# Expected: Docker Compose version 2.0.0 or higher

# Check Docker is running
docker info
# Should show Docker info without errors
```

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Black101081/nautilus-trader-admin.git
cd nautilus-trader-admin
```

### 2. Start Services (Production)

```bash
# Using the convenience script
./scripts/docker-start.sh

# Or manually
docker-compose up -d
```

### 3. Populate Test Data

```bash
# Using the convenience script
./scripts/populate-data.sh

# Or manually
docker-compose exec web python3 server/populate_database.py
```

### 4. Access Application

Open your browser and navigate to:
- **Web Interface:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Trader Dashboard:** http://localhost:3000/trader

### 5. Stop Services

```bash
# Using the convenience script
./scripts/docker-stop.sh

# Or manually
docker-compose down
```

---

## Architecture

### Container Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                  (nautilus-network)                      │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │    MySQL     │  │
│  │   Port 5432  │  │  Port 6379   │  │  Port 3306   │  │
│  │              │  │              │  │              │  │
│  │ Nautilus     │  │ Cache &      │  │ Web DB       │  │
│  │ Core Data    │  │ Live State   │  │ (Drizzle)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│                   ┌────────▼────────┐                    │
│                   │  Web Container  │                    │
│                   │   Port 3000     │                    │
│                   │                 │                    │
│                   │ React Frontend  │                    │
│                   │ Node.js Backend │                    │
│                   │ Python Bridge   │                    │
│                   │ Nautilus Core   │                    │
│                   └─────────────────┘                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    Host Port 3000
```

### Volumes

```
postgres_data     → /var/lib/postgresql/data
redis_data        → /data
mysql_data        → /var/lib/mysql
nautilus_data     → /app/nautilus-data
```

### Networks

- **nautilus-network** (bridge): Internal network for container communication

---

## Configuration

### Environment Variables

Create a `.env` file from the example:

```bash
cp .env.docker.example .env
```

Edit `.env` and configure:

```bash
# Database passwords
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-secure-password
MYSQL_PASSWORD=your-secure-password
MYSQL_ROOT_PASSWORD=your-secure-root-password

# JWT Secret (IMPORTANT: Change in production!)
JWT_SECRET=your-very-long-random-secret-string-here

# Application URL
APP_URL=https://your-domain.com

# Ports (optional, defaults shown)
WEB_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
MYSQL_PORT=3306
```

### Security Best Practices

**⚠️ IMPORTANT for Production:**

1. **Change all default passwords**
2. **Use a strong JWT secret** (at least 32 characters)
3. **Use HTTPS** (setup reverse proxy with SSL)
4. **Restrict database ports** (don't expose to public)
5. **Regular backups** (see Database Management section)

---

## Development Mode

Development mode includes:
- ✅ Hot-reload for code changes
- ✅ Source code mounted as volumes
- ✅ Different ports to avoid conflicts
- ✅ Debug logging enabled

### Start Development Environment

```bash
# Using the convenience script
./scripts/docker-start-dev.sh

# Or manually
docker-compose -f docker-compose.dev.yml up -d
```

### Development Ports

- **Web:** http://localhost:3000 (hot-reload enabled)
- **PostgreSQL:** localhost:5433
- **Redis:** localhost:6380
- **MySQL:** localhost:3307

### View Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f web
```

### Make Code Changes

Simply edit files in `client/` or `server/` directories. Changes will be automatically detected and the application will reload.

### Stop Development Environment

```bash
docker-compose -f docker-compose.dev.yml down
```

---

## Production Deployment

### Local Production Testing

```bash
# Start production containers
./scripts/docker-start.sh

# Populate test data
./scripts/populate-data.sh

# Access at http://localhost:3000
```

### Deploy to VPS/Cloud

#### 1. Provision Server

Requirements:
- Ubuntu 22.04 LTS (recommended)
- 4GB RAM minimum
- 20GB disk space
- Public IP address

#### 2. Install Docker

```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### 3. Clone Repository

```bash
git clone https://github.com/Black101081/nautilus-trader-admin.git
cd nautilus-trader-admin
```

#### 4. Configure Environment

```bash
# Create .env file
cp .env.docker.example .env

# Edit with secure passwords
nano .env
```

**Important:** Change these values:
- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `JWT_SECRET`
- `APP_URL`

#### 5. Start Services

```bash
# Start all services
./scripts/docker-start.sh

# Check status
docker-compose ps
```

#### 6. Setup Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/nautilus
```

Add this configuration:

```nginx
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
```

Enable site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nautilus /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 7. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

#### 8. Setup Firewall

```bash
# Install UFW
sudo apt-get install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

#### 9. Setup Auto-Start

```bash
# Create systemd service
sudo nano /etc/systemd/system/nautilus-trader.service
```

Add this content:

```ini
[Unit]
Description=Nautilus Trader Admin
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/nautilus-trader-admin
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ubuntu

[Install]
WantedBy=multi-user.target
```

Enable service:

```bash
sudo systemctl enable nautilus-trader
sudo systemctl start nautilus-trader
```

---

## Database Management

### Backup Databases

#### PostgreSQL Backup

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U nautilus_user nautilus > backup-postgres-$(date +%Y%m%d).sql

# Or using the backup script
docker-compose exec postgres pg_dump -U nautilus_user nautilus | gzip > backup-postgres-$(date +%Y%m%d).sql.gz
```

#### MySQL Backup

```bash
# Backup MySQL
docker-compose exec mysql mysqldump -u nautilus_web -pnautilus_web_pass nautilus_web > backup-mysql-$(date +%Y%m%d).sql

# Or with compression
docker-compose exec mysql mysqldump -u nautilus_web -pnautilus_web_pass nautilus_web | gzip > backup-mysql-$(date +%Y%m%d).sql.gz
```

#### Redis Backup

```bash
# Redis automatically saves to disk
# Copy the dump file
docker cp nautilus-redis:/data/dump.rdb backup-redis-$(date +%Y%m%d).rdb
```

### Restore Databases

#### PostgreSQL Restore

```bash
# Restore PostgreSQL
cat backup-postgres-20251019.sql | docker-compose exec -T postgres psql -U nautilus_user nautilus

# Or from gzipped backup
gunzip -c backup-postgres-20251019.sql.gz | docker-compose exec -T postgres psql -U nautilus_user nautilus
```

#### MySQL Restore

```bash
# Restore MySQL
cat backup-mysql-20251019.sql | docker-compose exec -T mysql mysql -u nautilus_web -pnautilus_web_pass nautilus_web

# Or from gzipped backup
gunzip -c backup-mysql-20251019.sql.gz | docker-compose exec -T mysql mysql -u nautilus_web -pnautilus_web_pass nautilus_web
```

### Database Shell Access

```bash
# PostgreSQL shell
docker-compose exec postgres psql -U nautilus_user -d nautilus

# MySQL shell
docker-compose exec mysql mysql -u nautilus_web -pnautilus_web_pass nautilus_web

# Redis CLI
docker-compose exec redis redis-cli
```

### View Database Data

```bash
# PostgreSQL - List tables
docker-compose exec postgres psql -U nautilus_user -d nautilus -c "\dt"

# PostgreSQL - Count records
docker-compose exec postgres psql -U nautilus_user -d nautilus -c "SELECT COUNT(*) FROM orders;"

# MySQL - List tables
docker-compose exec mysql mysql -u nautilus_web -pnautilus_web_pass nautilus_web -e "SHOW TABLES;"

# Redis - Get all keys
docker-compose exec redis redis-cli KEYS '*'
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :3000

# Kill the process or change port in .env
WEB_PORT=3001
```

#### 2. Container Won't Start

**Error:** Container exits immediately

**Solution:**
```bash
# Check logs
docker-compose logs web

# Check if all dependencies are healthy
docker-compose ps

# Restart specific service
docker-compose restart web
```

#### 3. Database Connection Failed

**Error:** `ECONNREFUSED` or `Connection refused`

**Solution:**
```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Wait for database to be healthy
docker-compose up -d
sleep 30
docker-compose ps
```

#### 4. Permission Denied

**Error:** `Permission denied` when running scripts

**Solution:**
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Or run with bash
bash scripts/docker-start.sh
```

#### 5. Out of Disk Space

**Error:** `no space left on device`

**Solution:**
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove old images
docker image prune -a
```

### Debugging Commands

```bash
# View all containers
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f web

# Execute command in container
docker-compose exec web sh

# Check container resource usage
docker stats

# Inspect container
docker inspect nautilus-web

# Check network
docker network inspect nautilus-trader-admin_nautilus-network
```

### Reset Everything

```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
./scripts/docker-start.sh
```

---

## Advanced Topics

### Custom Docker Build

```bash
# Build with no cache
docker-compose build --no-cache

# Build specific service
docker-compose build web

# Build with build args
docker-compose build --build-arg NODE_ENV=production web
```

### Multi-Stage Build Optimization

The Dockerfile uses multi-stage builds to:
1. **Reduce image size** (production image ~500MB vs ~2GB)
2. **Improve security** (no build tools in production)
3. **Faster deployments** (smaller images)

### Health Checks

All services have health checks:

```bash
# Check health status
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' nautilus-web | jq
```

### Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Monitoring

#### Container Logs

```bash
# View logs with timestamps
docker-compose logs -f --timestamps

# Follow logs from specific time
docker-compose logs --since 2024-10-19T10:00:00

# Save logs to file
docker-compose logs > logs-$(date +%Y%m%d).txt
```

#### Resource Monitoring

```bash
# Real-time stats
docker stats

# Export stats to CSV
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" > stats.csv
```

### Scaling

```bash
# Scale web service (requires load balancer)
docker-compose up -d --scale web=3

# Note: You'll need to setup a load balancer (Nginx, HAProxy, etc.)
```

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd nautilus-trader-admin
            git pull
            docker-compose down
            docker-compose build
            docker-compose up -d
```

### Docker Registry

Push to Docker Hub:

```bash
# Tag image
docker tag nautilus-trader-admin:latest your-username/nautilus-trader-admin:latest

# Push to Docker Hub
docker push your-username/nautilus-trader-admin:latest

# Pull on another server
docker pull your-username/nautilus-trader-admin:latest
```

---

## Support

### Getting Help

- **GitHub Issues:** https://github.com/Black101081/nautilus-trader-admin/issues
- **Documentation:** See other `.md` files in repository
- **Nautilus Trader Docs:** https://nautilustrader.io/docs/

### Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nautilus Trader Documentation](https://nautilustrader.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## Changelog

### Version 1.0 (2025-10-19)
- ✅ Initial Docker setup
- ✅ Multi-stage Dockerfile for production
- ✅ Development Dockerfile with hot-reload
- ✅ Docker Compose for all services
- ✅ Automated init scripts for databases
- ✅ Convenience scripts for common operations
- ✅ Comprehensive documentation

---

**Created by:** Manus AI Assistant  
**Date:** October 19, 2025  
**License:** MIT

