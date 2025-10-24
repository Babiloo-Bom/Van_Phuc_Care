#!/bin/bash
# ============================================
# MANUAL DEPLOY SCRIPT - Van Phuc Care
# Run this script on the server
# ============================================

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 MANUAL DEPLOY - VAN PHUC CARE                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Go to project directory
cd /home/backend/Van_Phuc_Care

echo "📥 Step 1: Pull latest code..."
git pull origin main

echo ""
echo "🛑 Step 2: Stop all containers..."
docker compose down

echo ""
echo "🔨 Step 3: Build images (with cache, ~2-3 mins)..."
docker compose build

echo ""
echo "🚀 Step 4: Start all services..."
docker compose up -d

echo ""
echo "⏳ Step 5: Wait for containers to be healthy..."
sleep 15

echo ""
echo "📊 Step 6: Check container status..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ DEPLOY COMPLETED!"
echo ""
echo "🌐 Access URLs:"
echo "   • API:        http://103.216.119.104:3000"
echo "   • Admin:      http://103.216.119.104:3100"
echo "   • CRM:        http://103.216.119.104:3101"
echo "   • E-Learning: http://103.216.119.104:3102"
echo ""
echo "🔍 Check logs:"
echo "   docker logs vpc-api --tail 50"
echo "   docker logs vpc-admin --tail 50"
echo "   docker logs vpc-crm --tail 50"
echo "   docker logs vpc-elearning --tail 50"

