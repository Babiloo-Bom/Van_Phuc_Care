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

# Check network connectivity to ghcr.io (optional check)
echo "🌐 Checking network connectivity to GitHub Container Registry..."
if command -v curl >/dev/null 2>&1; then
    if curl -s --max-time 5 https://ghcr.io >/dev/null 2>&1; then
        echo "✅ Network connectivity to ghcr.io confirmed"
    else
        echo "⚠️  Warning: Cannot reach ghcr.io. Network connectivity may be limited."
        echo "   Proceeding anyway - this may cause pull failures..."
    fi
elif command -v wget >/dev/null 2>&1; then
    if wget -q --spider --timeout=5 https://ghcr.io 2>/dev/null; then
        echo "✅ Network connectivity to ghcr.io confirmed"
    else
        echo "⚠️  Warning: Cannot reach ghcr.io. Network connectivity may be limited."
        echo "   Proceeding anyway - this may cause pull failures..."
    fi
else
    echo "ℹ️  Skipping connectivity check (curl/wget not available)"
fi

# Login to GitHub Container Registry (if needed)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔐 Logging in to GitHub Container Registry..."
    if ! echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin; then
        echo "❌ Failed to login to GitHub Container Registry"
        exit 1
    fi
fi

# Pull latest images with retry logic
echo "⬇️  Pulling latest Docker images..."
# Increase Docker client timeout for slow network connections
export DOCKER_CLIENT_TIMEOUT=300
export COMPOSE_HTTP_TIMEOUT=300
MAX_RETRIES=3
RETRY_DELAY=5
RETRY_COUNT=0
PULL_SUCCESS=false

# First, try pulling all images at once
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose -f $COMPOSE_FILE $ENV_FILE_FLAG pull; then
        echo "✅ Successfully pulled all Docker images"
        PULL_SUCCESS=true
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "⚠️  Bulk pull failed (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in ${RETRY_DELAY}s..."
            sleep $RETRY_DELAY
            # Re-login in case token expired
            if [ -n "$GITHUB_TOKEN" ]; then
                echo "🔐 Re-authenticating with GitHub Container Registry..."
                echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
            fi
        fi
    fi
done

# If bulk pull failed, try pulling images individually
if [ "$PULL_SUCCESS" = false ]; then
    echo "⚠️  Bulk pull failed. Attempting to pull images individually..."
    RETRY_COUNT=0
    
    # List of services that need to be pulled from ghcr.io
    SERVICES="api admin crm elearning"
    
    for service in $SERVICES; do
        RETRY_COUNT=0
        SERVICE_PULLED=false
        
        while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
            if docker compose -f $COMPOSE_FILE $ENV_FILE_FLAG pull "$service" 2>/dev/null; then
                echo "✅ Successfully pulled $service image"
                SERVICE_PULLED=true
                break
            else
                RETRY_COUNT=$((RETRY_COUNT + 1))
                if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                    echo "⚠️  Failed to pull $service (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in ${RETRY_DELAY}s..."
                    sleep $RETRY_DELAY
                fi
            fi
        done
        
        if [ "$SERVICE_PULLED" = false ]; then
            echo "❌ Failed to pull $service image after $MAX_RETRIES attempts"
            exit 1
        fi
    done
    
    echo "✅ Successfully pulled all Docker images individually"
fi

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

