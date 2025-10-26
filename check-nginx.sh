#!/bin/bash

echo "🔍 Checking Nginx status..."
echo ""

# Check if Nginx is installed
if command -v nginx &> /dev/null; then
    echo "✅ Nginx is installed"
    nginx -v
else
    echo "❌ Nginx is NOT installed"
    exit 1
fi

echo ""
echo "🔍 Checking Nginx service status..."
systemctl status nginx --no-pager | head -20

echo ""
echo "🔍 Checking Nginx configuration..."
nginx -t

echo ""
echo "🔍 Checking configured sites..."
ls -la /etc/nginx/sites-enabled/

echo ""
echo "🔍 Checking if ports are listening..."
netstat -tlnp | grep -E ':(80|443|3000|3100|3101|3102)'

echo ""
echo "🔍 Testing domain resolution..."
curl -I http://admin.vanphuccare.com 2>&1 | head -10

