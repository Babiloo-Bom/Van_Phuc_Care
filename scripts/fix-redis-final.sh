#!/bin/bash

# Final Redis Fix - Find and remove corrupted files from anywhere
# This script will find Redis database files and remove them

REDIS_CONTAINER="vpc-redis"
COMPOSE_FILE="docker-compose.prod.yml"

echo "============================================"
echo "Final Redis Fix - Remove Corrupted Files"
echo "============================================"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📂 Project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || exit 1

echo ""
echo "📦 Step 1: Stopping and removing Redis container..."
docker stop ${REDIS_CONTAINER} 2>/dev/null || true
docker rm ${REDIS_CONTAINER} 2>/dev/null || true

echo ""
echo "🔍 Step 2: Finding all Redis-related volumes..."
echo "   Listing all volumes:"
docker volume ls | grep -i redis || echo "   No Redis volumes found"

echo ""
echo "🔍 Step 3: Finding Redis database files in volumes..."
# Check all possible volume names
POSSIBLE_VOLUMES=(
    "redis_data"
    "vanphuccare_redis_data"
    "vanphuccare-redis_data"
    "vpc-redis-data"
    "vpc_redis_data"
)

FOUND_VOLUME=""
for VOL in "${POSSIBLE_VOLUMES[@]}"; do
    if docker volume inspect "$VOL" >/dev/null 2>&1; then
        echo "   ✅ Found volume: $VOL"
        FOUND_VOLUME="$VOL"
        VOLUME_PATH=$(docker volume inspect "$VOL" --format '{{.Mountpoint}}' 2>/dev/null)
        if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
            echo "   📍 Volume path: $VOLUME_PATH"
            echo "   🗑️  Removing database files..."
            sudo rm -f ${VOLUME_PATH}/dump.rdb ${VOLUME_PATH}/appendonly.aof 2>/dev/null || true
            sudo rm -f ${VOLUME_PATH}/_data/dump.rdb ${VOLUME_PATH}/_data/appendonly.aof 2>/dev/null || true
            echo "   ✅ Files removed"
        fi
        # Also try to remove the entire volume (more thorough)
        echo "   🗑️  Attempting to remove entire volume..."
        docker volume rm "$VOL" 2>/dev/null && echo "   ✅ Volume removed" || echo "   ⚠️  Volume in use, files removed instead"
    fi
done

# Also check if there are any volumes with "data" in the name
echo ""
echo "🔍 Step 4: Checking all volumes for Redis data files..."
ALL_VOLUMES=$(docker volume ls --format '{{.Name}}')
for VOL in $ALL_VOLUMES; do
    VOLUME_PATH=$(docker volume inspect "$VOL" --format '{{.Mountpoint}}' 2>/dev/null)
    if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
        if [ -f "${VOLUME_PATH}/dump.rdb" ] || [ -f "${VOLUME_PATH}/appendonly.aof" ]; then
            echo "   ⚠️  Found Redis files in volume: $VOL"
            echo "   📍 Path: $VOLUME_PATH"
            echo "   🗑️  Removing..."
            sudo rm -f ${VOLUME_PATH}/dump.rdb ${VOLUME_PATH}/appendonly.aof 2>/dev/null || true
            echo "   ✅ Removed"
        fi
    fi
done

echo ""
echo "🚀 Step 5: Starting Redis (will create clean volume)..."
docker-compose -f ${COMPOSE_FILE} up -d redis

echo ""
echo "⏳ Step 6: Waiting for Redis to initialize..."
sleep 10

echo ""
echo "📊 Step 7: Checking Redis status..."
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

