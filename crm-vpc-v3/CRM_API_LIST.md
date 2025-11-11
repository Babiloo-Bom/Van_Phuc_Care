# Danh sách tất cả các API của module CRM

---

## Customers
- `GET /api/a/customers` — Lấy danh sách khách hàng
- `GET /api/a/customers/{id}` — Lấy chi tiết khách hàng
- `POST /api/a/customers` — Tạo mới khách hàng
- `PATCH /api/a/customers/{id}` — Cập nhật thông tin khách hàng
- `DELETE /api/a/customers/{id}` — Xóa khách hàng
- `POST /api/a/customers/deleteMany` — Xóa nhiều khách hàng
- `UPLOAD /api/a/customers/import` — Import khách hàng từ file
- `GET /api/a/customers/export` — Export khách hàng ra file Excel
`GET /api/a/customers/statistics` — Thống kê khách hàng


## Services

- `GET /api/a/services` — Lấy danh sách dịch vụ
- `GET /api/a/services/{id}` — Lấy chi tiết dịch vụ
- `POST /api/a/services` — Tạo mới dịch vụ
- `PATCH /api/a/services/{id}` — Cập nhật dịch vụ
- `DELETE /api/a/services/{id}` — Xóa dịch vụ
- `GET /api/a/services/statistics` — Thống kê dịch vụ

---

## Orders
- `GET /api/a/orders` — Lấy danh sách đơn hàng
- `GET /api/a/orders/{id}` — Lấy chi tiết đơn hàng
- `POST /api/a/orders` — Tạo mới đơn hàng
- `PATCH /api/a/orders/{id}` — Cập nhật đơn hàng
- `PATCH /api/a/orders/{id}/status` — Cập nhật trạng thái đơn hàng
- `PATCH /api/a/orders/{id}/payment-status` — Cập nhật trạng thái thanh toán
- `POST /api/a/orders/{id}/cancel` — Hủy đơn hàng
- `GET /api/a/orders/statistics` — Thống kê đơn hàng
- `GET /api/a/orders/export` — Export đơn hàng

---

## Products
- `GET /api/a/products` — Lấy danh sách sản phẩm
- `GET /api/a/products/{id}` — Lấy chi tiết sản phẩm
- `POST /api/a/products` — Tạo mới sản phẩm
- `PATCH /api/a/products/{id}` — Cập nhật sản phẩm
- `DELETE /api/a/products/{id}` — Xóa sản phẩm
- `GET /api/a/categories` — Lấy danh sách danh mục
- `POST /api/a/categories` — Tạo mới danh mục
- `PATCH /api/a/categories/{id}` — Cập nhật danh mục
- `DELETE /api/a/categories/{id}` — Xóa danh mục

---

## Transactions
- `GET /api/a/transactions` — Lấy danh sách giao dịch
- `GET /api/a/transactions/{id}` — Lấy chi tiết giao dịch
- `POST /api/a/transactions` — Tạo mới giao dịch
- `PATCH /api/a/transactions/{id}` — Cập nhật giao dịch
- `DELETE /api/a/transactions/{id}` — Xóa giao dịch
- `GET /api/a/transactions/statistics` — Thống kê giao dịch

---

## Feedbacks
- `GET /api/a/feedbacks` — Lấy danh sách phản hồi
- `GET /api/a/feedbacks/{id}` — Lấy chi tiết phản hồi
- `POST /api/a/feedbacks` — Tạo mới phản hồi
- `PATCH /api/a/feedbacks/{id}` — Cập nhật phản hồi
- `PATCH /api/a/feedbacks/{id}/active` — Kích hoạt phản hồi
- `PATCH /api/a/feedbacks/{id}/inactive` — Vô hiệu hóa phản hồi
- `DELETE /api/a/feedbacks/{id}` — Xóa phản hồi
- `GET /api/a/feedbacks/statistics` — Thống kê phản hồi

---

## FAQs
- `GET /api/a/faqs` — Lấy danh sách câu hỏi thường gặp
- `GET /api/a/faqs/{id}` — Lấy chi tiết câu hỏi
- `POST /api/a/faqs` — Tạo mới câu hỏi
- `PATCH /api/a/faqs/{id}` — Cập nhật câu hỏi
- `DELETE /api/a/faqs/{id}` — Xóa câu hỏi

---

## Uploads
- `UPLOAD /api/uploads` — Upload file
- `UPLOAD /api/uploaders/image` — Upload ảnh
- `UPLOAD /api/uploaders/video` — Upload video
- `POST /api/uploads/delete` — Xóa file

---

**Tổng hợp các API của module CRM.**
