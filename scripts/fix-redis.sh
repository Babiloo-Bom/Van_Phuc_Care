#!/bin/bash

# ============================================
# Fix Redis Database Corruption
# ============================================
# This script fixes Redis corruption by:
# 1. Stopping the Redis container
# 2. Removing corrupted database files
# 3. Restarting Redis with a fresh database
# ============================================

set -e

echo "============================================"
echo "Fixing Redis Database Corruption"
echo "============================================"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script requires root privileges. Please run with sudo."
    exit 1
fi

# Container name
REDIS_CONTAINER="vpc-redis"

# Check if container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "^${REDIS_CONTAINER}$"; then
    echo "❌ Redis container '${REDIS_CONTAINER}' not found!"
    exit 1
fi

echo ""
echo "📦 Step 1: Stopping Redis container..."
docker stop ${REDIS_CONTAINER} || true

echo ""
echo "🗑️  Step 2: Removing corrupted database files from container..."

# Remove corrupted database files inside the container
docker exec ${REDIS_CONTAINER} sh -c "rm -f /data/dump.rdb /data/appendonly.aof" 2>/dev/null || true

# Alternative: Remove files from volume directly
# Find the volume mount point
VOLUME_NAME="vpc-redis-data"
if docker volume inspect ${VOLUME_NAME} >/dev/null 2>&1; then
    echo "   Found volume: ${VOLUME_NAME}"
    VOLUME_PATH=$(docker volume inspect ${VOLUME_NAME} --format '{{.Mountpoint}}')
    if [ -n "$VOLUME_PATH" ]; then
        echo "   Volume path: ${VOLUME_PATH}"
        echo "   Removing corrupted files..."
        rm -f ${VOLUME_PATH}/dump.rdb ${VOLUME_PATH}/appendonly.aof 2>/dev/null || true
    fi
fi

echo ""
echo "🔄 Step 3: Starting Redis container..."
docker start ${REDIS_CONTAINER}

echo ""
echo "⏳ Waiting for Redis to initialize..."
sleep 5

# Check if Redis is running
if docker exec ${REDIS_CONTAINER} redis-cli ping >/dev/null 2>&1; then
    echo ""
    echo "✅ Redis is now running successfully!"
    echo ""
    echo "📊 Redis status:"
    docker exec ${REDIS_CONTAINER} redis-cli INFO server | grep -E "redis_version|uptime_in_seconds" || true
else
    echo ""
    echo "⚠️  Redis started but ping failed. Checking logs..."
    docker logs --tail 20 ${REDIS_CONTAINER}
    exit 1
fi

echo ""
echo "============================================"
echo "✅ Redis fix completed successfully!"
echo "============================================"

