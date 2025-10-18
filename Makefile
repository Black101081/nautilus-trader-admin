.PHONY: help build start stop restart logs shell db-shell populate clean dev dev-stop prod prod-stop

# Default target
help:
	@echo "Nautilus Trader Admin - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-stop     - Stop development environment"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-stop    - Stop production environment"
	@echo "  make prod-logs    - View production logs"
	@echo ""
	@echo "Database:"
	@echo "  make populate     - Populate database with test data"
	@echo "  make db-shell     - Open PostgreSQL shell"
	@echo "  make mysql-shell  - Open MySQL shell"
	@echo "  make redis-shell  - Open Redis CLI"
	@echo ""
	@echo "Utilities:"
	@echo "  make build        - Build Docker images"
	@echo "  make logs         - View all logs"
	@echo "  make shell        - Open shell in web container"
	@echo "  make restart      - Restart all services"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make status       - Show container status"
	@echo ""

# Development
dev:
	@echo "Starting development environment..."
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "Web: http://localhost:3000"

dev-stop:
	@echo "Stopping development environment..."
	@docker-compose -f docker-compose.dev.yml down

dev-logs:
	@docker-compose -f docker-compose.dev.yml logs -f

# Production
prod:
	@echo "Starting production environment..."
	@docker-compose up -d
	@echo "Production environment started!"
	@echo "Web: http://localhost:3000"

prod-stop:
	@echo "Stopping production environment..."
	@docker-compose down

prod-logs:
	@docker-compose logs -f

# Build
build:
	@echo "Building Docker images..."
	@docker-compose build

build-no-cache:
	@echo "Building Docker images (no cache)..."
	@docker-compose build --no-cache

# Database
populate:
	@echo "Populating database with test data..."
	@bash scripts/populate-data.sh

db-shell:
	@echo "Opening PostgreSQL shell..."
	@docker-compose exec postgres psql -U nautilus_user -d nautilus

mysql-shell:
	@echo "Opening MySQL shell..."
	@docker-compose exec mysql mysql -u nautilus_web -pnautilus_web_pass nautilus_web

redis-shell:
	@echo "Opening Redis CLI..."
	@docker-compose exec redis redis-cli

# Utilities
shell:
	@echo "Opening shell in web container..."
	@docker-compose exec web sh

logs:
	@docker-compose logs -f

restart:
	@echo "Restarting all services..."
	@docker-compose restart

status:
	@docker-compose ps

clean:
	@echo "Removing all containers and volumes..."
	@docker-compose down -v
	@docker-compose -f docker-compose.dev.yml down -v
	@echo "Cleaned!"

# Backup
backup:
	@echo "Creating database backups..."
	@mkdir -p backups
	@docker-compose exec postgres pg_dump -U nautilus_user nautilus | gzip > backups/postgres-$$(date +%Y%m%d-%H%M%S).sql.gz
	@docker-compose exec mysql mysqldump -u nautilus_web -pnautilus_web_pass nautilus_web | gzip > backups/mysql-$$(date +%Y%m%d-%H%M%S).sql.gz
	@echo "Backups created in ./backups/"

# Update
update:
	@echo "Updating from Git..."
	@git pull
	@echo "Rebuilding containers..."
	@docker-compose down
	@docker-compose build
	@docker-compose up -d
	@echo "Updated!"

