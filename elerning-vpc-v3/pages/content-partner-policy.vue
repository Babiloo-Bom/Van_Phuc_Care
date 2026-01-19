<template>
  <div class="content-partner-policy-page">
    <!-- Hero Section -->
    <CommonPolicyHeader
      title="Chính Sách Dành Cho Đối Tác Nội Dung"
      description="Chính sách này quy định các nguyên tắc bắt buộc dành cho các Đối tác (Giảng viên, Bác sĩ, Điều dưỡng, Chuyên gia y tế, Cộng tác viên) khi đăng tải hoặc đăng duyệt nội dung chuyên môn trên hệ thống của chúng tôi."
    />

    <!-- Main Content -->
    <section class="main-content">
      <div class="container mx-auto px-3 md:px-4 lg:px-6 py-8 md:py-12 lg:py-16">
        <div class="content-wrapper">
          <!-- Section 1: Copyright -->
          <div class="policy-section">
            <h2 class="section-title">1. Nguyên tắc về Bản quyền (Copyright)</h2>
            <p class="section-description">
              Bạn cam kết chỉ đăng tải, xuất bản các nội dung thuộc một trong các nhóm sau:
            </p>
            <ul class="policy-list">
              <li>
                <strong>Nội dung nguyên gốc:</strong> Do chính bạn sáng tạo, nghiên cứu, viết, biên soạn hoặc sản xuất.
              </li>
              <li>
                <strong>Nội dung được ủy quyền:</strong> Bạn có quyền sở hữu hợp pháp hoặc được cấp phép bằng văn bản để
                đăng tải, tái xuất bản (có hoặc không có chỉnh sửa).
              </li>
              <li>
                <strong>Nội dung miễn phí/Công cộng:</strong> Nội dung thuộc phạm vi công cộng (public domain) hoặc cho
                phép chia sẻ (Creative Commons) với sự đồng ý của tác giả và tuân thủ quy tắc dẫn nguồn.
              </li>
            </ul>
          </div>

          <!-- Section 2: Citation Rules -->
          <div class="policy-section">
            <h2 class="section-title">2. Quy tắc Trích dẫn và Dẫn nguồn</h2>
            <p class="section-description">
              Khi sử dụng thông tin từ bên thứ ba để minh họa, phân tích hoặc bổ trợ cho quan điểm trong bài giảng/bài
              viết:
            </p>
            <ul class="policy-list">
              <li>
                <strong>Luôn ghi rõ nguồn:</strong> Bạn phải dẫn nguồn gốc (tên tác giả, tên sách, tạp chí y khoa, link
                bài viết gốc...) cho các hình ảnh, số liệu, đoạn trích dẫn.
              </li>
              <li>
                <strong>Tôn trọng sự thật:</strong> Không cắt ghép, chỉnh sửa làm sai lệch ý nghĩa khoa học của nội dung
                gốc.
              </li>
            </ul>
          </div>

          <!-- Section 3: Confidentiality -->
          <div class="policy-section">
            <h2 class="section-title">3. Quy tắc về Dữ liệu và Bảo mật thông tin</h2>
            <p class="section-description">
              Trong lĩnh vực Y tế và Chăm sóc sức khỏe, việc sử dụng các ví dụ lâm sàng hoặc tình huống thực tế là cần
              thiết để giảng dạy. Tuy nhiên, bạn cần tuân thủ nguyên tắc bảo vệ quyền riêng tư của bệnh nhân hoặc đối
              tượng trong ví dụ giảng dạy.
            </p>
          </div>

          <!-- Section 4: Prohibited Content -->
          <div class="policy-section">
            <h2 class="section-title">4. Nội dung Nghiêm cấm</h2>
            <p class="section-description">Bạn không được phép đăng tải, phát tán các nội dung sau:</p>
            <ul class="policy-list">
              <li>
                <strong>Nội dung sao chép, đạo văn mà không có sự cho phép của tác giả.</strong>
              </li>
              <li>
                Thông tin y khoa sai lệch, chưa được kiểm chứng, các phương pháp chữa bệnh phản khoa học, mê tín dị đoan
                gây hại cho sức khỏe cộng đồng.
              </li>
              <li>Nội dung xúc phạm, bôi nhọ danh dự, nhân phẩm của cá nhân/tổ chức y tế khác.</li>
              <li>Nội dung đồi trụy, vi phạm thuần phong mỹ tục hoặc vi phạm pháp luật Việt Nam.</li>
            </ul>
          </div>

          <!-- Section 5: Penalties -->
          <div class="policy-section">
            <h2 class="section-title">5. Chế tài xử lý</h2>
            <p class="section-description">
              Nội dung được phân phối tại hệ thống khoá học của Vạn Phúc Care là nội dung đã qua kiểm duyệt. Trong
              trường hợp chúng tôi phát hiện bất kỳ dấu hiệu vi phạm nào từ phía đối tác nội dung (bao gồm cả những nội
              dung đã từng được duyệt). Vạn Phúc Care có quyền:
            </p>
            <ul class="policy-list">
              <li><strong>Gỡ bỏ ngay lập tức</strong> các nội dung bị phát hiện vi phạm mà không cần báo trước.</li>
              <li>
                <strong>Tạm ngưng</strong> hoặc <strong>chấm dứt hợp tác vĩnh viễn</strong> đối với các Đối tác vi phạm
                chính sách Bản quyền và Nội dung này.
              </li>
              <li>
                Yêu cầu Đối tác chịu trách nhiệm bồi thường nếu vi phạm gây ra thiệt hại pháp lý cho Vạn Phúc Care.
              </li>
            </ul>
          </div>

          <!-- Related Policies Box -->
          <CommonRelatedPolicies exclude-path="/content-partner-policy" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta tags
