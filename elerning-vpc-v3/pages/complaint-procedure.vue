<template>
  <div class="complaint-procedure-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <h1 class="hero-title">Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại</h1>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main-content">
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div class="content-wrapper">
          <!-- Section 1 -->
          <div class="complaint-section">
            <h2 class="section-title">1. Nguyên tắc xử lý</h2>
            <ul class="complaint-list">
              <li>
                <strong>Minh bạch:</strong> Mọi khiếu nại đều được ghi nhận và xử lý công khai theo quy trình.
              </li>
              <li>
                <strong>Khách quan:</strong> Chúng tôi đáng nghệ tứ cá hai phía (Học viên và Đội liệu hệ thống/Bộ phận liên quan) để đưa ra quyết định công bằng nhất.
              </li>
              <li>
                <strong>Kịp thời:</strong> Cam kết phản hồi về xử lý trong thời gian sâm nhất có thể để không ảm giản đoạn việc học.
              </li>
            </ul>
          </div>

          <!-- Section 2 -->
          <div class="complaint-section">
            <h2 class="section-title">2. Các kênh tiếp nhận khiếu nại</h2>
            <p class="section-description">
              Học viên có thể gửi phản ánh, khiếu nại tới:
            </p>
            <ul class="complaint-list">
              <li>
                <strong>CÔNG TY TNHH VẠN PHÚC CARE</strong>
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:help@vanphuccare.vn" class="contact-link">help@vanphuccare.vn</a>
              </li>
              <li>
                <strong>Hotline:</strong> <a href="tel:0262326698" class="contact-link">(026) 6329 6698</a>
              </li>
            </ul>
          </div>

          <!-- Section 3 -->
          <div class="complaint-section">
            <h2 class="section-title">3. Quy trình tiếp nhận và giải quyết</h2>
            <div class="process-steps">
              <div class="process-step">
                <strong>Bước 1:</strong> Tiền hành kiểm tra sơ bộ và phân loại vấn đề (Lỗi kỹ thuật, Lỗi thanh toán, hay Vấn đề về nội dụng).
              </div>
              <div class="process-step">
                <strong>Bước 2:</strong> Đối chiếu thống tin phản ánh với cơ sở hệ thống.
              </div>
              <div class="process-step">
                <strong>Bước 3:</strong> Thân hối kết quả tới người dùng khiếu nại.
              </div>
              <div class="process-step">
                <strong>Bước 4:</strong> Kết thực và đóng khiếu nại.
              </div>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="complaint-section">
            <h2 class="section-title">4. Thời hạn giải quyết</h2>
            <ul class="complaint-list">
              <li>
                <strong>Thời gian phản hồi:</strong> Trong vòng <strong>02 ngày làm việc</strong> kể từ khi nhận được khiếu nại.
              </li>
              <li>
                <strong>Thời gian xử lý:</strong>
                <ul class="sub-list">
                  <li>Các vấn đề kỹ thuật đơn giản: Xử lý trong <strong>2đ ~ 48 giờ</strong>.</li>
                  <li>Các vấn đề phức tạo kiên quan đến ngân hàng, đối soắt: Tù <strong>3 ~ 7 ngày làm việc</strong>.</li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Section 5 -->
          <div class="complaint-section">
            <h2 class="section-title">5. Các trường hợp từ chối giải quyết khiếu nại</h2>
            <p class="section-description">
              Van Phuc Care tư chối hoặc ngừng hỗ trờ trong các trường hợp sau:
            </p>
            <ul class="complaint-list">
              <li>Học viên sử dụng ngôn từ xúc phạm, đe dọa, thiểu văn hóa khi thực hiện quyển khiếu nại.</li>
              <li>Khiếu nại không có căn cứ, không cung cấp được bằng chứng xác thực liên quan đến giao dịch.</li>
            </ul>
          </div>

          <!-- Related Policies Box -->
          <div class="related-policies">
            <h3 class="related-title">Điều khoản & Chính sách liên quan</h3>
            <ul class="related-list">
              <li>
                <NuxtLink to="/terms-of-service" class="related-link">
                  Điều khoản sử dụng
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/privacy-policy" class="related-link">
                  Chính sách bảo mật & quyền riêng tư
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/user-rights" class="related-link">
                  Quyền lợi & quy định của học viên
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/partner-policy" class="related-link">
                  Chính sách dành cho đối tác nội dung
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: 'default',
  title: 'Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại - Van Phuc Care'
})

