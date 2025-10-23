# ============================================
# Van Phuc Care - Makefile
# Quick commands for Docker operations
# ============================================

.PHONY: help build up down restart logs status clean dev prod

# Default target
help:
	@echo "🐳 Van Phuc Care - Docker Commands"
	@echo ""
	@echo "Production:"
	@echo "  make build     - Build all production images"
	@echo "  make up        - Start all production services"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make logs      - View logs (all services)"
	@echo "  make status    - Check service status"
	@echo ""
	@echo "Development:"
	@echo "  make dev-up    - Start development environment"
	@echo "  make dev-down  - Stop development environment"
	@echo "  make dev-logs  - View development logs"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean     - Clean Docker system"
	@echo "  make prune     - Remove unused images/containers"
	@echo "  make shell-admin - Shell into admin container"
	@echo "  make shell-crm   - Shell into CRM container"
	@echo ""
	@echo "Monitoring:"
	@echo "  make stats     - View container resource usage"
	@echo "  make health    - Check health status"

# ============================================
# Production Commands
# ============================================

build:
	@echo "🔨 Building production images..."
	docker compose build

up:
	@echo "🚀 Starting production services..."
	docker compose up -d

down:
	@echo "🛑 Stopping all services..."
	docker compose down

restart:
	@echo "🔄 Restarting services..."
	docker compose restart

logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker compose logs -f

logs-admin:
	@echo "📋 Viewing Admin logs..."
	docker compose logs -f admin

logs-crm:
	@echo "📋 Viewing CRM logs..."
	docker compose logs -f crm

logs-elearning:
	@echo "📋 Viewing E-Learning logs..."
	docker compose logs -f elearning

status:
	@echo "📊 Service Status:"
	docker compose ps

# ============================================
# Development Commands
# ============================================

dev-up:
	@echo "🛠️  Starting development environment..."
	docker compose -f docker-compose.dev.yml up -d

dev-down:
	@echo "🛑 Stopping development environment..."
	docker compose -f docker-compose.dev.yml down

dev-logs:
	@echo "📋 Viewing development logs..."
	docker compose -f docker-compose.dev.yml logs -f

dev-restart:
	@echo "🔄 Restarting dev services..."
	docker compose -f docker-compose.dev.yml restart

# ============================================
# Service-specific Commands
# ============================================

admin-restart:
	@echo "🔄 Restarting Admin service..."
	docker compose restart admin

crm-restart:
	@echo "🔄 Restarting CRM service..."
	docker compose restart crm

elearning-restart:
	@echo "🔄 Restarting E-Learning service..."
	docker compose restart elearning

# ============================================
# Shell Access
# ============================================

shell-admin:
	@echo "💻 Opening shell in Admin container..."
	docker compose exec admin sh

shell-crm:
	@echo "💻 Opening shell in CRM container..."
	docker compose exec crm sh

shell-elearning:
	@echo "💻 Opening shell in E-Learning container..."
	docker compose exec elearning sh

# ============================================
# Maintenance Commands
# ============================================

clean:
	@echo "🧹 Cleaning Docker system..."
	docker system prune -f

prune:
	@echo "🗑️  Removing unused images and containers..."
	docker system prune -a -f

prune-volumes:
	@echo "⚠️  Removing all volumes (data will be lost)..."
	docker volume prune -f

rebuild:
	@echo "🔨 Rebuilding without cache..."
	docker compose build --no-cache

rebuild-admin:
	docker compose build --no-cache admin

rebuild-crm:
	docker compose build --no-cache crm

rebuild-elearning:
	docker compose build --no-cache elearning

# ============================================
# Monitoring Commands
# ============================================

stats:
	@echo "📊 Container resource usage:"
	docker stats

health:
	@echo "🏥 Checking health status..."
	@curl -s http://localhost:3000/api/_health || echo "❌ Admin not healthy"
	@curl -s http://localhost:3001/api/_health || echo "❌ CRM not healthy"
	@curl -s http://localhost:3002/api/_health || echo "❌ E-Learning not healthy"

disk-usage:
	@echo "💾 Docker disk usage:"
	docker system df

inspect-admin:
	docker inspect vpc-admin

inspect-crm:
	docker inspect vpc-crm

inspect-elearning:
	docker inspect vpc-elearning

# ============================================
# Deployment Commands
# ============================================

prod: build up
	@echo "✅ Production deployment complete!"
	@make status

dev: dev-up
	@echo "✅ Development environment ready!"

deploy: build
	@echo "🚀 Deploying to production..."
	docker compose up -d --force-recreate
	@echo "✅ Deployment complete!"
	@make health

rollback:
	@echo "🔄 Rolling back..."
	git checkout HEAD~1
	@make deploy

# ============================================
# Testing Commands
# ============================================

test-admin:
	@echo "🧪 Testing Admin Portal..."
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Admin OK" || echo "❌ Admin Failed"

test-crm:
	@echo "🧪 Testing CRM Portal..."
	@curl -s http://localhost:3001 > /dev/null && echo "✅ CRM OK" || echo "❌ CRM Failed"

test-elearning:
	@echo "🧪 Testing E-Learning Portal..."
	@curl -s http://localhost:3002 > /dev/null && echo "✅ E-Learning OK" || echo "❌ E-Learning Failed"

test: test-admin test-crm test-elearning
	@echo "✅ All tests complete!"

# ============================================
# Quick Commands
# ============================================

# Quick start everything
start: up

# Quick stop everything
stop: down

# Full restart
reset: down up

# Update and deploy
update:
	git pull
	@make deploy

