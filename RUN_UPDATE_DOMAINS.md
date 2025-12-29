# 🚀 Cách Chạy Script update-domains.sh

## 📝 Câu Lệnh Chạy

### Trên Windows (Git Bash - Khuyến nghị)

```bash
# Mở Git Bash, sau đó chạy:
cd /e/Desktop/Project/Van_Phuc_Care
chmod +x update-domains.sh
./update-domains.sh
```

### Trên Windows (PowerShell - Nếu không có Git Bash)

```powershell
# Mở PowerShell, chạy Git Bash
& "C:\Program Files\Git\bin\bash.exe" -c "cd /e/Desktop/Project/Van_Phuc_Care && chmod +x update-domains.sh && ./update-domains.sh"
```

### Trên Linux/Mac

```bash
cd /path/to/Van_Phuc_Care
chmod +x update-domains.sh
./update-domains.sh
```

---

## ⚠️ QUAN TRỌNG: Trước khi chạy

1. **Commit code hiện tại**:
   ```bash
   git add .
   git commit -m "Backup before domain update"
   ```

2. **Đảm bảo đang ở đúng thư mục**:
   ```bash
   pwd  # Phải là thư mục Van_Phuc_Care
   ```

---

## ✅ Sau khi chạy

1. **Kiểm tra thay đổi**:
   ```bash
   git status
   git diff
   ```

2. **Kiểm tra không còn domain cũ**:
   ```bash
   grep -r "vanphuccare\.com" --include="*.ts" --include="*.vue" --include="*.js" --include="*.yml" --include="*.env" | grep -v node_modules | grep -v ".git" | grep -v backup
   ```

3. **Commit thay đổi**:
   ```bash
   git add .
   git commit -m "Update domains: vanphuccare.com → vanphuccare.vn"
   ```

---

## 🆘 Nếu gặp lỗi

### Lỗi: Permission denied
```bash
chmod +x update-domains.sh
```

### Lỗi: Command not found
- Dùng Git Bash thay vì CMD/PowerShell
- Hoặc cài Git Bash: https://git-scm.com/downloads

---

**Xem chi tiết**: HOW_TO_RUN_UPDATE_DOMAINS.md

