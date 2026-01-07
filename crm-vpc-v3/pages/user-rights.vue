<template>
  <div class="user-rights-page">
    <!-- Hero Section -->
    <CommonPolicyHeader
      title="Quyền Lợi & Quy Định Của Học Viên"
      description="Khi bạn lựa chọn trở thành học viên chính thức, Vạn Phúc Care cam kết hỗ trợ tối đa để bạn có trải nghiệm học tập tốt nhất, đồng thời chúng tôi cũng thiết lập những quy định cụ thể để đảm bảo sự công bằng và môi trường học tập văn minh cho tất cả mọi người."
    />

    <!-- Main Content -->
    <section class="main-content">
      <div class="container mx-auto px-3 md:px-4 lg:px-6 py-8 md:py-12 lg:py-16">
        <div class="content-wrapper">
          <!-- Section 1 -->
          <div class="rights-section">
            <h2 class="section-title">1. QUYỀN LỢI CỦA HỌC VIÊN</h2>
            <p class="section-description">
              Ngay sau khi kích hoạt khóa học thành công, Học viên sẽ được hưởng các đặc quyền sau:
            </p>
            <ul class="rights-list">
              <li>
                <strong>Sở hữu trọn đời:</strong> Bạn có quyền truy cập vào nội dung khóa học không giới hạn thời gian.
                Khóa học luôn sẵn sàng bất cứ khi nào bạn cần.
              </li>
              <li>
                <strong>Học tập linh hoạt:</strong> Bạn có thể học bất kỳ lúc nào, học đi học lại, tua nhanh hoặc chậm
                tùy theo tốc độ tiếp thu.
              </li>
              <li>
                <strong>Đa nền tảng:</strong> Hệ thống hỗ trợ học tập trên mọi thiết bị (Điện thoại, Máy tính bảng,
                Laptop, PC) có kết nối Internet.
              </li>
              <li>
                <strong>Tài liệu độc quyền:</strong> Được phép tải về không giới hạn các tài liệu bổ trợ (Checklist,
                thực đơn, tài liệu PDF...) để sử dụng cho mục đích học tập cá nhân.
              </li>
              <li>
                <strong>Hỗ trợ chuyên môn:</strong> Được quyền đặt câu hỏi tại khu vực thảo luận và nhận giải đáp từ đội
                ngũ chuyên môn/giảng viên của Vạn Phúc Care.
              </li>
              <li>
                <strong>Cập nhật miễn phí:</strong> Được thụ hưởng các nội dung cập nhật mới, các bài giảng bổ sung (nếu
                có) trong khóa học đã mua mà không phải đóng thêm phí.
              </li>
            </ul>
          </div>

          <!-- Section 2 -->
          <div class="rights-section">
            <h2 class="section-title">2. NGHĨA VỤ & QUY ĐỊNH CẦN LƯU Ý</h2>
            <p class="section-description">
              Đi đôi với Quyền lợi là trách nhiệm bảo vệ tài nguyên học tập. Học viên vui lòng tuân thủ các quy định
              sau:
            </p>
            <ul class="rights-list">
              <li>
                <strong>Tài khoản chính chủ:</strong> Học viên có nghĩa vụ bảo mật thông tin đăng nhập. Tài khoản học
                tập được cấp quyền sử dụng cho 01 cá nhân (hoặc bố và mẹ trong cùng một gia đình).
              </li>
              <li>
                <strong>Không chia sẻ tài khoản:</strong> Nghiêm cấm hành vi chia sẻ tài khoản (share account) cho người
                khác.
              </li>
              <li>
                <strong>Bảo vệ bản quyền:</strong> Tuyệt đối không tự ý sử dụng tài nguyên bài giảng để phát tán, chia
                sẻ lên mạng xã hội hoặc bán lại dưới mọi hình thức.
              </li>
            </ul>
          </div>

          <!-- Section 3 -->
          <div class="rights-section">
            <h2 class="section-title">3. CHẾ TÀI XỬ LÝ VI PHẠM</h2>
            <p class="section-description">
              Thuật toán của hệ thống website tự động quét hành vi sử dụng để bảo vệ bản quyền.
            </p>
            <ul class="rights-list">
              <li>
                <strong>Cảnh báo/Tạm khóa:</strong> Nếu hệ thống phát hiện tài khoản đăng nhập cùng lúc trên 02 thiết bị
                ở các vị trí địa lý khác nhau, hoặc có dấu hiệu bất thường, hệ thống sẽ tự động tạm khóa tài khoản.
              </li>
              <li>
                <strong>Khóa vĩnh viễn:</strong> Đối với các hành vi vi phạm nghiêm trọng (như chia sẻ công khai tài
                khoản, buôn bán lại khóa học, cố tình xâm phạm bản quyền nội dung), Vạn Phúc Care có quyền
                <strong>khóa tài khoản vĩnh viễn</strong> mà không cần báo trước và không hoàn tiền.
              </li>
            </ul>

            <p class="closing-text">
              Chúng tôi kêu gọi tinh thần
              <strong>Tự giác học tập – Tôn trọng bản quyền – Tôn trọng đội ngũ sáng tạo</strong> để cộng đồng Vạn Phúc
              Care ngày càng phát triển, mang lại giá trị sống cao đẹp hơn.
            </p>
          </div>

          <!-- Related Policies Box -->
          <CommonRelatedPolicies exclude-path="/user-rights" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: "default",
  title: "Quyền Lợi & Quy Định Của Học Viên - Van Phuc Care",
});

// SEO
useHead({
  title: "Quyền Lợi & Quy Định Của Học Viên - Van Phuc Care",
  meta: [
    {
      name: "description",
      content:
        "Quyền lợi và quy định của học viên tại Van Phuc Care. Tìm hiểu về các đặc quyền khi học tập và trách nhiệm cần tuân thủ để đảm bảo môi trường học tập hiệu quả.",
    },
    {
      property: "og:title",
      content: "Quyền Lợi & Quy Định Của Học Viên - Van Phuc Care",
    },
    {
      property: "og:description",
      content:
        "Quyền lợi và quy định của học viên tại Van Phuc Care. Tìm hiểu về các đặc quyền và trách nhiệm của học viên.",
    },
  ],
});
</script>

<style scoped>
/* Main Content */
.main-content {
  background: #f9fafb;
  min-height: 500px;
}

/* Rights Sections */
.rights-section {
  margin-bottom: 2rem;
}

.rights-section:last-of-type {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0;
  line-height: 1.44;
}

.section-description {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
  margin-bottom: 0;
}

/* Lists */
.rights-list {
  list-style: disc;
  padding: 0;
  margin: 0;
  padding-left: 6px;
  list-style-position: inside;
}

.rights-list > li {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
  position: relative;
}

.rights-list strong {
  color: #000;
  font-weight: 600;
}

/* Closing Text */
.closing-text {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
  margin-top: 1.5rem;
}

.related-link:hover::before {
  transform: translateX(4px);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .section-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  .section-description {
    font-size: 1rem;
  }

  .rights-list > li {
    font-size: 1rem;
    padding-left: 1.25rem;
  }

  .closing-text {
    font-size: 1rem;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1.125rem;
  }

  .section-description,
  .rights-list > li,
  .closing-text {
    font-size: 1rem;
    line-height: 1.7;
  }

  .rights-list > li {
    padding-left: 1rem;
    margin-bottom: 0.625rem;
  }

  .closing-text {
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .rights-section {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1rem;
  }

  .rights-list > li::before {
    font-size: 1rem;
  }
}
</style>
