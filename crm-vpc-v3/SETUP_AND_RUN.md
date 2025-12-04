# 🚀 Hướng Dẫn Chạy Trang Health Book

## ✅ Các thư viện đã được cài đặt

### Dependencies đã thêm:
- ✅ `dayjs@^1.11.13` - Thư viện xử lý ngày tháng
- ✅ `@ant-design/icons-vue@^7.0.1` - Icon library cho Ant Design Vue

### Lệnh đã chạy:
```bash
npm install
npm run postinstall  # Generate Nuxt types
```

## 🔧 Cách khởi động

### 1. Start Backend Server
```bash
cd server-vpc
npm run dev
# Backend sẽ chạy trên http://localhost:3000
```

### 2. Start CRM v3 Frontend
```bash
cd crm-vpc-v3
npm run dev
# Frontend sẽ chạy trên http://localhost:3001 (hoặc port khác)
```

## 📝 Lỗi TypeScript

### Lỗi hiện tại:
```
Failed to write the global types file...
Cannot find name 'useHealthBooksApi'
```

### ✅ Cách fix:

**Option 1: Restart VS Code TypeScript Server**
1. Trong VS Code, nhấn `Ctrl + Shift + P` (Windows) hoặc `Cmd + Shift + P` (Mac)
2. Gõ: `TypeScript: Restart TS Server`
3. Chọn và nhấn Enter

**Option 2: Reload Window**
1. Nhấn `Ctrl + Shift + P`
2. Gõ: `Developer: Reload Window`
3. Enter

**Option 3: Close và mở lại VS Code**
- Đóng hoàn toàn VS Code
- Mở lại workspace

### Sau khi restart:
Tất cả lỗi TypeScript sẽ tự động biến mất vì:
- ✅ `node_modules` đã có đầy đủ
- ✅ `.nuxt/types` đã được generate
- ✅ `tsconfig.json` đã được cấu hình đúng

## 🧪 Cách test trang Health Book

### 1. Tạo dữ liệu test (nếu chưa có)
```bash
# Trong server-vpc
npm run seed  # Hoặc command seed của bạn
```

### 2. Lấy customerId
- Đăng nhập vào CRM
- Vào trang Customers
- Copy ID của một customer

### 3. Truy cập trang Health Book
```
http://localhost:3001/health-book/[CUSTOMER_ID]
```
Ví dụ:
```
http://localhost:3001/health-book/507f1f77bcf86cd799439011
```

## 🎨 UI Components đã tạo

### Page chính:
- `pages/health-book/[id].vue` - Trang chính với routing động

### 7 Components:
1. ✅ `HealthProfileCard.vue` - Thông tin bé (avatar, tên, tuổi)
2. ✅ `HealthMetricsCard.vue` - Cân nặng, chiều cao, giới tính
3. ✅ `HealthConditionsCard.vue` - Da, răng, dinh dưỡng, giấc ngủ
4. ✅ `DigestiveHealthCard.vue` - Sức khỏe tiêu hóa
5. ✅ `TemperatureChartCard.vue` - Biểu đồ nhiệt độ 15 ngày
6. ✅ `HealthStatusCard.vue` - Tình trạng sức khỏe & tiêm chủng
7. ✅ `ExerciseMethodCard.vue` - Vận động & phương pháp

## 📂 Files đã tạo/cập nhật

```
crm-vpc-v3/
├── package.json                              ← Updated (thêm dayjs, icons)
├── types/api.ts                              ← Updated (HealthBook interface)
├── pages/
│   └── health-book/
│       └── [id].vue                          ← NEW
├── components/
│   └── health-book/
│       ├── HealthProfileCard.vue             ← NEW
│       ├── HealthMetricsCard.vue             ← NEW
│       ├── HealthConditionsCard.vue          ← NEW
│       ├── DigestiveHealthCard.vue           ← NEW
│       ├── TemperatureChartCard.vue          ← NEW
│       ├── HealthStatusCard.vue              ← NEW
│       └── ExerciseMethodCard.vue            ← NEW
├── composables/
│   └── api/
│       └── useHealthBooksApi.ts              ← Đã có sẵn
└── HEALTH_BOOK_IMPLEMENTATION.md             ← NEW (Documentation)
```

## 🖼️ Images cần có

Tạo hoặc copy các file sau vào `public/images/`:
```
public/images/
├── male-icon.png          ← Icon giới tính nam
├── female-icon.png        ← Icon giới tính nữ
└── home/
    ├── tieu-tien.png      ← Icon đại tiện
    ├── phan.png           ← Icon phân
    └── da-day.png         ← Icon vấn đề tiêu hóa
```

Nếu không có, component vẫn hoạt động nhưng sẽ có broken image icon.

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'dayjs'"
```bash
cd crm-vpc-v3
npm install
```

### Lỗi: "Cannot find module '@ant-design/icons-vue'"
```bash
cd crm-vpc-v3
npm install
```

### Lỗi: TypeScript không nhận composable
1. Restart TS Server: `Ctrl + Shift + P` → `TypeScript: Restart TS Server`
2. Hoặc chạy: `npm run postinstall`

### Lỗi: 404 Not Found khi truy cập trang
- Check backend đang chạy: `http://localhost:3000`
- Check customerId có tồn tại trong database
- Check JWT token còn hiệu lực (login lại nếu cần)

### Lỗi: Không có dữ liệu hiển thị
- Check API response trong Network tab (F12)
- Tạo seed data cho health book
- Check domain và customerId có match không

## 📚 API Endpoints được sử dụng

```
GET  /api/a/health-book/all              - List all health books
GET  /api/a/health-book/:id              - Get by ID
GET  /api/a/health-book/by-date/:customerId?date=YYYY-MM-DD
POST /api/a/health-book                  - Create new
PATCH /api/a/health-book/:id             - Update
DELETE /api/a/health-book/:id            - Delete
```

## ✅ Checklist trước khi chạy

- [ ] Backend server đang chạy (port 3000)
- [ ] Frontend server đang chạy (port 3001)
- [ ] Dependencies đã install (`npm install`)
- [ ] Nuxt types đã generate (`.nuxt` folder exists)
- [ ] VS Code TS Server đã restart
- [ ] Có dữ liệu test trong database
- [ ] JWT token hợp lệ (đã login)

## 🎉 Kết quả mong đợi

Sau khi fix xong TypeScript errors và chạy dev server, bạn sẽ thấy:
- ✅ Trang health book hiển thị đẹp với responsive layout
- ✅ Date picker hoạt động để xem dữ liệu theo ngày
- ✅ Biểu đồ nhiệt độ 15 ngày với SVG
- ✅ Tất cả thông tin sức khỏe bé hiển thị đầy đủ
- ✅ Mobile responsive hoàn hảo

---

**Tạo bởi**: Copilot  
**Ngày**: 2024  
**Dự án**: Van Phuc Care CRM v3
