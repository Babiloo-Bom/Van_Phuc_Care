# 🔧 Fix: Circular Dependency Error

## 🚨 LỖI

```
Uncaught ReferenceError: Cannot access 'Ye' before initialization
```

## 🔍 NGUYÊN NHÂN

Lỗi này xảy ra do **circular dependency** khi:
1. Split vendor chunks quá aggressive (tách Icons riêng khỏi Ant Design)
2. `@ant-design/icons-vue` và `ant-design-vue` có dependencies lẫn nhau
3. Vite không thể resolve đúng thứ tự initialization

## ✅ GIẢI PHÁP ĐÃ ÁP DỤNG

### Option 1: Conservative Chunking (Đã áp dụng)

```typescript
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    // ✅ Keep Ant Design + Icons together
    if (id.includes('ant-design-vue') || id.includes('@ant-design/icons-vue')) {
      return 'vendor-antd';
    }
    // ✅ Separate date utilities (no deps on Ant Design)
    if (id.includes('dayjs')) {
      return 'vendor-dayjs';
    }
    // ✅ All other vendors
    return 'vendor';
  }
}
```

**Kết quả**:
- `vendor-antd.js`: Ant Design + Icons (together, no circular dep)
- `vendor-dayjs.js`: Date library
- `vendor.js`: Other libraries

### Option 2: No Manual Chunks (Backup trong `nuxt.config.safe.ts`)

Nếu vẫn lỗi, dùng automatic chunking của Vite:

```typescript
vite: {
  build: {
    minify: 'terser',
    // Không có manualChunks - để Vite tự động
  }
}
```

## 🧪 TEST

```bash
# Clean build
rm -rf .nuxt .output dist node_modules/.vite

# Rebuild
npm run build

# Test
npm run preview
```

## 📊 SO SÁNH STRATEGIES

### ❌ Aggressive Chunking (Gây lỗi)
```
vendor-antd.js (350 KiB)
vendor-icons.js (100 KiB) <- Circular dep với antd!
vendor-dayjs.js (50 KiB)
vendor.js (200 KiB)
```

### ✅ Conservative Chunking (Safe)
```
vendor-antd.js (450 KiB) <- Icons included
vendor-dayjs.js (50 KiB)
vendor.js (200 KiB)
```

### ✅ Automatic Chunking (Safest)
```
[hash].js (sizes optimized by Vite)
```

## 🎯 PERFORMANCE IMPACT

| Strategy | Bundle Size | Lighthouse Score | Risk |
|----------|-------------|------------------|------|
| Aggressive | Smallest | Highest | ⚠️ High (circular deps) |
| Conservative | Medium | High | ✅ Low |
| Automatic | Medium-Large | Medium-High | ✅ Very Low |

**Khuyến nghị**: Dùng Conservative (đã áp dụng)

## 🔄 NẾU VẪN LỖI

1. **Backup config hiện tại**:
```bash
cp nuxt.config.ts nuxt.config.backup.ts
```

2. **Dùng safe version**:
```bash
cp nuxt.config.safe.ts nuxt.config.ts
```

3. **Clean rebuild**:
```bash
rm -rf .nuxt .output dist node_modules/.vite
npm run build
```

4. **Restore nếu cần**:
```bash
cp nuxt.config.backup.ts nuxt.config.ts
```

## 💡 BEST PRACTICES

### ✅ DO
- Keep related libraries together (Ant Design + Icons)
- Test thoroughly after chunking changes
- Use conservative splitting first
- Clean build when changing chunking strategy

### ❌ DON'T
- Split tightly coupled libraries (Icons separate from Ant Design)
- Over-optimize without testing
- Skip clean builds after config changes

## 📚 REFERENCES

- [Vite Rollup Options](https://vitejs.dev/config/build-options.html#build-rollupoptions)
- [Circular Dependencies in JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init)
- [Nuxt Build Configuration](https://nuxt.com/docs/api/nuxt-config#vite)

---

**Status**: ✅ Fixed với Conservative Chunking  
**Last Updated**: 2024-12-30
