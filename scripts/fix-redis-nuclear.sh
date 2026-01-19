#!/bin/bash

# Nuclear Option: Complete Redis Reset
# This will DELETE ALL Redis data and recreate everything

REDIS_CONTAINER="vpc-redis"
VOLUME_NAME="vpc-redis-data"

echo "============================================"
echo "Redis Nuclear Reset (Complete Data Loss)"
echo "============================================"
echo ""
echo "⚠️  WARNING: This will delete ALL Redis data!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo ""
echo "📦 Stopping and removing Redis container..."
docker stop ${REDIS_CONTAINER} 2>/dev/null || true
docker rm ${REDIS_CONTAINER} 2>/dev/null || true

echo ""
echo "🗑️  Removing Redis volume..."
docker volume rm ${VOLUME_NAME} 2>/dev/null || true

echo ""
echo "🚀 Starting Redis (will create new volume)..."
cd /opt/vanphuccare || cd $(dirname $0)/..
if [ -f "docker-compose.prod.yml" ]; then
    docker-compose -f docker-compose.prod.yml up -d redis
elif [ -f "docker-compose.yml" ]; then
    docker-compose up -d redis
else
    echo "❌ docker-compose.yml not found!"
    exit 1
fi

echo ""
echo "⏳ Waiting for Redis to start..."
sleep 8

echo ""
echo "📊 Checking Redis..."
if docker exec ${REDIS_CONTAINER} redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis is running!"
    docker exec ${REDIS_CONTAINER} redis-cli INFO server | grep -E "redis_version|uptime_in_seconds"
    echo ""
    echo "============================================"
    echo "✅ Redis reset completed successfully!"
    echo "============================================"
else
    echo "❌ Redis failed to start. Check logs:"
    docker logs --tail 30 ${REDIS_CONTAINER}
    exit 1
fi

