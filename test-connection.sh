#!/bin/bash

# Test connection to production server
# Usage: ./test-connection.sh

SERVER_HOST="103.216.119.104"
SERVER_USER="root"

echo "🔍 Testing connection to Van Phuc Care Production Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Ping server
echo "📡 Test 1: Ping server..."
if ping -c 3 $SERVER_HOST > /dev/null 2>&1; then
    echo "✅ Server is reachable"
else
    echo "❌ Server is not reachable"
    exit 1
fi
echo ""

# Test 2: SSH connection
echo "🔐 Test 2: SSH connection..."
if ssh -o ConnectTimeout=5 -o BatchMode=yes $SERVER_USER@$SERVER_HOST "echo '✅ SSH connection successful'" 2>/dev/null; then
    echo "✅ SSH authentication works"
else
    echo "❌ SSH connection failed"
    echo "   Please check:"
    echo "   - SSH key is added to server"
    echo "   - Firewall allows SSH (port 22)"
    exit 1
fi
echo ""

# Test 3: Docker installed
echo "🐳 Test 3: Docker installation..."
if ssh $SERVER_USER@$SERVER_HOST "docker --version" 2>/dev/null; then
    echo "✅ Docker is installed"
else
    echo "❌ Docker is not installed"
    exit 1
fi
echo ""

# Test 4: Docker Compose installed
echo "🐳 Test 4: Docker Compose installation..."
if ssh $SERVER_USER@$SERVER_HOST "docker-compose --version" 2>/dev/null; then
    echo "✅ Docker Compose is installed"
else
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo ""

# Test 5: Check project directory
echo "📁 Test 5: Project directory..."
if ssh $SERVER_USER@$SERVER_HOST "test -d /opt/vanphuccare && echo 'exists'" 2>/dev/null | grep -q "exists"; then
    echo "✅ Project directory exists"
else
    echo "⚠️  Project directory not found"
    echo "   Run: ssh $SERVER_USER@$SERVER_HOST 'mkdir -p /opt/vanphuccare'"
fi
echo ""

# Test 6: Check running containers
echo "🔍 Test 6: Running containers..."
CONTAINERS=$(ssh $SERVER_USER@$SERVER_HOST "docker ps --format '{{.Names}}'" 2>/dev/null)
if [ -n "$CONTAINERS" ]; then
    echo "✅ Found running containers:"
    echo "$CONTAINERS" | sed 's/^/   - /'
else
    echo "⚠️  No containers running yet"
fi
echo ""

# Test 7: Check ports
echo "🔌 Test 7: Check application ports..."
for port in 3000 3100 3101 3102; do
    if nc -z -w2 $SERVER_HOST $port 2>/dev/null; then
        echo "✅ Port $port is open"
    else
        echo "⚠️  Port $port is not accessible"
    fi
done
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Connection test completed!"
echo ""
echo "📊 Summary:"
echo "   Server: $SERVER_HOST"
echo "   User: $SERVER_USER"
echo ""
echo "🔗 Application URLs:"
echo "   API:        http://$SERVER_HOST:3000"
echo "   Admin:      http://$SERVER_HOST:3100"
echo "   CRM:        http://$SERVER_HOST:3101"
echo "   E-Learning: http://$SERVER_HOST:3102"

