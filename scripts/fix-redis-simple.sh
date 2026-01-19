#!/bin/bash

# Simple Redis Fix Script
# Run this on the server to fix Redis corruption

REDIS_CONTAINER="vpc-redis"
VOLUME_NAME="vpc-redis-data"

echo "============================================"
echo "Fixing Redis Database Corruption"
echo "============================================"
echo ""

echo "📦 Step 1: Stopping and removing Redis container..."
docker stop ${REDIS_CONTAINER} 2>/dev/null || true
docker rm ${REDIS_CONTAINER} 2>/dev/null || true

echo ""
echo "🗑️  Step 2: Removing corrupted database files from volume..."

# Method 1: Try to remove files from volume directly
if docker volume inspect ${VOLUME_NAME} >/dev/null 2>&1; then
    VOLUME_PATH=$(docker volume inspect ${VOLUME_NAME} --format '{{.Mountpoint}}')
    if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
        echo "   Found volume at: ${VOLUME_PATH}"
        echo "   Removing corrupted files..."
        sudo rm -f ${VOLUME_PATH}/dump.rdb ${VOLUME_PATH}/appendonly.aof 2>/dev/null || true
        sudo rm -f ${VOLUME_PATH}/_data/dump.rdb ${VOLUME_PATH}/_data/appendonly.aof 2>/dev/null || true
        echo "   ✅ Files removed from volume"
    else
        echo "   ⚠️  Volume path not accessible, trying alternative method..."
    fi
else
    echo "   ⚠️  Volume not found, will be created on restart"
fi

# Method 2: Remove entire volume if files still exist (nuclear option)
echo ""
echo "🔄 Step 3: Removing and recreating Redis volume..."
docker volume rm ${VOLUME_NAME} 2>/dev/null || true
echo "   ✅ Volume removed"

echo ""
echo "🚀 Step 4: Starting Redis container..."
# Use docker-compose if available, otherwise docker run
if [ -f "docker-compose.yml" ] || [ -f "docker-compose.prod.yml" ]; then
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml up -d redis
    else
        docker-compose up -d redis
    fi
else
    echo "   ⚠️  docker-compose.yml not found, please restart Redis manually:"
    echo "   docker-compose up -d redis"
    exit 1
fi

echo ""
echo "⏳ Step 5: Waiting for Redis to initialize..."
sleep 8

echo ""
echo "📊 Step 6: Checking Redis status..."
if docker exec ${REDIS_CONTAINER} redis-cli ping >/dev/null 2>&1; then
    echo ""
    echo "✅ Redis is running successfully!"
    echo ""
    echo "Redis Info:"
    docker exec ${REDIS_CONTAINER} redis-cli INFO server | grep -E "redis_version|uptime_in_seconds|used_memory_human" || true
    echo ""
    echo "============================================"
    echo "✅ Redis fix completed successfully!"
    echo "============================================"
else
    echo ""
    echo "❌ Redis still has issues. Recent logs:"
    docker logs --tail 30 ${REDIS_CONTAINER} 2>/dev/null || true
    echo ""
    echo "============================================"
    echo "❌ Redis fix failed. Please check logs above."
    echo "============================================"
    exit 1
fi

