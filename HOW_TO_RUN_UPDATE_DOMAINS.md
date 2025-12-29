# 🚀 Hướng dẫn Chạy Script update-domains.sh

> **Cách chạy script tự động cập nhật domain trong codebase**

---

## 📋 Script này làm gì?

Script `update-domains.sh` sẽ tự động:
- Tìm và thay thế `vanphuccare.com` → `vanphuccare.vn` trong tất cả files
- Tìm và thay thế `elearning.vanphuccare.com` → `edu.vanphuccare.vn` trong tất cả files
- Backup các file quan trọng trước khi thay đổi
- Bỏ qua `node_modules`, `.git`, và thư mục backup

---

## 💻 Cách Chạy

### Trên Linux/Mac (Terminal)

```bash
# Bước 1: Di chuyển vào thư mục project
cd /path/to/Van_Phuc_Care

# Bước 2: Cấp quyền thực thi (chỉ cần làm 1 lần)
chmod +x update-domains.sh

# Bước 3: Chạy script
./update-domains.sh
```

### Trên Windows

#### Option 1: Dùng Git Bash (Khuyến nghị)

```bash
# Mở Git Bash
# Di chuyển vào thư mục project
cd /e/Desktop/Project/Van_Phuc_Care

# Cấp quyền thực thi
chmod +x update-domains.sh

# Chạy script
./update-domains.sh
```

#### Option 2: Dùng WSL (Windows Subsystem for Linux)

```bash
# Mở WSL terminal
cd /mnt/e/Desktop/Project/Van_Phuc_Care

# Cấp quyền thực thi
chmod +x update-domains.sh

# Chạy script
./update-domains.sh
```

#### Option 3: Dùng PowerShell (Manual - không khuyến nghị)

Nếu không có Git Bash hoặc WSL, có thể chạy thủ công từng lệnh trong script.

---

## 📝 Câu Lệnh Đầy Đủ

### Linux/Mac:

```bash
cd /path/to/Van_Phuc_Care && chmod +x update-domains.sh && ./update-domains.sh
```

### Windows (Git Bash):

```bash
cd /e/Desktop/Project/Van_Phuc_Care && chmod +x update-domains.sh && ./update-domains.sh
```

### Windows (WSL):

```bash
cd /mnt/e/Desktop/Project/Van_Phuc_Care && chmod +x update-domains.sh && ./update-domains.sh
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Backup trước khi chạy

Script sẽ tự động backup, nhưng nên commit code trước:

```bash
# Commit code hiện tại
git add .
git commit -m "Backup before domain update"
git push origin main
```

### 2. Kiểm tra sau khi chạy

```bash
# Xem các file đã thay đổi
git status

# Xem diff để kiểm tra
git diff

# Nếu có file .bak (backup), xóa chúng
find . -name "*.bak" -delete
```

### 3. Test trước khi commit

```bash
# Test trên local trước
npm run dev  # hoặc tương tự

# Kiểm tra các file quan trọng
grep -r "vanphuccare.com" --include="*.ts" --include="*.vue" --include="*.js"
# Nếu còn kết quả, cần kiểm tra và sửa thủ công
```

---

## 🔍 Kiểm tra Script đã chạy đúng

### 1. Kiểm tra backup

```bash
# Xem thư mục backup
ls -la backup-*

# Xem nội dung backup
ls backup-*/docker-compose.prod.yml
```

### 2. Kiểm tra các file quan trọng

```bash
# Kiểm tra docker-compose.prod.yml
grep "vanphuccare.vn" docker-compose.prod.yml

# Kiểm tra production.env
grep "vanphuccare.vn" production.env

# Kiểm tra nginx config
grep "vanphuccare.vn" nginx/conf.d/default.conf
```

### 3. Kiểm tra không còn domain cũ

```bash
# Tìm domain cũ (không nên có kết quả)
grep -r "vanphuccare\.com" --include="*.ts" --include="*.vue" --include="*.js" --include="*.yml" --include="*.env" --include="*.conf" | grep -v node_modules | grep -v ".git" | grep -v backup
```

---

## 🛠️ Troubleshooting

### Lỗi: Permission denied

```bash
# Giải pháp: Cấp quyền thực thi
chmod +x update-domains.sh
```

### Lỗi: Command not found (Windows)

**Giải pháp**: Dùng Git Bash hoặc WSL thay vì CMD/PowerShell

### Lỗi: sed: command not found (Windows)

**Giải pháp**: Script cần chạy trên Linux/Mac hoặc Git Bash/WSL

### Script chạy nhưng không thay đổi gì

**Kiểm tra**:
1. Đã ở đúng thư mục project chưa?
2. Files có tồn tại không?
3. Có quyền ghi files không?

```bash
# Kiểm tra
pwd  # Xem thư mục hiện tại
ls -la docker-compose.prod.yml  # Xem file có tồn tại không
```

---

## 🔄 Rollback (Nếu cần)

Nếu script chạy sai và muốn rollback:

```bash
# Option 1: Dùng git (nếu đã commit trước đó)
git checkout -- .

# Option 2: Dùng backup
# Tìm thư mục backup mới nhất
BACKUP_DIR=$(ls -td backup-* | head -1)
cp "$BACKUP_DIR"/* ./

# Option 3: Restore từ .bak files (nếu còn)
find . -name "*.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;
```

---

## 📋 Checklist

Trước khi chạy:
- [ ] Đã commit code hiện tại
- [ ] Đã backup database (nếu cần)
- [ ] Đã đọc kỹ script và hiểu nó làm gì

Sau khi chạy:
- [ ] Đã kiểm tra backup được tạo
- [ ] Đã kiểm tra các file quan trọng đã được cập nhật
- [ ] Đã test code trên local
- [ ] Đã commit thay đổi mới

---

## 💡 Tips

1. **Chạy trên branch riêng**: Tạo branch mới trước khi chạy script
   ```bash
   git checkout -b update-domains
   ./update-domains.sh
   git add .
   git commit -m "Update domains: vanphuccare.com → vanphuccare.vn"
   ```

2. **Review changes**: Luôn xem diff trước khi commit
   ```bash
   git diff
   ```

3. **Test từng phần**: Test từng service sau khi update
   ```bash
   # Test admin
   cd admin-vpc-v3 && npm run dev
   
   # Test crm
   cd crm-vpc-v3 && npm run dev
   
   # Test elearning
   cd elerning-vpc-v3 && npm run dev
   ```

---

**Last Updated**: January 2025  
**Version**: 1.0.0

