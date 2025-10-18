#!/bin/bash

# Nautilus Trader Admin - Docker Stop Script
# This script stops all Docker services

set -e

echo "=========================================="
echo "Nautilus Trader Admin - Docker Stop"
echo "=========================================="
echo ""

# Check which compose file is running
if docker-compose ps | grep -q "nautilus"; then
    echo "🛑 Stopping production services..."
    docker-compose down
    echo "✅ Production services stopped"
fi

if docker-compose -f docker-compose.dev.yml ps 2>/dev/null | grep -q "nautilus"; then
    echo "🛑 Stopping development services..."
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Development services stopped"
fi

echo ""
echo "✅ All services stopped"
echo ""

# Ask if user wants to remove volumes
read -p "Do you want to remove data volumes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing volumes..."
    docker-compose down -v 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    echo "✅ Volumes removed"
    echo "⚠️  All data has been deleted!"
else
    echo "✅ Volumes preserved"
    echo "💡 Data will be available when you restart"
fi

echo ""

