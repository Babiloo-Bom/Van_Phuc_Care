# Báo cáo tổng hợp & đối soát API cho site CRM

---

## 1. Tổng hợp API đã có (theo `CRM_API_LIST.md`)

| Module       | API Đã Có                                                  |
| ------------ | ---------------------------------------------------------- |
| Customers    | GET, POST, PATCH, DELETE, IMPORT, EXPORT, STATISTICS       |
| Tickets      | Chưa Có                                                    |
| Services     | GET, POST, PATCH, DELETE, chi tiết, STATISTICS             |
| Orders       | GET, POST, PATCH, DELETE, PATCH status, EXPORT, STATISTICS |
| Products     | GET, POST, PATCH, DELETE, Categories CRUD                  |
| Transactions | GET, POST, PATCH, DELETE, STATISTICS                       |
| Feedbacks    | GET, POST, PATCH, DELETE, ACTIVE/INACTIVE, STATISTICS      |
| FAQs         | GET, POST, PATCH, DELETE                                   |
| Uploads      | UPLOAD, DELETE                                             |
| Courses      | GET, POST, PUT, DELETE, chi tiết, SEED                     |

---

## 2. Đối chiếu với nhu cầu thực tế từng page

| Page      | API cần thiết (theo page)                                                                                 | API đã có | Thiếu/Sai API |
| --------- | --------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| Dashboard | Customers STATISTICS, Tickets STATISTICS, Services STATISTICS, Feedbacks STATISTICS, Tickets GET (recent) | Đã có     | Không thiếu   |
| Tickets   | GET, POST, PATCH, DELETE, STATISTICS                                                                      | Chưa có   | Thiếu         |
| Services  | GET, POST, PATCH, DELETE, chi tiết                                                                        | Đã có     | Không thiếu   |
| Customers | GET, POST, PATCH, DELETE, chi tiết                                                                        | Đã có     | Không thiếu   |
| Courses   | GET, POST, PATCH, DELETE, chi tiết                                                                        | Đã có     | Không thiếu   |

---

## 3. Phân tích chi tiết so sánh API backend với UI Dashboard

### Services Module

**Phân tích chi tiết API cho UI quản lý dịch vụ:**

- UI cần các chức năng: lấy danh sách dịch vụ, xem chi tiết, thêm mới, sửa, xóa.
- Đã kiểm tra code backend:

  - API GET `/services` trả về danh sách dịch vụ, kèm trường `pagination.total` cho tổng số lượng, đáp ứng tốt cho UI grid và phân trang.
  - API GET `/services/:id` trả về chi tiết dịch vụ, đầy đủ thông tin cho UI chi tiết.
  - API POST `/services` tạo mới dịch vụ, PATCH `/services/:id` cập nhật, POST `/services/bulk-delete` xóa nhiều dịch vụ, đều đã có và hoạt động đúng.
  - Các trường dữ liệu trả về gồm: title, thumbnail, descriptions, price, status, ... đầy đủ cho UI hiển thị.
  - Kết luận: API cho Services đã đáp ứng đầy đủ cho UI quản lý dịch vụ, không cần chỉnh sửa, chỉ cần frontend sử dụng đúng endpoint và trường dữ liệu.

### Customers Module

  **Phân tích chi tiết API cho UI quản lý khách hàng:**