// SEO
useHead({
  title: 'Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại - Van Phuc Care',
  meta: [
    {
      name: 'description',
      content: 'Quy trình tiếp nhận và giải quyết khiếu nại của học viên tại Van Phuc Care. Cam kết xử lý minh bạch, công bằng và kịp thời mọi phản ánh từ học viên.'
    },
    {
      property: 'og:title',
      content: 'Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại - Van Phuc Care'
    },
    {
      property: 'og:description',
      content: 'Quy trình tiếp nhận và giải quyết khiếu nại của học viên tại Van Phuc Care.'
    }
  ]
})
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  min-height: 240px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/pattern.svg');
  opacity: 0.05;
  pointer-events: none;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

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

/* Complaint Sections */
.complaint-section {
  margin-bottom: 2.5rem;
}

.complaint-section:last-of-type {
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
.complaint-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.complaint-list > li {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.complaint-list > li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2563eb;
  font-weight: bold;
  font-size: 1.2rem;
}

.complaint-list strong {
  color: #1f2937;
  font-weight: 600;
}

/* Sub List */
.sub-list {
  list-style: none;
  margin-top: 0.5rem;
  margin-left: 0;
  padding-left: 0;
}

.sub-list li {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 0.5rem;
  padding-left: 1.25rem;
  position: relative;
}

.sub-list li::before {
  content: '+';
  position: absolute;
  left: 0;
  color: #2563eb;
  font-weight: bold;
}

/* Process Steps */
.process-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.process-step {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border-left: 4px solid #2563eb;
  border-radius: 4px;
}

.process-step strong {
  color: #1f2937;
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

/* Related Policies Box */
.related-policies {
  background: #eff6ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
}

.related-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 1.25rem;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-list li {
  margin-bottom: 0.75rem;
}

.related-list li:last-child {
  margin-bottom: 0;
}

.related-link {
  color: #2563eb;
  font-size: 1rem;
  line-height: 1.6;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  position: relative;
  padding-left: 1.25rem;
}

.related-link::before {
  content: '→';
  position: absolute;
  left: 0;
  transition: transform 0.2s ease;
}

.related-link:hover {
  color: #1e40af;
  transform: translateX(4px);
}

.related-link:hover::before {
  transform: translateX(4px);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2rem;
  }

  .content-wrapper {
    padding: 2rem;
  }

  .section-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 220px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

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

  .complaint-list > li {
    font-size: 0.95rem;
    padding-left: 1.25rem;
  }

  .sub-list li {
    font-size: 0.95rem;
    padding-left: 1rem;
  }

  .process-step {
    font-size: 0.95rem;
    padding: 0.875rem 1rem;
  }

  .related-policies {
    padding: 1.5rem;
  }

  .related-title {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .related-link {
    font-size: 0.95rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 200px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .content-wrapper {
    padding: 1.25rem;
  }

  .section-title {
    font-size: 1.125rem;
  }

  .section-description,
  .complaint-list > li,
  .sub-list li,
  .process-step {
    font-size: 0.875rem;
    line-height: 1.7;
  }

  .complaint-list > li {
    padding-left: 1rem;
    margin-bottom: 0.875rem;
  }

  .sub-list li {
    padding-left: 0.875rem;
  }

  .process-step {
    padding: 0.75rem 0.875rem;
  }

  .related-policies {
    padding: 1.25rem;
  }

  .related-title {
    font-size: 1rem;
  }

  .related-link {
    font-size: 0.875rem;
    padding-left: 1rem;
  }

  .complaint-section {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.35rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.05rem;
  }

  .complaint-list > li::before {
    font-size: 1rem;
  }

  .process-step {
    border-left-width: 3px;
  }
}
</style>
