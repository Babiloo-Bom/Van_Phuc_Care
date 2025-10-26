#!/bin/bash

# Install Nginx
apt update
apt install nginx certbot python3-certbot-nginx -y

# Admin config
cat > /etc/nginx/sites-available/admin.vanphuccare.com << 'EOF'
server {
    listen 80;
    server_name admin.vanphuccare.com;

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# CRM config
cat > /etc/nginx/sites-available/crm.vanphuccare.com << 'EOF'
server {
    listen 80;
    server_name crm.vanphuccare.com;

    location / {
        proxy_pass http://localhost:3101;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# E-Learning config
cat > /etc/nginx/sites-available/elearning.vanphuccare.com << 'EOF'
server {
    listen 80;
    server_name elearning.vanphuccare.com;

    location / {
        proxy_pass http://localhost:3102;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# API config
cat > /etc/nginx/sites-available/api.vanphuccare.com << 'EOF'
server {
    listen 80;
    server_name api.vanphuccare.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable sites
ln -sf /etc/nginx/sites-available/admin.vanphuccare.com /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/crm.vanphuccare.com /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/elearning.vanphuccare.com /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/api.vanphuccare.com /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test and restart
nginx -t && systemctl restart nginx

echo "✅ Nginx configured successfully!"
echo ""
echo "Next steps:"
echo "1. Wait for DNS to propagate (5-30 minutes)"
echo "2. Install SSL: certbot --nginx -d admin.vanphuccare.com -d crm.vanphuccare.com -d elearning.vanphuccare.com -d api.vanphuccare.com"

