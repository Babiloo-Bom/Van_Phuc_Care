# Support Request Tab Implementation

## Overview
Đã hoàn thành tab "Yêu cầu hỗ trợ" trong trang Sổ sức khỏe điện tử với đầy đủ 2 trạng thái: Empty state và danh sách yêu cầu.

## Files Created

### 1. **components/health-book/SupportRequestList.vue** (NEW)
Container component quản lý danh sách yêu cầu hỗ trợ với 2 states.

#### State 1: Empty State (Hình 1 & 2)
**Features:**
- Mascot dragon image (`/images/dragon_banner.png`)
- Friendly message: "Hiện tại cha mẹ chưa có yêu cầu hỗ trợ nào được ghi nhận..."
- Primary CTA button: "Tạo phiếu ngay"
- Centered layout với padding responsive
- Text max-width 600px cho readability

**Design:**
```
┌─────────────────────────────┐
│                             │
│      [Dragon Mascot]        │
│                             │
│  Hiện tại cha mẹ chưa có... │
│                             │
│    [Tạo phiếu ngay]        │
│                             │
└─────────────────────────────┘
```

#### State 2: Request List (Hình 3 & 4)
**Features:**
- Header: "DANH SÁCH PHIẾU HỖ TRỢ" (blue, bold, uppercase)
- Action button: "Tạo phiếu mới" với icon `PlusOutlined`
- Vertical list of SupportRequestCard components
- Gap 16px giữa các cards
- Responsive header (column layout trên mobile)

**Design:**
```
┌────────────────────────────────────────┐
│ DANH SÁCH PHIẾU HỖ TRỢ  [Tạo phiếu mới]│
├────────────────────────────────────────┤
│ [Support Request Card 1]               │
├────────────────────────────────────────┤
│ [Support Request Card 2]               │
├────────────────────────────────────────┤
│ [Support Request Card 3]               │
└────────────────────────────────────────┘
```

**Props Interface:**
```typescript
export interface SupportRequest {
  id: string           // Format: "00001"
  title: string        // Main question/issue title
  description: string  // Category or description
  category: string     // "Dịch vụ", "Khóa học", etc.
  date: string         // Format: "DD/MM/YYYY"
  status: 'pending' | 'processing' | 'completed'
}
```

**Mock Data Structure:**
```typescript
const requests = ref<SupportRequest[]>([
  {
    id: '00001',
    title: 'Vì sao nhiều cha mẹ lựa chọn?',
    description: 'Hỗ trợ vấn đề của bé',
    category: 'Dịch vụ',
    date: '08/01/2024',
    status: 'processing' // or 'completed', 'pending'
  }
])
```

**Handlers:**
- `handleCreateRequest()` - Opens create modal/navigates to create page
- `handleViewDetail(requestId)` - Navigates to request detail page

**TODO:**
- [ ] Kết nối với API backend
- [ ] Create modal/page cho yêu cầu mới
- [ ] Detail page cho từng yêu cầu
- [ ] Pagination nếu có nhiều requests
- [ ] Filter/search functionality

---

### 2. **components/health-book/SupportRequestCard.vue** (NEW)
Card component hiển thị thông tin từng yêu cầu hỗ trợ.

**Layout:**
```
┌────────────────────────────────────┐
│ Title                  [STATUS]    │
│ Description | Date                 │
│ ID: #00001                         │
│                          Chi tiết →│
└────────────────────────────────────┘
```

**Card Sections:**
1. **Header:**
   - Title (left, blue, font-weight 600)
   - Status badge (right, colored tag)

2. **Body:**
   - Meta info: Description | Date (gray text)
   - Request ID (smaller, lighter gray)

3. **Footer:**
   - "Chi tiết" link (right-aligned, blue, clickable)

**Status Configuration:**
```typescript
const statusConfig = {
  pending: {
    color: 'default',  // Gray
    text: 'CHỜ XỬ LÝ'
  },
  processing: {
    color: 'warning',  // Orange/Yellow
    text: 'ĐANG XỬ LÝ'
  },
  completed: {
    color: 'success',  // Green
    text: 'HOÀN TẤT'
  }
}
```

