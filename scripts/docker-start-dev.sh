#!/bin/bash

# Nautilus Trader Admin - Docker Start Script (Development)
# This script starts all services in development mode with hot-reload

set -e

echo "=========================================="
echo "Nautilus Trader Admin - Docker Start (Dev)"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Stop existing containers (if any)
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
echo ""

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.dev.yml pull
echo ""

# Build web application
echo "🔨 Building web application (dev mode)..."
docker-compose -f docker-compose.dev.yml build web
echo ""

# Start all services
echo "🚀 Starting all services..."
docker-compose -f docker-compose.dev.yml up -d
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.dev.yml ps
echo ""

# Show logs
echo "📝 Recent logs:"
docker-compose -f docker-compose.dev.yml logs --tail=20
echo ""

echo "=========================================="
echo "✅ Nautilus Trader Admin (Dev) is running!"
echo "=========================================="
echo ""
echo "🌐 Web Interface: http://localhost:3000"
echo "   (Hot-reload enabled)"
echo ""
echo "📊 Database Connections:"
echo "   PostgreSQL: localhost:5433"
echo "   Redis:      localhost:6380"
echo "   MySQL:      localhost:3307"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services:    docker-compose -f docker-compose.dev.yml down"
echo "   Restart:          docker-compose -f docker-compose.dev.yml restart"
echo "   Shell (web):      docker-compose -f docker-compose.dev.yml exec web sh"
echo ""
echo "⚠️  To populate test data, run:"
echo "   docker-compose -f docker-compose.dev.yml exec web python3 server/populate_database.py"
echo ""
echo "💡 Tip: Edit files in client/ or server/ and they will hot-reload automatically!"
echo ""

