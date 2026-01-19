#!/bin/bash

# Force Redis Fix - Complete Volume Reset
# This script will completely remove the Redis volume and recreate it

REDIS_CONTAINER="vpc-redis"
VOLUME_NAME="redis_data"  # From docker-compose.prod.yml
COMPOSE_FILE="docker-compose.prod.yml"

echo "============================================"
echo "Force Redis Fix - Complete Reset"
echo "============================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📂 Project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || exit 1

echo ""
echo "📦 Step 1: Stopping Redis container..."
docker stop ${REDIS_CONTAINER} 2>/dev/null || true
docker rm ${REDIS_CONTAINER} 2>/dev/null || true

echo ""
echo "🗑️  Step 2: Removing Redis volume '${VOLUME_NAME}'..."
# Stop all services that might be using the volume
docker-compose -f ${COMPOSE_FILE} down redis 2>/dev/null || true

# Remove the volume
if docker volume inspect ${VOLUME_NAME} >/dev/null 2>&1; then
    echo "   Found volume '${VOLUME_NAME}', removing..."
    docker volume rm ${VOLUME_NAME} 2>/dev/null || {
        echo "   ⚠️  Could not remove volume (might be in use)"
        echo "   Trying to force remove..."
        # Try to find and remove files directly
        VOLUME_PATH=$(docker volume inspect ${VOLUME_NAME} --format '{{.Mountpoint}}' 2>/dev/null)
        if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
            echo "   Volume path: $VOLUME_PATH"
            echo "   Removing all files from volume..."
            sudo rm -rf ${VOLUME_PATH}/* ${VOLUME_PATH}/.* 2>/dev/null || true
            echo "   ✅ Files removed from volume"
        fi
    }
    echo "   ✅ Volume removed or cleared"
else
    echo "   ℹ️  Volume '${VOLUME_NAME}' not found (will be created)"
fi

echo ""
echo "🚀 Step 3: Starting Redis (will create new volume)..."
docker-compose -f ${COMPOSE_FILE} up -d redis

echo ""
echo "⏳ Step 4: Waiting for Redis to initialize..."
sleep 10

echo ""
echo "📊 Step 5: Checking Redis status..."
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec ${REDIS_CONTAINER} redis-cli ping >/dev/null 2>&1; then
        echo ""
        echo "✅ Redis is running successfully!"
        echo ""
        echo "Redis Info:"
        docker exec ${REDIS_CONTAINER} redis-cli INFO server 2>/dev/null | grep -E "redis_version|uptime_in_seconds|used_memory_human" || true
        echo ""
        echo "============================================"
        echo "✅ Redis fix completed successfully!"
        echo "============================================"
        exit 0
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "   ⏳ Waiting... (attempt $RETRY_COUNT/$MAX_RETRIES)"
            sleep 3
        fi
    fi
done

echo ""
echo "❌ Redis still has issues after $MAX_RETRIES attempts."
echo ""
echo "Recent logs:"
docker logs --tail 50 ${REDIS_CONTAINER} 2>/dev/null || true
echo ""
echo "============================================"
echo "❌ Redis fix failed. Please check logs above."
echo "============================================"
exit 1

