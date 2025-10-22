# 📊 HƯỚNG DẪN IMPORT API DOCUMENTATION VÀO GOOGLE SHEETS

> **Detailed Guide để import và sử dụng API documentation trong Google Sheets**

---

## 🎯 Mục đích

Hướng dẫn này giúp bạn import API documentation vào Google Sheets để:
- ✅ Dễ dàng xem và tìm kiếm API endpoints
- ✅ Chia sẻ với team members
- ✅ Quản lý version và tracking changes
- ✅ Tạo filters và reports
- ✅ Export sang formats khác (Excel, PDF, etc.)

---

## 📥 CÁCH 1: Import từ CSV File

### Bước 1: Mở Google Sheets
1. Truy cập: https://sheets.google.com
2. Click **"Blank"** để tạo spreadsheet mới
3. Đặt tên: `Van Phuc Care - API Documentation`

### Bước 2: Import CSV File
1. Click **File** → **Import**
2. Chọn tab **Upload**
3. Kéo thả file `API_DOCUMENTATION_TABLE.csv` vào
4. Hoặc click **Browse** và chọn file

### Bước 3: Configure Import Settings
```
Import location: ○ Replace spreadsheet
Separator type: ● Comma
○ Tab  ○ Custom
Convert text to numbers, dates: ☑ (checked)
```
5. Click **Import data**

### Bước 4: Format Sheet
Sheet sẽ tự động import với các columns:
- Module
- Endpoint
- Method
- URL
- Auth Required
- Query Parameters
- Request Body
- Response Success (200)
- Response Error
- Notes

---

## 🎨 CÁCH 2: Format và Beautify

### Auto-resize Columns
1. Select tất cả columns (click góc trên trái)
2. Double-click giữa 2 column headers
3. Hoặc: **Format** → **Resize columns** → **Fit to data**

