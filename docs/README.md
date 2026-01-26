# 📚 Van Phuc Care - Documentation Index

> **Tài liệu tổng hợp cho toàn bộ hệ thống Van Phuc Care**

---

## 🎯 Bắt đầu nhanh

- **[Quick Start Guide](./QUICK_START.md)** - Bắt đầu trong 5 phút
- **[System Overview](./SYSTEM_OVERVIEW.md)** - Tổng quan hệ thống
- **[Main README](../README.md)** - Tài liệu chính

---

## 📖 Tài liệu hệ thống

### 🚀 Getting Started

1. **[Quick Start Guide](./QUICK_START.md)**
   - Setup nhanh trong 5 phút
   - Prerequisites
   - Environment variables
   - Troubleshooting cơ bản

2. **[System Overview](./SYSTEM_OVERVIEW.md)**
   - Kiến trúc hệ thống
   - Các thành phần
   - Công nghệ sử dụng
   - Development workflow

3. **[Main README](../README.md)**
   - Tổng quan dự án
   - Cài đặt chi tiết
   - Cấu trúc dự án
   - Links đến tất cả tài liệu

### 🚢 Deployment

- **[DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)**
  - Yêu cầu hệ thống
  - Chuẩn bị môi trường
  - Deploy với Docker Compose
  - Cấu hình Nginx & SSL
  - Monitoring & Logs
  - Troubleshooting

### 🔧 Configuration

- **[ENV_TEMPLATE.md](../ENV_TEMPLATE.md)** - Template biến môi trường
- **[MIGRATION_NOTE.md](../MIGRATION_NOTE.md)** - Database migration notes

---

## 🏗️ Backend Documentation

### API Server (`server-vpc`)

- **[server-vpc/README.md](../server-vpc/README.md)**
  - Backend API documentation
  - Setup & configuration
  - Development guide

- **[server-vpc/docs/sb-schema.md](../server-vpc/docs/sb-schema.md)**
  - Database schema
  - Models structure
  - Relationships

- **[server-vpc/docs/api-endpoint.md](../server-vpc/docs/api-endpoint.md)**
  - API endpoints list
  - Request/Response formats

- **[server-vpc/docs/TICKET_API.md](../server-vpc/docs/TICKET_API.md)**
  - Ticket API documentation

- **[VAN_PHUC_CARE_API_DOCUMENTATION.md](../VAN_PHUC_CARE_API_DOCUMENTATION.md)**
  - Complete API documentation (if exists)

---

## 🎨 Frontend Documentation

### Admin Portal (`admin-vpc-v3`)

- **[admin-vpc-v3/README.md](../admin-vpc-v3/README.md)**
  - Admin Portal documentation
  - Features & setup

- **[admin-vpc-v3/stores/README.md](../admin-vpc-v3/stores/README.md)**
  - Pinia stores guide

### CRM Portal (`crm-vpc-v3`)

- **[crm-vpc-v3/README.md](../crm-vpc-v3/README.md)**
  - CRM Portal documentation
  - Features & setup

- **[crm-vpc-v3/CRM_API_LIST.md](../crm-vpc-v3/CRM_API_LIST.md)**
  - CRM API endpoints list

- **[crm-vpc-v3/CRM_API_REVIEW.md](../crm-vpc-v3/CRM_API_REVIEW.md)**
  - CRM API review

- **[crm-vpc-v3/stores/README.md](../crm-vpc-v3/stores/README.md)**
  - Pinia stores guide

### E-Learning Portal (`elerning-vpc-v3`)

#### Main Documentation

- **[elerning-vpc-v3/README.md](../elerning-vpc-v3/README.md)**
  - E-Learning Portal documentation
  - Features, setup, deployment

- **[elerning-vpc-v3/docs/INDEX.md](../elerning-vpc-v3/docs/INDEX.md)**
  - Documentation index cho E-Learning Portal

#### API & Integration

- **[elerning-vpc-v3/docs/API_DOCUMENTATION.md](../elerning-vpc-v3/docs/API_DOCUMENTATION.md)**
  - Complete API documentation
  - Authentication
  - All endpoints
  - Examples

#### Analytics & SEO

- **[elerning-vpc-v3/docs/GTM_SETUP.md](../elerning-vpc-v3/docs/GTM_SETUP.md)**
  - Google Tag Manager setup
  - Event tracking
  - Usage examples

- **[elerning-vpc-v3/docs/SEO_CONFIGURATION.md](../elerning-vpc-v3/docs/SEO_CONFIGURATION.md)**
  - SEO configuration
  - Schema.org markup
  - Meta tags

#### Features

- **[elerning-vpc-v3/docs/PAYMENT_SYSTEM.md](../elerning-vpc-v3/docs/PAYMENT_SYSTEM.md)**
  - Payment system
  - VNPay, SePay integration
  - Webhook handling

- **[elerning-vpc-v3/docs/CART_SYSTEM.md](../elerning-vpc-v3/docs/CART_SYSTEM.md)**
  - Cart system
  - State management
  - API endpoints

#### Development

- **[elerning-vpc-v3/docs/PROJECT_STRUCTURE.md](../elerning-vpc-v3/docs/PROJECT_STRUCTURE.md)**
  - Project structure
  - Code organization
  - Best practices

- **[elerning-vpc-v3/stores/README.md](../elerning-vpc-v3/stores/README.md)**
  - Pinia stores guide

---

## 🔧 Utilities & Scripts

### Scripts Documentation

- **[scripts/REDIS_FIX_GUIDE.md](../scripts/REDIS_FIX_GUIDE.md)**
  - Redis troubleshooting
  - Fix common issues