useHead({
  title: "Chính Sách Dành Cho Đối Tác Nội Dung",
  meta: [
    {
      name: "description",
      content:
        "Chính sách dành cho đối tác nội dung quy định các nguyên tắc bắt buộc dành cho các Đối tác (Giảng viên, Bác sĩ, Điều dưỡng, Chuyên gia y tế, Cộng tác viên) khi đăng tải hoặc đăng duyệt nội dung chuyên môn trên hệ thống khóa học, đào tạo trực tuyến của chúng tôi.",
    },
    {
      name: "keywords",
      content:
        "Khóa học trực tuyến, Vạn Phúc Care, Chính Sách Dành Cho Đối Tác Nội Dung",
    },
    {
      property: "og:title",
      content: "Chính Sách Dành Cho Đối Tác Nội Dung",
    },
    {
      property: "og:description",
      content:
        "Chính sách dành cho đối tác nội dung quy định các nguyên tắc bắt buộc dành cho các Đối tác (Giảng viên, Bác sĩ, Điều dưỡng, Chuyên gia y tế, Cộng tác viên) khi đăng tải hoặc đăng duyệt nội dung chuyên môn trên hệ thống khóa học, đào tạo trực tuyến của chúng tôi.",
    },
  ],
});
</script>

<style scoped>
.content-partner-policy-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Main Content */
.main-content {
  background-color: #ffffff;
}

/* Policy Sections */
.policy-section {
  margin-bottom: 2rem;
}

.policy-section:last-of-type {
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

.policy-list {
  list-style: disc;
  padding: 0;
  margin: 0;
  padding-left: 6px;
  list-style-position: inside;
}

.policy-list li {
  font-size: 1rem;
  line-height: 1.44;
  color: #000;
  position: relative;
}

.policy-list strong {
  color: #000;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .section-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .policy-list li {
    font-size: 1rem;
    padding-left: 1.25rem;
  }

  .policy-section {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.125rem;
  }

  .section-description,
  .policy-list li {
    font-size: 1rem;
  }
}
</style>
