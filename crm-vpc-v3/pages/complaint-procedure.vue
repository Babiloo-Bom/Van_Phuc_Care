<template>
  <div class="complaint-procedure-page">
    <!-- Hero Section -->
    <CommonPolicyHeader title="Quy Trình Tiếp Nhận & <br />Giải Quyết Khiếu Nại" />

    <!-- Main Content -->
    <section class="main-content">
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div class="content-wrapper">
          <!-- Section 1 -->
          <div class="complaint-section">
            <h2 class="section-title">1. Nguyên tắc xử lý</h2>
            <ul class="complaint-list">
              <li><strong>Minh bạch:</strong> Mọi khiếu nại đều được ghi nhận và xử lý công khai theo quy trình.</li>
              <li>
                <strong>Khách quan:</strong> Chúng tôi lắng nghe từ cả hai phía (Học viên và Dữ liệu hệ thống/Bộ phận
                liên quan) để đưa ra quyết định công bằng nhất.
              </li>
              <li>
                <strong>Kịp thời:</strong> Cam kết phản hồi và xử lý trong thời gian sớm nhất có thể để không làm gián
                đoạn việc học.
              </li>
            </ul>
          </div>

          <!-- Section 2 -->
          <div class="complaint-section">
            <h2 class="section-title">2. Các kênh tiếp nhận khiếu nại</h2>
            <p class="section-description">Học viên có thể gửi phản ánh, khiếu nại tới:</p>
            <ul class="complaint-list">
              <li>
                <strong>CÔNG TY TNHH VẠN PHÚC CARE</strong>
              </li>
              <li>
                <strong>Email:</strong>
                <a href="mailto:help@vanphuccare.vn" class="contact-link">help@vanphuccare.vn</a>
              </li>
              <li><strong>Hotline:</strong> <a href="tel:02463296698" class="contact-link">(024) 6329 6698</a></li>
            </ul>
          </div>

          <!-- Section 3 -->
          <div class="complaint-section">
            <h2 class="section-title">3. Quy trình tiếp nhận và giải quyết</h2>
            <div class="process-steps">
              <div class="process-step">
                <strong>Bước 1:</strong> Tiến hành kiểm tra sơ bộ và phân loại vấn đề (Lỗi kỹ thuật, Lỗi thanh toán, hay
                Vấn đề về nội dung).
              </div>
              <div class="process-step">
                <strong>Bước 2:</strong> Đối chiếu thông tin phản ánh với dữ liệu hệ thống.
              </div>
              <div class="process-step"><strong>Bước 3:</strong> Phản hồi kết quả tới người dùng khiếu nại.</div>
              <div class="process-step"><strong>Bước 4:</strong> Kết thúc và đóng khiếu nại.</div>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="complaint-section">
            <h2 class="section-title">4. Thời hạn giải quyết</h2>
            <ul class="complaint-list">
              <li><strong>Thời gian phản hồi:</strong> Trong vòng 02 ngày làm việc kể từ khi nhận được khiếu nại.</li>
              <li>
                <strong>Thời gian xử lý:</strong>
                <ul class="sub-list">
                  <li>Các vấn đề kỹ thuật đơn giản: Xử lý trong <strong>24 - 48 giờ</strong>.</li>
                  <li>
                    Các vấn đề phức tạp (liên quan đến ngân hàng, đối soát): Từ <strong>3 - 7 ngày làm việc</strong>.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Section 5 -->
          <div class="complaint-section">
            <h2 class="section-title">5. Các trường hợp từ chối giải quyết khiếu nại</h2>
            <p class="section-description">Vạn Phúc Care từ chối hoặc ngừng hỗ trợ trong các trường hợp sau:</p>
            <ul class="complaint-list">
              <li>Học viên sử dụng ngôn từ xúc phạm, đe dọa, thiếu văn hóa khi thực hiện quyền khiếu nại.</li>
              <li>Khiếu nại không có căn cứ, không cung cấp được bằng chứng xác thực liên quan đến giao dịch.</li>
            </ul>
          </div>

          <!-- Related Policies Box -->
          <CommonRelatedPolicies exclude-path="/complaint-procedure" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: "default",
  title: "Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại - Van Phuc Care",
});

// SEO
useHead({
  title: "Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại - Van Phuc Care",
  meta: [
    {
      name: "description",
      content:
        "Quy trình tiếp nhận và giải quyết khiếu nại của học viên tại Van Phuc Care. Cam kết xử lý minh bạch, công bằng và kịp thời mọi phản ánh từ học viên.",
    },
    {
      property: "og:title",
      content: "Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại - Van Phuc Care",
    },
    {
      property: "og:description",
      content: "Quy trình tiếp nhận và giải quyết khiếu nại của học viên tại Van Phuc Care.",
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

/* Complaint Sections */
.complaint-section {
  margin-bottom: 2rem;
}

.complaint-section:last-of-type {
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
.complaint-list {
  list-style: disc;
  padding: 0;
  margin: 0;
  padding-left: 6px;
  list-style-position: inside;
}

.complaint-list > li {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
  position: relative;
}

.complaint-list strong {
  color: #000;
  font-weight: 600;
}

/* Sub List */
.sub-list {
  list-style: none;
  padding-left: 12px;
}

.sub-list li {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
  padding-left: 1.25rem;
  position: relative;
}

.sub-list li::before {
  content: "+";
  position: absolute;
  left: 0;
  color: #000;
  font-weight: bold;
}

/* Process Steps */
.process-steps {
  display: flex;
  flex-direction: column;
}

.process-step {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
}

.process-step strong {
  color: #000;
  font-weight: 600;
}

/* Contact Links */
.contact-link {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #1e40af;
  text-decoration: underline;
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

  .complaint-list > li {
    font-size: 1rem;
    padding-left: 1.25rem;
  }

  .sub-list li {
    font-size: 1rem;
    padding-left: 1rem;
  }

  .process-step {
    font-size: 1rem;
    padding: 0.875rem 1rem;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1.125rem;
  }

  .section-description,
  .complaint-list > li,
  .sub-list li,
  .process-step {
    font-size: 1rem;
    line-height: 1.7;
  }

  .complaint-list > li {
    padding-left: 1rem;
    margin-bottom: 0.625rem;
  }

  .sub-list li {
    padding-left: 0.875rem;
  }

  .process-step {
    padding: 0.75rem 0.875rem;
  }

  .complaint-section {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1rem;
  }

  .complaint-list > li::before {
    font-size: 1rem;
  }

  .process-step {
    border-left-width: 3px;
  }
}
</style>
