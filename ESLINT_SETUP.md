# ESLint Configuration Guide

## 📋 Tổng quan

File `.eslintrc.json` ở root được tạo để **thống nhất format code** cho toàn bộ dự án.

---

## 🎯 Mục đích

1. ✅ **Thống nhất style:** Tất cả developers dùng cùng một format
2. ✅ **Tự động fix:** Sửa lỗi format tự động
3. ✅ **Phát hiện lỗi:** Tìm bug sớm trước khi commit
4. ✅ **Code quality:** Đảm bảo code chất lượng tốt

---

## 📁 Cấu trúc file

```
Van_Phuc_Care/
├── .eslintrc.json          # ESLint config chung (MỚI)
├── .eslintignore           # Files/folders bỏ qua (MỚI)
├── admin-vpc/
│   └── .eslintrc           # Config riêng (nếu cần override)
├── crm-vpc/
│   └── .eslintrc           # Config riêng (nếu cần override)
├── elerning-vpc/
│   └── .eslintrc           # Config riêng (nếu cần override)
└── server-vpc/
    └── .eslintrc.json      # Config riêng (TypeScript)
```

---

## ⚙️ Cấu hình chính

### 1. Extends (Base rules)
```json
"extends": [
  "airbnb-base",           // JavaScript style guide phổ biến
  "plugin:vue/recommended" // Vue.js best practices
]
```

### 2. Indentation
- **JavaScript:** 2 spaces
- **Vue template:** 2 spaces
- **Vue script:** 2 spaces (baseIndent: 1)

### 3. Line Length
- **Max:** 120 characters (warn)
- **Ignore:** URLs, strings, template literals

### 4. Quoting Style
- **Single quotes:** `'hello'` ✅
- **Double quotes:** `"hello"` ❌ (trừ khi có escape)

### 5. Semicolons
- **Required:** Có dấu `;` ở cuối mỗi statement

### 6. Vue Component Order
Thứ tự các properties trong Vue component:
```
1. el, name, parent
2. components, directives, filters
3. extends, mixins
4. props, propsData
5. data, computed, watch
6. Lifecycle hooks
7. methods
8. template, render
```

---

## 🚀 Cách sử dụng

### 1. Cài đặt dependencies

Mỗi project đã có ESLint trong `devDependencies`. Nếu chưa có, cài thêm:

```bash
# Cho Nuxt projects (admin-vpc, crm-vpc, elerning-vpc)
npm install --save-dev \
  eslint \
  eslint-config-airbnb-base \
  eslint-plugin-vue \
  eslint-plugin-import \
  eslint-import-resolver-alias \
  eslint-import-resolver-webpack

# Cho TypeScript project (server-vpc)
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-config-standard
```

### 2. Thêm scripts vào `package.json`

Thêm vào mỗi project:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.vue",
    "lint:fix": "eslint . --ext .js,.vue --fix"
  }
}
```

### 3. Chạy ESLint

**Kiểm tra lỗi (không sửa):**
```bash
cd admin-vpc
npm run lint
```

**Tự động sửa lỗi:**
```bash
cd admin-vpc
npm run lint:fix
```

---

## 📝 Ví dụ Rules

### ✅ Đúng (Pass ESLint)

```javascript
// Indentation: 2 spaces
const user = {
  name: 'John',
  age: 30,
};

// Single quotes
const message = 'Hello world';

// Semicolon required
const count = 0;

// Vue component order
export default {
  name: 'UserCard',
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      user: null,
    };
  },
  computed: {
    fullName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    },
  },
  methods: {
    async fetchUser() {
      // ...
    },
  },
};
```

### ❌ Sai (Fail ESLint)

```javascript
// Indentation: 4 spaces (sai, phải 2)
const user = {
    name: 'John',
};

// Double quotes (sai, phải single)
const message = "Hello world";

// No semicolon (sai)
const count = 0

// Vue component order sai
export default {
  methods: {
    fetchUser() {},
  },
  data() {
    return {};
  },
};
```

---

## 🔧 Customization

### Override rules cho từng project

Nếu project cần rules khác, tạo `.eslintrc` trong project folder:

**admin-vpc/.eslintrc:**
```json
{
  "extends": ["../../.eslintrc.json"],
  "rules": {
    "max-len": ["warn", 260],  // Override: cho phép dòng dài hơn
    "indent": ["error", 4]      // Override: dùng 4 spaces thay vì 2
  }
}
```

### Bỏ qua file/folder

Thêm vào `.eslintignore`:
```
# File cụ thể
config.js
legacy-code.js

# Folder
old-folder/
temp/
```

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'eslint-config-airbnb-base'"

**Giải pháp:**
```bash
npm install --save-dev eslint-config-airbnb-base
```

### Lỗi: "Parsing error: Unexpected token"

**Nguyên nhân:** ESLint không hiểu syntax mới (Vue, TypeScript)

**Giải pháp:** Đảm bảo parser đúng:
```json
{
  "parser": "vue-eslint-parser",  // Cho .vue files
  "parserOptions": {
    "parser": "@babel/eslint-parser"  // Cho JavaScript
  }
}
```

### Lỗi: "Import cannot be resolved"

**Nguyên nhân:** ESLint không tìm thấy alias paths (`@/`, `~/`)

**Giải pháp:** Kiểm tra `settings.import.resolver` trong `.eslintrc.json`

---

## 📚 Tài liệu tham khảo

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Vue ESLint Plugin](https://eslint.vuejs.org/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript ESLint](https://typescript-eslint.io/)

---

## 💡 Best Practices

1. ✅ **Chạy lint trước khi commit:**
   ```bash
   npm run lint:fix
   git add .
   git commit -m "feat: add new feature"
   ```

2. ✅ **Tích hợp vào CI/CD:**
   Thêm vào GitHub Actions workflow:
   ```yaml
   - name: Run ESLint
     run: npm run lint
   ```

3. ✅ **IDE Integration:**
   - VS Code: Cài extension "ESLint"
   - WebStorm: Enable ESLint trong Settings

4. ✅ **Pre-commit hook:**
   Dùng `husky` + `lint-staged` để tự động lint trước khi commit

---

## 📝 Lưu ý

- File `.eslintrc.json` ở root là **base config**
- Các project có thể **override** bằng `.eslintrc` riêng
- File `.eslintignore` bỏ qua các file không cần lint
- Luôn chạy `lint:fix` trước khi commit để đảm bảo format nhất quán