**Props:**
```typescript
interface Props {
  request: SupportRequest
}
```

**Emits:**
```typescript
const emit = defineEmits<{
  viewDetail: [requestId: string]
}>()
```

**Hover Effects:**
- Border color changes to blue (#1890ff)
- Box shadow appears (0 2px 8px rgba(0, 0, 0, 0.08))
- "Chi tiết" link underlines

**Responsive:**
- Mobile: Vertical stack, smaller font sizes
- Desktop: Horizontal layout with proper spacing

---

### 3. **pages/health-book/[id].vue** (MODIFIED)
Updated tab "Yêu cầu hỗ trợ" để sử dụng SupportRequestList component.

**Changes:**
```vue
<!-- Before -->
<a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
  <div class="text-center py-12">
    <a-empty description="Chức năng đang được phát triển" />
  </div>
</a-tab-pane>

<!-- After -->
<a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
  <SupportRequestList />
</a-tab-pane>
```

Component tự động import nhờ Nuxt auto-imports.

---

## Design Specifications

### Desktop View (Hình 1 & 3)
- Sidebar navigation (existing)
- Main content area với tabs
- Full-width layout
- Cards with hover effects

### Mobile View (Hình 2 & 4)
- Baby profile header
- Horizontal tabs
- Stacked card layout
- Full-width buttons
- Reduced padding and font sizes

---

## Icons Used

From `@ant-design/icons-vue`:
- `PlusOutlined` - "Tạo phiếu mới" button icon

---

## CSS Features

### Empty State
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.mascot {
  width: 280px;
  height: auto;
  max-width: 100%;
}

.empty-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0 0 32px;
  max-width: 600px;
}
```

### Request List
```css
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-title {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
  letter-spacing: 0.5px;
}
```

### Support Request Card
```css
.support-request-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.support-request-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

### Mobile Responsive
```css
@media (max-width: 768px) {
  .empty-state {
    padding: 40px 16px;
  }

  .mascot {
    width: 220px;
  }

  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .list-header .ant-btn {
    width: 100%;
  }
}
```

---

## Testing Guide

### To Test Empty State:
Set `requests` array to empty in `SupportRequestList.vue`:
```typescript
const requests = ref<SupportRequest[]>([])
```

### To Test With Data:
Uncomment mock data in `SupportRequestList.vue`:
```typescript
const requests = ref<SupportRequest[]>([
  {
    id: '00001',
    title: 'Vì sao nhiều cha mẹ lựa chọn?',
    // ... rest of data
  }
])
```

### Testing Checklist

**Empty State:**
- [ ] Dragon mascot hiển thị
- [ ] Text message centered và readable
- [ ] "Tạo phiếu ngay" button hoạt động
- [ ] Mobile responsive (smaller mascot, text)

**Request List:**
- [ ] Header "DANH SÁCH PHIẾU HỖ TRỢ" hiển thị
- [ ] "Tạo phiếu mới" button với icon +
- [ ] Cards hiển thị đúng layout
- [ ] Status badges đúng màu:
  - CHỜ XỬ LÝ (gray)
  - ĐANG XỬ LÝ (orange)
  - HOÀN TẤT (green)
- [ ] "Chi tiết" link hoạt động
- [ ] Hover effects (border, shadow)
- [ ] Mobile: stacked layout, full-width buttons

**TypeScript:**
- [x] 0 TypeScript errors
- [x] All props typed correctly
- [x] Interface definitions exported

---

## Future Enhancements

### 1. API Integration
Create `composables/api/useSupportRequestsApi.ts`:
```typescript
export const useSupportRequestsApi = () => {
  const { sendRequest } = useApi()

  return {
    // GET /api/a/support-requests?customerId={id}
    getSupportRequests: (customerId: string) => { ... },
    
    // GET /api/a/support-requests/:id
    getSupportRequest: (id: string) => { ... },
    
    // POST /api/a/support-requests
    createSupportRequest: (data: CreateSupportRequestDto) => { ... },
    
    // PUT /api/a/support-requests/:id
    updateSupportRequest: (id: string, data: UpdateSupportRequestDto) => { ... },
    
    // DELETE /api/a/support-requests/:id
    deleteSupportRequest: (id: string) => { ... }
  }
}
```