- UI cần các chức năng: lấy danh sách khách hàng, xem chi tiết, thêm mới, sửa, xóa.
- Đã kiểm tra code backend:
  - API GET `/customers` trả về danh sách khách hàng, kèm trường `pagination.total` cho tổng số lượng, đáp ứng tốt cho UI table và phân trang.
  - API GET `/customers/:customerId` trả về chi tiết khách hàng, bao gồm cả danh sách đơn hàng của khách hàng đó, đáp ứng tốt cho UI chi tiết.
  - API POST `/customers` tạo mới khách hàng, PATCH `/customers/:customerId` cập nhật, DELETE `/customers/:customerId` xóa khách hàng, đều đã có và hoạt động đúng.
  - Các trường dữ liệu trả về gồm: tên, email, phone, status, ... đầy đủ cho UI hiển thị.
  - Kết luận: API cho Customers đã đáp ứng đầy đủ cho UI quản lý khách hàng, không cần chỉnh sửa, chỉ cần frontend sử dụng đúng endpoint và trường dữ liệu.
  - UI cần số lượng tổng khách hàng (Total Customers). Backend đã có API `/customers` (GET) và `/customers/statistics`.
    - Đã kiểm tra code API `/customers` (GET): Response trả về có trường `pagination.total` là tổng số khách hàng theo điều kiện lọc. Trường này đáp ứng đúng nhu cầu UI dashboard.
    - Nếu cần thống kê nâng cao (theo trạng thái, theo ngày), cần bổ sung thêm các trường hoặc endpoint `/customers/statistics`.
    - Kết luận: API đã đáp ứng nhu cầu tổng số khách hàng cho dashboard. Không cần chỉnh sửa, chỉ cần đảm bảo frontend lấy đúng trường `pagination.total`.
      **Tổng khách hàng:**
  - UI cần số lượng tổng khách hàng (Total Customers). Backend đã có API `/customers` (GET) và `/customers/statistics`.
    - Đã kiểm tra code API `/customers` (GET): Response trả về có trường `pagination.total` là tổng số khách hàng theo điều kiện lọc. Trường này đáp ứng đúng nhu cầu UI dashboard.
    - Nếu cần thống kê nâng cao (theo trạng thái, theo ngày), cần bổ sung thêm các trường hoặc endpoint `/customers/statistics`.
    - Kết luận: API đã đáp ứng nhu cầu tổng số khách hàng cho dashboard. Không cần chỉnh sửa, chỉ cần đảm bảo frontend lấy đúng trường `pagination.total`.

### Courses Module

- UI trang quản lý khóa học cần lấy danh sách các khóa học, chi tiết từng khóa học, thêm/sửa/xóa khóa học.
- Đã kiểm tra code backend:
  - API GET `/courses` trả về danh sách khóa học kèm thống kê (videoCount, documentCount, quizCount, ...), đáp ứng tốt cho UI courses list.
  - API GET `/courses/id/:id` trả về chi tiết khóa học theo id, API GET `/courses/:slug` trả về chi tiết theo slug, đều đầy đủ thông tin cho UI chi tiết.
  - API POST `/courses` tạo mới, PUT `/courses/:id` cập nhật, DELETE `/courses/:id` xóa khóa học, đều đã có và hoạt động đúng.
  - Kết luận: API cho Courses đã đáp ứng đầy đủ cho UI quản lý khóa học, không cần chỉnh sửa, chỉ cần frontend sử dụng đúng endpoint và trường dữ liệu.

### Tickets Module

**Kết quả kiểm tra:**

- Không tìm thấy bất kỳ controller, route, hoặc model nào liên quan đến module Tickets (ticket/support/issue/conversation/message/chat) trong backend folder `server-vpc`.
- Đã kiểm tra toàn bộ các file controllers, routes, models, và thử các từ khóa liên quan nhưng không có kết quả phù hợp.
---

### Phân tích đối chiếu API backend với UI Dashboard (index.vue)

**1. Tổng quan UI Dashboard:**
- Hiển thị các số liệu: Total Customers, Active Tickets, Services, Satisfaction.
- Hiển thị danh sách Recent Tickets.
- Quick Actions: chuyển trang Customers, Tickets, Services, Reports.
- Hiển thị thông tin cấu hình API.

**2. Đối chiếu với API backend:**
- **Total Customers:**
  - Backend đã có API `/customers` (GET) trả về danh sách và trường `pagination.total` cho tổng số lượng khách hàng.
  - Có API `/customers/statistics` để lấy thống kê nâng cao.
- **Active Tickets:**
  - Backend chưa có module Tickets, cần bổ sung controller, route, model cho tickets để đáp ứng UI.
- **Services:**
  - Backend đã có API `/services` (GET) trả về danh sách dịch vụ, có thể bổ sung trường tổng số dịch vụ nếu cần.
- **Satisfaction:**
  - Backend có API `/feedbacks/statistics` để lấy phần trăm hài lòng (satisfaction).
- **Recent Tickets:**
  - Backend chưa có module Tickets, cần bổ sung API hỗ trợ query sort/limit để lấy ticket mới nhất cho dashboard.

**3. Đề xuất chỉnh sửa/bổ sung:**
- Bổ sung module Tickets cho backend (controller, route, model) để đáp ứng các chức năng liên quan đến ticket trên dashboard.
- Đảm bảo các API thống kê trả về đúng trường dữ liệu tổng hợp (count, phần trăm, trạng thái).
- Bổ sung/kiểm tra query params `sort`/`limit` cho API GET danh sách (ví dụ: `/tickets?sort=desc&limit=5`).
- Nên tạo 1 API riêng láy các thông tin cho phần Card để tránh gọi 1 lần nhiều API