### Apply Colors cho Headers
1. Select row 1 (header row)
2. **Format** → **Fill color** → Chọn màu xanh (#4285F4)
3. **Format** → **Text color** → Chọn màu trắng
4. **Format** → **Bold** (Ctrl/Cmd + B)

### Freeze Header Row
1. Select row 1
2. **View** → **Freeze** → **1 row**

### Apply Borders
1. Select toàn bộ data (Ctrl/Cmd + A)
2. Click **Borders** icon (ở toolbar)
3. Select **All borders**

### Color Code Methods
Apply conditional formatting cho column "Method":
1. Select column "Method" (column C)
2. **Format** → **Conditional formatting**
3. Thêm rules sau:

**Rule 1 - GET (Xanh lá)**
```
Format cells if: Text contains
Value: GET
Formatting style: Light green 3 (#B7E1CD)
```

**Rule 2 - POST (Xanh dương)**
```
Format cells if: Text contains
Value: POST
Formatting style: Light blue 3 (#C9DAF8)
```

**Rule 3 - PATCH/PUT (Cam)**
```
Format cells if: Text contains
Value: PATCH
Formatting style: Light orange 3 (#FCE5CD)
```

**Rule 4 - DELETE (Đỏ)**
```
Format cells if: Text contains
Value: DELETE
Formatting style: Light red 3 (#F4CCCC)
```

---

## 🔍 CÁCH 3: Tạo Filters và Views

### Create Filter
1. Select header row (row 1)
2. Click **Data** → **Create a filter**
3. Filter icons sẽ xuất hiện ở mỗi column header

### Common Filter Use Cases

**Filter by Module**
- Click filter icon ở column "Module"
- Uncheck "Select all"
- Check modules bạn muốn xem (e.g., "Authentication", "Products")

**Filter by Method**
- Click filter icon ở column "Method"
- Chọn specific methods (GET, POST, etc.)

**Filter by Auth Required**
- Click filter icon ở column "Auth Required"
- Chọn "Yes" để xem APIs cần authentication

### Save Filter Views
1. **Data** → **Filter views** → **Create new filter view**
2. Apply filters
3. Đặt tên (e.g., "GET APIs Only", "Authentication Endpoints")
4. Click **Save**

---

## 📋 CÁCH 4: Tạo Organized Sheets Structure

Tạo multiple sheets cho organization tốt hơn:

### Sheet 1: Overview (Dashboard)
```
Contents:
- Total endpoints count
- Endpoints by module (pie chart)
- Endpoints by method (bar chart)
- Recent changes log
```

### Sheet 2: All Endpoints
```
Full imported data từ CSV
```

### Sheet 3: By Module
```
Separate sections hoặc sheets cho từng module:
- Authentication
- FAQs
- Products
- Customers
- etc.
```

### Sheet 4: Quick Reference
```
Simplified view chỉ với:
- Endpoint name
- Method
- URL
- Auth Required
```

---

## 📊 CÁCH 5: Create Dashboard với Charts

### Endpoint Count by Module (Pie Chart)
1. Select data: Module column
2. **Insert** → **Chart**
3. Chart type: **Pie chart**
4. Customize:
   - Title: "Endpoints by Module"
   - Legend position: Right
   - Slice colors: Custom

### Endpoint Count by Method (Bar Chart)
1. Select data: Method column
2. **Insert** → **Chart**
3. Chart type: **Column chart**
4. Customize:
   - Title: "Endpoints by Method"
   - Horizontal axis: Method
   - Vertical axis: Count

---

## 🔗 CÁCH 6: Add Hyperlinks

### Link to Detailed Documentation
1. Select cell với endpoint name
2. **Insert** → **Link** (Ctrl/Cmd + K)
3. Paste link to detailed docs hoặc Postman

### Link URLs as Clickable
Formula ở column mới:
```
=HYPERLINK("https://api.vanphuccare.com" & D2, D2)
```
Trong đó D2 là cell chứa URL path

---

## 💡 TIPS VÀ BEST PRACTICES

### 1. Use Data Validation
**For Method Column:**
1. Select Method column
2. **Data** → **Data validation**
3. Criteria: **List of items**
4. Items: `GET, POST, PATCH, PUT, DELETE`
5. Show dropdown in cell: ☑

**For Auth Required Column:**
1. Select Auth Required column
2. **Data** → **Data validation**
3. Criteria: **List of items**
4. Items: `Yes, No`

### 2. Use Notes/Comments
- Right-click cell → **Insert note** (cho personal notes)
- Right-click cell → **Insert comment** (cho team collaboration)

### 3. Version Control
**Sheet Name Convention:**
```
v1.0.0 - 2024-10-22
v1.0.1 - 2024-10-23
v1.1.0 - 2024-11-01
```

**Change Log Tab:**
| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2024-10-22 | 1.0.0 | Initial import | John Doe |
| 2024-10-23 | 1.0.1 | Added 5 new endpoints | Jane Smith |

### 4. Share Settings
**View Only:**
- Click **Share** button
- Add email addresses
- Set permission: **Viewer**

**Comment Access:**
- Cho phép người khác comment nhưng không edit
- Set permission: **Commenter**

**Edit Access:**
- Cho team leads và developers
- Set permission: **Editor**

### 5. Protect Important Data
1. Select header row
2. **Data** → **Protect sheets and ranges**
3. Add description: "Header Row - Do Not Edit"
4. Set permissions: **Only you**

---

## 🔄 CÁCH 7: Keep Data Updated

### Manual Update
1. Export new CSV từ updated documentation
2. **File** → **Import** → **Replace current sheet**

### Google Apps Script (Auto-sync)
**Script để auto-import từ GitHub/GitLab:**
```javascript
function updateAPIDocumentation() {
  const csvUrl = 'YOUR_CSV_URL_HERE';
  const response = UrlFetchApp.fetch(csvUrl);
  const csv = response.getContentText();
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('All Endpoints');
  const data = Utilities.parseCsv(csv);
  
  sheet.clear();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  
  Logger.log('API Documentation updated successfully');
}

// Set trigger: Edit → Current project's triggers → Add trigger
// Function: updateAPIDocumentation
// Event source: Time-driven
// Type: Day timer
// Time: 1am to 2am
```

### Scheduled Auto-Update
1. **Extensions** → **Apps Script**
2. Paste script above
3. **Triggers** → **Add Trigger**
4. Schedule: Daily at 1am

---

## 📱 CÁCH 8: Mobile Access

### Google Sheets App
1. Download: **Google Sheets** app (iOS/Android)
2. Sign in với Google account
3. Open spreadsheet
4. Xem và filter data on-the-go

### Offline Access
1. On desktop: **File** → **Make available offline**
2. On mobile: Tap **⋮** → **Make available offline**

---

## 🎓 ADVANCED FEATURES

### 1. QUERY Function
Tạo dynamic views:
```
=QUERY(A:J, "SELECT A, B, C, D WHERE C = 'GET' ORDER BY A", 1)
```
Explanation:
- `A:J`: Data range
- `SELECT A, B, C, D`: Columns to show
- `WHERE C = 'GET'`: Filter condition
- `ORDER BY A`: Sort by Module
- `1`: Header rows

### 2. FILTER Function
```
=FILTER(A:J, C:C="POST", E:E="Yes")
```
Shows: POST endpoints that require authentication

### 3. VLOOKUP for Quick Search
Create search box:
```
=VLOOKUP(searchTerm, A:J, 4, FALSE)
```

### 4. Conditional Formatting với Custom Formula
Highlight authentication required:
```
Formula: =$E2="Yes"
Format: Light red background
```

---

## 📚 SAMPLE FORMULAS

### Count Total Endpoints
```
=COUNTA(B:B)-1
```
(Subtract 1 for header)

### Count by Module
```
=COUNTIF(A:A, "Authentication")
```

### Count by Method
```
=COUNTIF(C:C, "GET")
```

### List Unique Modules
```
=UNIQUE(A:A)
```

### Calculate API Coverage
```
=COUNTIFS(I:I, "<>", A:A, "<>") / (COUNTA(A:A)-1) * 100 & "%"
```
(Endpoints với response documentation / total endpoints)

---

## 🐛 TROUBLESHOOTING

### Issue: CSV không import đúng format
**Solution:**
- Check file encoding: UTF-8
- Check separator: Comma (,)
- Check quotes: Double quotes (") cho fields có commas

### Issue: JSON trong cells bị break
**Solution:**
1. Wrap JSON trong quotes ở CSV file
2. Hoặc use separate column cho formatted JSON
3. Apply **Wrap text** format: **Format** → **Text wrapping** → **Wrap**

### Issue: Column widths quá hẹp
**Solution:**
1. Select all columns
2. Double-click between column headers
3. Hoặc: Right-click column header → **Resize column** → Enter width

### Issue: Too many rows làm chậm sheet
**Solution:**
1. Split into multiple sheets by module
2. Use **Filter views** thay vì copy data
3. Archive old versions sang separate spreadsheet

---

## ✅ CHECKLIST

Sau khi import, verify các điểm sau:

- [ ] All data imported correctly
- [ ] Header row frozen
- [ ] Headers bold và colored
- [ ] Method column color-coded
- [ ] Filters applied
- [ ] Column widths adjusted
- [ ] Borders applied
- [ ] Sheet shared với team
- [ ] Protected ranges set
- [ ] Change log created
- [ ] Filter views saved

---

## 📞 SUPPORT

Nếu cần hỗ trợ:
1. Check Google Sheets Help: https://support.google.com/docs/answer/46973
2. Stack Overflow: Tag `google-sheets`
3. Contact admin team

---

## 🔗 RELATED RESOURCES

- **CSV File**: `API_DOCUMENTATION_TABLE.csv`
- **Detailed Markdown**: `API_DOCUMENTATION_DETAILED.md`
- **Postman Collection**: `Van_Phuc_Care_API.postman_collection.json`
- **OpenAPI Spec**: `openapi.yaml`

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Author**: Van Phuc Care Dev Team

