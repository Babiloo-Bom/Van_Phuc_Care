#!/bin/bash

# Deploy script for Van Phuc Care
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-production}

# Select compose file by environment
if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

echo "🚀 Deploying Van Phuc Care - Environment: $ENVIRONMENT"

# Load environment variables (check both naming conventions - prefer production.env)
ENV_FILE=""
ENV_FILE_FLAG=""
if [ -f "$ENVIRONMENT.env" ]; then
    ENV_FILE="$ENVIRONMENT.env"
elif [ -f ".env.$ENVIRONMENT" ]; then
    ENV_FILE=".env.$ENVIRONMENT"
fi

if [ -n "$ENV_FILE" ]; then
    echo "📦 Loading environment variables from $ENV_FILE"
    set -a  # automatically export all variables
    source "$ENV_FILE"
    set +a
    ENV_FILE_FLAG="--env-file $ENV_FILE"
    echo "✅ Environment variables loaded successfully"
    # Debug: show SMTP config (hide password)
    echo "   SMTP_HOST=$SMTP_HOST"
    echo "   SMTP_PORT=$SMTP_PORT"
    echo "   SMTP_USER=$SMTP_USER"
    echo "   SMTP_FROM_EMAIL=$SMTP_FROM_EMAIL"
else
    echo "⚠️  Warning: Neither .env.$ENVIRONMENT nor $ENVIRONMENT.env found"
    echo "   Using existing environment variables"
fi

# Login to GitHub Container Registry (if needed)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Logging in to GitHub Container Registry..."
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
fi

# Pull latest images
echo "⬇️  Pulling latest Docker images..."
docker compose -f $COMPOSE_FILE $ENV_FILE_FLAG pull

# Stop and remove old containers
echo "🛑 Stopping old containers..."
docker compose -f $COMPOSE_FILE $ENV_FILE_FLAG down

# Remove orphaned nginx container if exists (from previous deployments)
echo "🧹 Removing orphaned containers..."
docker rm -f vpc-nginx 2>/dev/null || true

# Start new containers
echo "▶️  Starting new containers..."
docker compose -f $COMPOSE_FILE $ENV_FILE_FLAG up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Update Nginx config on host (if Nginx is running on host, not in Docker)
if [ -d "/etc/nginx/sites-available" ]; then
    echo "🔄 Updating Nginx configuration..."
    sudo cp ./nginx/conf.d/default.conf /etc/nginx/sites-available/vanphuccare 2>/dev/null || true
    sudo ln -sf /etc/nginx/sites-available/vanphuccare /etc/nginx/sites-enabled/vanphuccare 2>/dev/null || true
    sudo nginx -t && sudo systemctl reload nginx && echo "✅ Nginx reloaded successfully" || echo "⚠️  Nginx reload failed"
fi

# Check service status
echo "✅ Checking service status..."
docker compose -f $COMPOSE_FILE $ENV_FILE_FLAG ps

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -af --filter "until=24h"

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Service URLs:"
echo "  - API:        http://localhost:3000"
echo "  - Admin:      http://localhost:3100"
echo "  - CRM:        http://localhost:3101"
echo "  - E-Learning: http://localhost:3102"

