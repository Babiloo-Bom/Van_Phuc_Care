# 🚀 QUICK START GUIDE - Van Phuc Care API Documentation

> **Get started with API documentation trong 5 phút!**

---

## 🎯 Choose Your Path

Chọn role của bạn để xem hướng dẫn phù hợp:

1. [🧑‍💻 Developer (Backend/API)](#-developer-backendapi)
2. [👨‍💻 Developer (Frontend)](#-developer-frontend)
3. [📊 Product Manager / Stakeholder](#-product-manager--stakeholder)
4. [🧪 QA Engineer / Tester](#-qa-engineer--tester)
5. [📝 Technical Writer](#-technical-writer)

---

## 🧑‍💻 Developer (Backend/API)

### ⏱️ 5-Minute Setup

**Step 1: Get Postman** (1 min)
```bash
# Download Postman
https://www.postman.com/downloads/

# Or use Postman Web
https://web.postman.com/
```

**Step 2: Import Collection** (1 min)
1. Open Postman
2. Click **Import**
3. Drag & drop: `Van_Phuc_Care_API.postman_collection.json`
4. Drag & drop: `Van_Phuc_Care.postman_environment.json`

**Step 3: Setup Environment** (1 min)
1. Select environment: `Van Phuc Care - Local`
2. Update `baseUrl`:
   ```
   http://localhost:3000/api
   ```

**Step 4: Test Login** (1 min)
1. Open: **Admin APIs** → **Authentication** → **Login Admin**
2. Update credentials trong body
3. Click **Send**
4. ✅ Token auto-saved!

**Step 5: Test Other APIs** (1 min)
1. Try: **Get All FAQs**
2. Try: **Create FAQ**
3. Explore other endpoints

### 📖 Next Steps
- Read: [Postman Usage Guide](./POSTMAN_USAGE_GUIDE.md)
- Explore: [API Documentation](./API_DOCUMENTATION_DETAILED.md)
- Reference: [OpenAPI Spec](./openapi.yaml)

---

## 👨‍💻 Developer (Frontend)

### ⏱️ 5-Minute Setup

**Step 1: Review Discovered APIs** (2 min)
```bash
# Open trong editor
code API_ENDPOINTS_DISCOVERED.md

# Tìm APIs cho project của bạn:
# - admin-vpc: Admin Portal APIs
# - crm-vpc: CRM Portal APIs  
# - elerning-vpc: E-Learning APIs
```

**Step 2: Check API Details** (2 min)
```bash
# Open API reference
code API_DOCUMENTATION_DETAILED.md

# Search for endpoint bạn cần
# Example: "Login Admin", "Get All Products"
```

**Step 3: Copy & Implement** (1 min)
```javascript
// Example: Implement trong Nuxt.js
// File: api/auth.js

export default ($axios) => ({
  async login(email, password) {
    return await $axios.$post('/a/sessions/login', {
      email,
      password
    });
  },
  
  async getCurrentAdmin() {
    return await $axios.$get('/a/sessions/current_admin');
  }
});
```

### 📖 Next Steps
- Review: [API Audit Report](./API_AUDIT_REPORT.md)
- Test APIs: Setup Postman ([guide](./POSTMAN_USAGE_GUIDE.md))
- Reference: [API Documentation](./API_DOCUMENTATION_DETAILED.md)

---

## 📊 Product Manager / Stakeholder

### ⏱️ 5-Minute Setup

**Step 1: Open Google Sheets** (1 min)
```
1. Go to: https://sheets.google.com
2. Create: New Blank Spreadsheet
3. Name: "Van Phuc Care - API Documentation"
```

**Step 2: Import CSV** (2 min)
```
1. File → Import
2. Upload: API_DOCUMENTATION_TABLE.csv
3. Import location: Replace spreadsheet
4. Separator type: Comma
5. Click: Import data
```

**Step 3: Format Sheet** (1 min)
```
1. Freeze row 1: View → Freeze → 1 row
2. Auto-resize: Select all → Double-click column border
3. Bold header: Select row 1 → Ctrl+B
```

**Step 4: Create Filter** (1 min)
```
1. Select header row
2. Data → Create a filter
3. Try filter by Module or Method
```

### 📊 View Summary
Open: [API Audit Summary](./API_AUDIT_SUMMARY.md)

**Key Metrics**:
- Total Endpoints: 100+
- Modules: 15+
- Coverage: 100%

### 📖 Next Steps
- Detailed Guide: [Google Sheets Import Guide](./GOOGLE_SHEET_IMPORT_GUIDE.md)
- Review: [API Audit Report](./API_AUDIT_REPORT.md)
- Share với team

---

## 🧪 QA Engineer / Tester

### ⏱️ 5-Minute Setup

**Step 1: Install Postman** (1 min)
```
Download: https://www.postman.com/downloads/
```

**Step 2: Import Collection** (1 min)
```
1. Postman → Import
2. Upload: Van_Phuc_Care_API.postman_collection.json
3. Upload: Van_Phuc_Care.postman_environment.json
```

**Step 3: Setup Test Environment** (1 min)
```
1. Select environment: Van Phuc Care - Local
2. Update variables:
   - baseUrl: http://localhost:3000/api
   - (tokens auto-set after login)
```

**Step 4: Run First Test** (1 min)
```
1. Open: Login Admin
2. Update credentials
3. Send → Check response
4. Verify: adminToken saved in environment
```

**Step 5: Create Test Suite** (1 min)
```javascript
// Add test script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData.status).to.be.true;
});
```

### 🧪 Run Collection Tests
```bash
# Install Newman
npm install -g newman

# Run all tests
newman run Van_Phuc_Care_API.postman_collection.json \
  -e Van_Phuc_Care.postman_environment.json \
  -r cli,json,html
```

### 📖 Next Steps
- Guide: [Postman Usage Guide](./POSTMAN_USAGE_GUIDE.md)
- Reference: [API Documentation](./API_DOCUMENTATION_DETAILED.md)
- Setup CI/CD testing

---

## 📝 Technical Writer

### ⏱️ 5-Minute Setup

**Step 1: Clone Documentation** (1 min)
```bash
# Access project folder
cd Van_Phuc_Care

# View documentation files
ls -la *.md
```

**Step 2: Review Structure** (2 min)
```
Main Files:
- API_DOCUMENTATION_INDEX.md    (Master index)
- API_DOCUMENTATION_DETAILED.md (Main reference)
- API_AUDIT_REPORT.md           (Audit results)

Support Files:
- GOOGLE_SHEET_IMPORT_GUIDE.md
- POSTMAN_USAGE_GUIDE.md
- QUICK_START.md (this file)
```

**Step 3: Open in Editor** (1 min)
```bash
# VS Code
code .

# Or specific file
code API_DOCUMENTATION_INDEX.md
```

**Step 4: Preview Markdown** (1 min)
```
VS Code: Ctrl+Shift+V (Preview)
Or use: Markdown Preview Enhanced extension
```

### 📖 Documentation Standards
- Format: Markdown
- Style: Clear, concise, example-driven
- Structure: Hierarchical với clear headings
- Code blocks: Include language identifier

### ✏️ Editing Guidelines
```markdown
# Use clear headings
## Level 2 for main sections
### Level 3 for subsections

**Bold** for emphasis
*Italic* for terms
`code` for inline code

```language
code blocks with language identifier
```

> Blockquotes for notes

- Bullet lists
- For items

1. Numbered lists
2. For steps
```

### 📖 Next Steps
- Review: [Documentation Index](./API_DOCUMENTATION_INDEX.md)
- Check: [OpenAPI Spec](./openapi.yaml)
- Update: Maintain consistency across docs

---

## 📚 ESSENTIAL FILES OVERVIEW

### For Quick Reference
```
📄 QUICK_START.md                    ← You are here!
📄 API_DOCUMENTATION_INDEX.md        ← Master navigation
📄 API_DOCUMENTATION_DETAILED.md     ← Full API reference
```

### For Implementation
```
📮 Van_Phuc_Care_API.postman_collection.json
📦 Van_Phuc_Care.postman_environment.json
🔧 openapi.yaml
```

### For Management
```
📊 API_DOCUMENTATION_TABLE.csv
📖 GOOGLE_SHEET_IMPORT_GUIDE.md
📋 API_AUDIT_SUMMARY.md
```

---

## 🎯 COMMON TASKS

### Task: "Tôi cần test một API endpoint"
```
1. Open Postman
2. Import collection (if not done)
3. Find endpoint trong collection
4. Update request (if needed)
5. Send → View response
```
📖 Guide: [Postman Usage Guide](./POSTMAN_USAGE_GUIDE.md)

---

### Task: "Tôi cần xem list tất cả APIs"
```
Option 1: Google Sheets
- Import: API_DOCUMENTATION_TABLE.csv
- Guide: GOOGLE_SHEET_IMPORT_GUIDE.md

Option 2: Markdown
- Open: API_DOCUMENTATION_DETAILED.md
- Search: Ctrl+F

Option 3: Postman
- View collection structure
```

---

### Task: "Tôi cần implement một API trong frontend"
```
1. Find endpoint:
   - Check: API_ENDPOINTS_DISCOVERED.md
   - Or: API_DOCUMENTATION_DETAILED.md

2. Copy request example

3. Implement trong Nuxt.js:
   // api/module.js
   export default ($axios) => ({
     async methodName() {
       return await $axios.$method('/path');
     }
   });

4. Test với Postman trước
```

---

### Task: "Tôi cần share API docs với team"
```
Option 1: Google Sheets (Non-technical)
- Import CSV → Share link

Option 2: Postman (Developers)
- Share collection → Team workspace

Option 3: Markdown (Technical)
- Share API_DOCUMENTATION_DETAILED.md
- Or: Host Swagger UI với openapi.yaml
```

---

### Task: "Tôi cần generate API client code"
```
1. Use OpenAPI spec:
   - File: openapi.yaml

2. Generate với tools:
   # JavaScript/TypeScript
   npx @openapitools/openapi-generator-cli generate \
     -i openapi.yaml \
     -g typescript-axios \
     -o ./generated-client

   # Python
   openapi-generator generate \
     -i openapi.yaml \
     -g python \
     -o ./python-client
```

---

## 🆘 TROUBLESHOOTING

### "File not found"
```
Check bạn đang ở đúng folder:
cd Van_Phuc_Care/

List files:
ls -la *.md *.json *.csv *.yaml
```

### "Postman collection không work"
```
1. Check environment selected
2. Check baseUrl correct
3. Try login trước
4. Check token saved
5. Read: POSTMAN_USAGE_GUIDE.md
```

### "CSV import lỗi"
```
1. Check file encoding: UTF-8
2. Check separator: Comma
3. Try: Import → Replace spreadsheet
4. Read: GOOGLE_SHEET_IMPORT_GUIDE.md
```

### "API returns error"
```
1. Check authentication (token)
2. Check request body format
3. Check required fields
4. View error response
5. Read API documentation
```

---

## 💡 TIPS

### Pro Tips for Developers
- ⚡ Use Postman environments để switch giữa dev/staging/prod
- ⚡ Save common requests as examples
- ⚡ Use pre-request scripts để auto-generate data
- ⚡ Setup Newman cho automated testing

### Pro Tips for PMs
- 📊 Create charts trong Google Sheets cho API metrics
- 📊 Use filters để view specific modules
- 📊 Add comments trong cells để track discussions
- 📊 Setup shared drive cho team access

### Pro Tips for QA
- ✅ Create test collections cho different scenarios
- ✅ Use test scripts cho automatic validation
- ✅ Setup monitors cho continuous testing
- ✅ Document test results trong sheets

---

## 📞 NEED HELP?

### Resources
- 📖 [Documentation Index](./API_DOCUMENTATION_INDEX.md) - Master navigation
- 📮 [Postman Guide](./POSTMAN_USAGE_GUIDE.md) - Detailed Postman help
- 📊 [Google Sheets Guide](./GOOGLE_SHEET_IMPORT_GUIDE.md) - Sheets help
- 🔍 [API Audit Report](./API_AUDIT_REPORT.md) - Technical details

### Support
- Internal: Contact dev team
- Postman: https://learning.postman.com/
- Google Sheets: https://support.google.com/docs/

---

## ✅ NEXT STEPS

After Quick Start, explore:

**For Developers**:
1. ✅ Setup Postman completely
2. ✅ Review all endpoint categories
3. ✅ Implement authentication flow
4. ✅ Test critical APIs
5. ✅ Setup Newman cho CI/CD

**For PMs/Stakeholders**:
1. ✅ Review API Audit Summary
2. ✅ Setup Google Sheets dashboard
3. ✅ Share với team
4. ✅ Track implementation progress
5. ✅ Review metrics regularly

**For QA**:
1. ✅ Create comprehensive test suite
2. ✅ Setup test automation
3. ✅ Configure monitors
4. ✅ Document test scenarios
5. ✅ Integrate với CI/CD

---

## 🎉 YOU'RE READY!

Bạn đã sẵn sàng sử dụng API documentation!

**Quick Links**:
- [📖 Full Documentation Index](./API_DOCUMENTATION_INDEX.md)
- [📄 API Reference](./API_DOCUMENTATION_DETAILED.md)
- [📊 Import to Sheets](./GOOGLE_SHEET_IMPORT_GUIDE.md)
- [📮 Postman Guide](./POSTMAN_USAGE_GUIDE.md)

---

**Questions?** Check the [Documentation Index](./API_DOCUMENTATION_INDEX.md) first!

**Last Updated**: October 2024  
**Version**: 1.0.0

