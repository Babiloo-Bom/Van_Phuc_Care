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

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    echo "📦 Loading environment variables from .env.$ENVIRONMENT"
    export $(grep -v '^#' .env.$ENVIRONMENT | xargs -d '\n')
else
    echo "⚠️  Warning: .env.$ENVIRONMENT not found, using existing environment variables"
fi

# Login to GitHub Container Registry (if needed)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Logging in to GitHub Container Registry..."
    echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
fi

# Pull latest images
echo "⬇️  Pulling latest Docker images..."
docker compose -f $COMPOSE_FILE pull

# Stop and remove old containers
echo "🛑 Stopping old containers..."
docker compose -f $COMPOSE_FILE down

# Remove orphaned nginx container if exists (from previous deployments)
echo "🧹 Removing orphaned containers..."
docker rm -f vpc-nginx 2>/dev/null || true

# Start new containers
echo "▶️  Starting new containers..."
docker compose -f $COMPOSE_FILE up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10


# Check service status
echo "✅ Checking service status..."
docker compose -f $COMPOSE_FILE ps

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

