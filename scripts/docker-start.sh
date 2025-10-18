#!/bin/bash

# Nautilus Trader Admin - Docker Start Script (Production)
# This script starts all services in production mode

set -e

echo "=========================================="
echo "Nautilus Trader Admin - Docker Start"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.docker.example..."
    cp .env.docker.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and update the following:"
    echo "   - JWT_SECRET (use a long random string)"
    echo "   - Database passwords (if deploying to production)"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit and edit .env..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed!"
    echo "Please install docker-compose and try again."
    exit 1
fi

echo "✅ docker-compose is available"
echo ""

# Stop existing containers (if any)
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true
echo ""

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose pull
echo ""

# Build web application
echo "🔨 Building web application..."
docker-compose build --no-cache web
echo ""

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""

# Show logs
echo "📝 Recent logs:"
docker-compose logs --tail=20
echo ""

# Check health
echo "🏥 Health Check:"
for service in postgres redis mysql web; do
    status=$(docker-compose ps -q $service | xargs docker inspect -f '{{.State.Health.Status}}' 2>/dev/null || echo "no healthcheck")
    if [ "$status" = "healthy" ]; then
        echo "  ✅ $service: healthy"
    elif [ "$status" = "no healthcheck" ]; then
        running=$(docker-compose ps -q $service | xargs docker inspect -f '{{.State.Running}}' 2>/dev/null || echo "false")
        if [ "$running" = "true" ]; then
            echo "  ✅ $service: running (no healthcheck)"
        else
            echo "  ❌ $service: not running"
        fi
    else
        echo "  ⚠️  $service: $status"
    fi
done
echo ""

# Get web URL
WEB_PORT=$(grep WEB_PORT .env | cut -d '=' -f2 || echo "3000")
echo "=========================================="
echo "✅ Nautilus Trader Admin is running!"
echo "=========================================="
echo ""
echo "🌐 Web Interface: http://localhost:${WEB_PORT}"
echo ""
echo "📊 Database Connections:"
echo "   PostgreSQL: localhost:5432"
echo "   Redis:      localhost:6379"
echo "   MySQL:      localhost:3306"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Shell (web):      docker-compose exec web sh"
echo "   Shell (postgres): docker-compose exec postgres psql -U nautilus_user -d nautilus"
echo ""
echo "⚠️  To populate test data, run:"
echo "   docker-compose exec web python3 server/populate_database.py"
echo ""

