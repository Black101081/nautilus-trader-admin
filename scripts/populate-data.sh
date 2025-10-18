#!/bin/bash

# Nautilus Trader Admin - Populate Database Script
# This script populates the database with test data

set -e

echo "=========================================="
echo "Nautilus Trader Admin - Populate Data"
echo "=========================================="
echo ""

# Check if containers are running
if ! docker-compose ps | grep -q "nautilus-web"; then
    if ! docker-compose -f docker-compose.dev.yml ps | grep -q "nautilus-web-dev"; then
        echo "❌ No running containers found!"
        echo "Please start the application first:"
        echo "  Production: ./scripts/docker-start.sh"
        echo "  Development: ./scripts/docker-start-dev.sh"
        exit 1
    fi
    COMPOSE_FILE="docker-compose.dev.yml"
    CONTAINER="nautilus-web-dev"
else
    COMPOSE_FILE="docker-compose.yml"
    CONTAINER="nautilus-web"
fi

echo "✅ Found running container: $CONTAINER"
echo ""

# Run populate script
echo "🔄 Populating database with test data..."
echo ""

if [ "$COMPOSE_FILE" = "docker-compose.dev.yml" ]; then
    docker-compose -f docker-compose.dev.yml exec web python3 server/populate_database.py
else
    docker-compose exec web python3 server/populate_database.py
fi

echo ""
echo "=========================================="
echo "✅ Database populated successfully!"
echo "=========================================="
echo ""
echo "📊 Test data created:"
echo "   - 6 instruments (BTC, ETH, EUR/USD, GBP/USD, USD/JPY, AUD/USD)"
echo "   - 50 orders (various statuses)"
echo "   - 30 trades (with P&L)"
echo "   - 15 positions (open and closed)"
echo ""
echo "🌐 You can now view the data at:"
echo "   http://localhost:3000"
echo ""