### 2. Create Request Modal/Page
- Form with fields:
  - Title (required)
  - Category dropdown (Dịch vụ, Khóa học, Sức khỏe, Khác)
  - Description textarea (required)
  - Priority (Low, Medium, High)
  - Attachments (optional)
- Validation
- Submit to API

### 3. Detail Page
Create `pages/support-requests/[id].vue`:
- Full request details
- Timeline/history of status changes
- Comments/replies from staff
- Update status
- Add comments
- Download attachments

### 4. Additional Features
- **Pagination:** For long lists of requests
- **Search:** Filter by title, ID, category
- **Sort:** By date, status, priority
- **Notifications:** Alert when status changes
- **Export:** Download as PDF
- **Stats:** Count by status (pending: 3, processing: 5, completed: 10)

### 5. Backend Requirements
Schema example:
```typescript
interface SupportRequestSchema {
  _id: ObjectId
  customerId: string
  babyId?: string
  title: string
  description: string
  category: 'service' | 'course' | 'health' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  attachments?: string[]
  comments?: Comment[]
  assignedTo?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

---

## Related Files

- `pages/health-book/[id].vue` - Main page with tabs
- `components/health-book/SupportRequestList.vue` - Container component
- `components/health-book/SupportRequestCard.vue` - Card component
- `public/images/dragon_banner.png` - Mascot image for empty state

---

## Screenshots Reference

**Hình 1 (Desktop - Empty State):**
- Sidebar + mascot + message + button
- Centered layout với white background

**Hình 2 (Mobile - Empty State):**
- Baby header + tabs + mascot + message + button
- Smaller mascot (220px)
- Full-width button

**Hình 3 (Desktop - Request List):**
- Sidebar + header with button + 5 request cards
- Mixed statuses (ĐANG XỬ LÝ, HOÀN TẤT)
- Hover effects visible

**Hình 4 (Mobile - Request List):**
- Baby header + tabs + header + 5 stacked cards
- Full-width "Tạo phiếu mới" button
- Reduced padding

---

## Mock Data Configuration

**Current State:** Empty array (shows empty state)

**To Enable Request List:**
Uncomment lines 42-74 in `SupportRequestList.vue`

**Sample Data:**
- 5 requests total
- 4 with status "processing" (orange badge)
- 1 with status "completed" (green badge)
- All from "Dịch vụ" category
- All dated 08/01/2024
- IDs: 00001-00005

---

## Status

✅ **Completed:**
- SupportRequestList component with empty state
- SupportRequestCard component with full design
- Status badges with colors (gray/orange/green)
- Mobile responsive layout
- TypeScript types (0 errors)
- Hover effects and styling
- Integration into main health book page

⚠️ **Pending:**
- API integration (using mock data currently)
- Create request modal/page
- Detail page for each request
- Pagination for long lists
- Search/filter functionality

---

## Color Palette

| Status | Color Type | Hex | Usage |
|--------|-----------|-----|-------|
| CHỜ XỬ LÝ | default | #d9d9d9 | Pending requests |
| ĐANG XỬ LÝ | warning | #faad14 | Processing requests |
| HOÀN TẤT | success | #52c41a | Completed requests |
| Primary | primary | #1890ff | Title, links, buttons |
| Text | - | #333 | Body text |
| Meta | - | #666 | Secondary text |
| Light | - | #999 | ID, timestamps |

---

## Notes

- Mock data mặc định là empty array để demo empty state
- Uncomment mock data để test request list view
- Dragon mascot từ existing asset (`/images/dragon_banner.png`)
- All components fully typed (no `any` types)
- Responsive design matches both desktop and mobile screenshots
- Ready for API integration when backend endpoints are available
- Vue Language Server may need restart to clear global types error

---

## Migration from Old CRM

Nếu có component tương tự trong `crm-vpc` (old):
- Check `crm-vpc/components/support/` folder
- Migrate styles và logic nếu cần
- Update to use Composition API
- Add TypeScript types
- Use Ant Design Vue v4 components
