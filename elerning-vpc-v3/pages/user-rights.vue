<template>
  <div class="user-rights-page">
    <!-- Hero Section -->
    <CommonPolicyHeader
      title="Quyền Lợi & Quy Định Của Học Viên"
      description="Khi học tập trực tuyến tại Van Phuc Care, học viên không chỉ được trang bị kiến thức chuyên môn mà còn được bảo vệ các quyền lợi cơ bản để đảm mức chất lượng học tập, quy định rõ ràng về trách nhiệm và quy chế học viên, phải tuân thủ nhằm tạo lập một môi trường học tập văn minh và công bằng cho mọi người."
    />

    <!-- Main Content -->
    <section class="main-content">
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div class="content-wrapper">
          <!-- Section 1 -->
          <div class="rights-section">
            <h2 class="section-title">1. QUYỀN LỢI CỦA HỌC VIÊN</h2>
            <p class="section-description">
              Ngay sau khi kích hoạt tải khoản và hoàn tát thanh toán, học viên sẽ được hưởng các đặc quyền sau:
            </p>
            <ul class="rights-list">
              <li>
                <strong>Sở hữu trọn đời:</strong> Bạn có quyền truy cập vĩnh viễn nội dung khóa học không giới hạn thời gian. Khóa học luôn sẵn sàng bất cứ khi nào bạn cần.
              </li>
              <li>
                <strong>Học tập linh hoạt:</strong> Được tự do học bất kỳ thời điểm nào, không bị ràng buộc lịch học cứng, điều tốc độ tiếp thu.
              </li>
              <li>
                <strong>Đa nền tảng:</strong> Hệ thống hỗ trợ học tập trên mọi thiết bị (Điện thoại, Máy tính bảng, Laptop, PC) có kết nối Internet.
              </li>
              <li>
                <strong>Tải liệu học:</strong> Một số khóa học có hệ thống giải lương cấp tải liệu có tập ghi nhớ tốt. PDF...) để sử dụng cho mục dịch học tập cá nhân.
              </li>
              <li>
                <strong>Hỗ trợ chuyên môn:</strong> Được quyền đặt câu hỏi tới khu vực khóa ửạn và nhận giới đáp từ bỏ ngũ chuyên môn/giảng viên của Van Phuc Care.
              </li>
              <li>
                <strong>Cập nhật miễn phí:</strong> Được trụ hưởng các nội dung cấp nhật mới, các bài giảng bổ sung trực của trong khóa học đã mua mà không phải đóng thêm phí.
              </li>
            </ul>
          </div>

          <!-- Section 2 -->
          <div class="rights-section">
            <h2 class="section-title">2. NGHĨA VỤ & QUY ĐỊNH CẦN LƯU Ý</h2>
            <p class="section-description">
              Bị đổi với Quyền lợi trên, học viên của Van Phuc Care cũng phải chịu trách nghĩa học tập, học viên cần lưng luân thủ các quy định sau:
            </p>
            <ul class="rights-list">
              <li>
                <strong>Tài khoản chính chủ:</strong> Học viên có nghĩa vụ bảo mật thông tin đăng nhập. Tài khoản học tập được cấp quyền sử dụng cho 01 cá nhân (không bố và me 
                trong cùng một tải khoản).
              </li>
              <li>
                <strong>Không chia sẻ tài khoản:</strong> Nghiêm cấm hành vi chia sẻ đối tài khoản (share account) cho người khác.
              </li>
              <li>
                <strong>Bảo vệ bản quyền:</strong> Tuyệt đối không tự ý sử dụng tài nguyên bài giảng để phát tán, chia sẻ lên mạng xã hội hoặc bán lại cuộc mọi hình thức.
              </li>
            </ul>
          </div>

          <!-- Section 3 -->
          <div class="rights-section">
            <h2 class="section-title">3. CHẾ TÀI XỬ LÝ VI PHẠM</h2>
            <p class="section-description">
              Thuật toán của hệ thống website tự động quét theo mạng vì sử dụng để bảo vệ bản quyền.
            </p>
            <ul class="rights-list">
              <li>
                <strong>Cảnh báo:</strong> Nếu hệ thống phát hiện tài khoản đăng nhập cùng lúc trên 02 thiết bị 3 các vi trị địa lý khác nhau, hoặc có dấu hiệu bất 
                thường, hệ thống sẽ tự động tạm khóa tài khoản.
              </li>
              <li>
                <strong>Khóa vĩnh viễn:</strong> Trong trường hợp nghiêm trọng (như chia sẻ công khai tài khoản, buôn bán lại khóa học, có sinh xảnh phạm bản quyền nội 
                dung), Van Phuc Care có quyền <strong>khóa tải khoản vĩnh viễn</strong> mà không cần báo trước và không hoàn tiền.
              </li>
            </ul>

            <p class="closing-text">
              Chúng tôi kỳ vọng trên thiện lập quốc học tập – Tôn trọng bản quyền – Tôn trọng sở hạnh đồng tạo sử cùng đồng Van Phuc Care ngày càng phát triển, 
              mang lại giá trị sống còn đáp ứi hơn.
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
  layout: 'default',
  title: 'Quyền Lợi & Quy Định Của Học Viên - Van Phuc Care'
})

// SEO
useHead({
  title: 'Quyền Lợi & Quy Định Của Học Viên - Van Phuc Care',
  meta: [
    {
      name: 'description',
      content: 'Quyền lợi và quy định của học viên tại Van Phuc Care. Tìm hiểu về các đặc quyền khi học tập và trách nhiệm cần tuân thủ để đảm bảo môi trường học tập hiệu quả.'
    },
    {
      property: 'og:title',
      content: 'Quyền Lợi & Quy Định Của Học Viên - Van Phuc Care'
    },
    {
      property: 'og:description',
      content: 'Quyền lợi và quy định của học viên tại Van Phuc Care. Tìm hiểu về các đặc quyền và trách nhiệm của học viên.'
    }
  ]
})
</script>

<style scoped>
/* Main Content */
.main-content {
  background: #f9fafb;
  min-height: 500px;
}

.content-wrapper {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Rights Sections */
.rights-section {
  margin-bottom: 2.5rem;
}

.rights-section:last-of-type {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.section-description {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 1rem;
}

/* Lists */
.rights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rights-list > li {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.rights-list > li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2563eb;
  font-weight: bold;
  font-size: 1.2rem;
}

.rights-list strong {
  color: #1f2937;
  font-weight: 600;
}

/* Closing Text */
.closing-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}



.related-link:hover::before {
  transform: translateX(4px);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 2rem;
  }

  .section-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
    border-radius: 8px;
  }

  .section-title {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  .section-description {
    font-size: 0.95rem;
  }

  .rights-list > li {
    font-size: 0.95rem;
    padding-left: 1.25rem;
  }

  .closing-text {
    font-size: 0.95rem;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
  }
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 1.25rem;
  }

  .section-title {
    font-size: 1.125rem;
  }

  .section-description,
  .rights-list > li,
  .closing-text {
    font-size: 0.875rem;
    line-height: 1.7;
  }

  .rights-list > li {
    padding-left: 1rem;
    margin-bottom: 0.875rem;
  }

  .closing-text {
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .rights-section {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.05rem;
  }

  .rights-list > li::before {
    font-size: 1rem;
  }
}
</style>
