# 📝 Environment Variables Template

## 🚨 QUAN TRỌNG: Tạo file .env cho mỗi project

File `.env` không thể auto-generate. Team dev cần tạo manually:

---

## 📁 Admin Portal (.env)

**Tạo file**: `admin-vpc-v3/.env`

```env
# API Configuration
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/a

# TinyMCE Configuration (Rich Text Editor)
NUXT_PUBLIC_TINYMCE_KEY=your-tinymce-api-key-here

# App Configuration
NUXT_PUBLIC_APP_NAME=Admin Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## 📁 CRM Portal (.env)

**Tạo file**: `crm-vpc-v3/.env`

```env
# API Configuration
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/a

# TinyMCE Configuration (Rich Text Editor)
NUXT_PUBLIC_TINYMCE_KEY=your-tinymce-api-key-here

# App Configuration
NUXT_PUBLIC_APP_NAME=CRM Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

---

## 📁 E-Learning Portal (.env)

**Tạo file**: `elerning-vpc-v3/.env`

```env
# API Configuration
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/a

# TinyMCE Configuration (Rich Text Editor)
NUXT_PUBLIC_TINYMCE_KEY=your-tinymce-api-key-here

# App Configuration
NUXT_PUBLIC_APP_NAME=E-Learning Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3002

# Environment
NODE_ENV=development
```

---

## ⚡ Quick Commands

### PowerShell (Windows)

```powershell
# Admin Portal
@"
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/a
NUXT_PUBLIC_TINYMCE_KEY=your-tinymce-api-key-here
NUXT_PUBLIC_APP_NAME=Admin Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
"@ | Out-File -FilePath "admin-vpc-v3\.env" -Encoding UTF8

# CRM Portal
@"
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/a
NUXT_PUBLIC_TINYMCE_KEY=your-tinymce-api-key-here
NUXT_PUBLIC_APP_NAME=CRM Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
"@ | Out-File -FilePath "crm-vpc-v3\.env" -Encoding UTF8

# E-Learning Portal
@"
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/a
NUXT_PUBLIC_TINYMCE_KEY=your-tinymce-api-key-here
NUXT_PUBLIC_APP_NAME=E-Learning Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3002
NODE_ENV=development
"@ | Out-File -FilePath "elerning-vpc-v3\.env" -Encoding UTF8
```

---

## 📝 Notes

1. **KHÔNG commit** file `.env` vào git
2. `.gitignore` đã được config để ignore `.env`
3. Cập nhật `NUXT_PUBLIC_TINYMCE_KEY` sau khi lấy key từ team lead
4. Restart dev server sau khi tạo `.env`

---

**Status**: Ready to use after creating .env files