- **[scripts/CLEANUP_GUIDE.md](../scripts/CLEANUP_GUIDE.md)**
  - Cleanup scripts guide
  - Database cleanup
  - R2 cleanup

### Server Scripts

- **[server-vpc/SEPAY_TEST_GUIDE.md](../server-vpc/SEPAY_TEST_GUIDE.md)**
  - SePay testing guide

---

## 📊 Documentation by Topic

### 🔐 Authentication & Security

- JWT Authentication: [server-vpc/README.md](../server-vpc/README.md)
- Google OAuth: [elerning-vpc-v3/docs/API_DOCUMENTATION.md](../elerning-vpc-v3/docs/API_DOCUMENTATION.md#google-oauth)
- Security Best Practices: [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md#security)

### 💳 Payment & Transactions

- Payment System: [elerning-vpc-v3/docs/PAYMENT_SYSTEM.md](../elerning-vpc-v3/docs/PAYMENT_SYSTEM.md)
- SePay Testing: [server-vpc/SEPAY_TEST_GUIDE.md](../server-vpc/SEPAY_TEST_GUIDE.md)
- Transactions API: [elerning-vpc-v3/docs/API_DOCUMENTATION.md](../elerning-vpc-v3/docs/API_DOCUMENTATION.md#transactions)

### 📊 Analytics & Tracking

- GTM Setup: [elerning-vpc-v3/docs/GTM_SETUP.md](../elerning-vpc-v3/docs/GTM_SETUP.md)
- Event Tracking: [elerning-vpc-v3/composables/useGtmTracking.ts](../elerning-vpc-v3/composables/useGtmTracking.ts)

### 🔍 SEO

- SEO Configuration: [elerning-vpc-v3/docs/SEO_CONFIGURATION.md](../elerning-vpc-v3/docs/SEO_CONFIGURATION.md)
- Schema.org: [elerning-vpc-v3/docs/SEO_CONFIGURATION.md](../elerning-vpc-v3/docs/SEO_CONFIGURATION.md#schemaorg-markup)

### 🗄️ Database

- Database Schema: [server-vpc/docs/sb-schema.md](../server-vpc/docs/sb-schema.md)
- Migration Notes: [MIGRATION_NOTE.md](../MIGRATION_NOTE.md)

### 🚀 Deployment

- Deployment Guide: [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- Docker Setup: [README.md](../README.md#cài-đặt-và-chạy-dự-án)
- Nginx Configuration: [nginx/](../nginx/)

---

## 🗺️ Documentation Map

```
Van_Phuc_Care/
│
├── 📄 README.md                    # Main documentation
├── 📄 DEPLOYMENT_GUIDE.md         # Deployment guide
│
├── 📂 docs/                        # System documentation
│   ├── README.md                  # This file
│   ├── SYSTEM_OVERVIEW.md         # System overview
│   └── QUICK_START.md             # Quick start guide
│
├── 📂 server-vpc/                  # Backend API
│   ├── README.md
│   └── docs/
│       ├── sb-schema.md
│       ├── api-endpoint.md
│       └── TICKET_API.md
│
├── 📂 admin-vpc-v3/               # Admin Portal
│   ├── README.md
│   └── stores/README.md
│
├── 📂 crm-vpc-v3/                 # CRM Portal
│   ├── README.md
│   ├── CRM_API_LIST.md
│   └── stores/README.md
│
└── 📂 elerning-vpc-v3/            # E-Learning Portal
    ├── README.md
    └── docs/
        ├── INDEX.md
        ├── API_DOCUMENTATION.md
        ├── GTM_SETUP.md
        ├── SEO_CONFIGURATION.md
        ├── PAYMENT_SYSTEM.md
        ├── CART_SYSTEM.md
        └── PROJECT_STRUCTURE.md
```

---

## 🔍 Tìm kiếm tài liệu

### Theo chủ đề

- **Setup & Installation**: [QUICK_START.md](./QUICK_START.md), [README.md](../README.md)
- **API Documentation**: [elerning-vpc-v3/docs/API_DOCUMENTATION.md](../elerning-vpc-v3/docs/API_DOCUMENTATION.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- **GTM & Analytics**: [elerning-vpc-v3/docs/GTM_SETUP.md](../elerning-vpc-v3/docs/GTM_SETUP.md)
- **Payment**: [elerning-vpc-v3/docs/PAYMENT_SYSTEM.md](../elerning-vpc-v3/docs/PAYMENT_SYSTEM.md)
- **Database**: [server-vpc/docs/sb-schema.md](../server-vpc/docs/sb-schema.md)

### Theo module

- **Backend**: [server-vpc/README.md](../server-vpc/README.md)
- **Admin Portal**: [admin-vpc-v3/README.md](../admin-vpc-v3/README.md)
- **CRM Portal**: [crm-vpc-v3/README.md](../crm-vpc-v3/README.md)
- **E-Learning Portal**: [elerning-vpc-v3/README.md](../elerning-vpc-v3/README.md)

---

## 📝 Contributing to Documentation

Khi thêm tính năng mới hoặc cập nhật code:

1. **Update relevant documentation**
   - README.md của module
   - API documentation nếu có API mới
   - Update this index nếu cần

2. **Follow documentation standards**
   - Sử dụng Markdown format
   - Thêm mục lục cho docs dài
   - Include examples
   - Update "Last Updated" date

3. **Cross-reference**
   - Link đến related docs
   - Update index files
   - Maintain consistency

---

## 🆘 Need Help?

- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Troubleshooting**: [README.md](../README.md#troubleshooting)
- **Support**: support@vanphuccare.com

---

**Last Updated**: 2025-01-26

