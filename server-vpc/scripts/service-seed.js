const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const API_URL = ""; //Backend URL here
const services = [
  {
    origin: "vanphuc-care",
    title: "Bảo mẫu tại nhà",
    thumbnail: "/images/service/thumbnail-1.png",
    descriptions: "Chăm sóc bé tại nhà là nỗi ám ảnh của nhiều mẹ sau sinh, nhất là sinh con lần đầu.",
    shortDescriptions: "Khám tổng quát",
    usageTimeUnit: "lần",
    implementer: {
      fullname: "Bác sĩ Nguyễn Văn A",
      avatar: "https://via.placeholder.com/100",
      position: "Bác sĩ chuyên khoa",
    },
    slug: "kham-tong-quat",
    reviews: 10,
    status: "active",
    link: "https://vanphuccare.vn/dich-vu/bao-mau-tai-nha",
  },
  {
    origin: "vanphuc-care",
    title: "Tư vấn EASY trực tiếp",
    thumbnail: "/images/service/thumbnail-2.png",
    descriptions: "Chăm sóc bé tại nhà là nỗi ám ảnh của nhiều mẹ sau sinh, nhất là sinh con lần đầu.",
    shortDescriptions: "Tiêm chủng",
    usageTimeUnit: "lần",
    implementer: {
      fullname: "Bác sĩ Trần Thị B",
      avatar: "https://vanphuccare.vn/dich-vu/bao-mau-tai-nha",
      position: "Bác sĩ tiêm chủng",
    },
    slug: "tiem-chung",
    reviews: 5,
    status: "active",
    link: "https://vanphuccare.vn/tiem-chung",
  },
  {
    origin: "vanphuc-care",
    title: "Tư vấn EASY trực tuyến",
    thumbnail: "/images/service/thumbnail-3.png",
    descriptions: "Chăm sóc bé tại nhà là nỗi ám ảnh của nhiều mẹ sau sinh, nhất là sinh con lần đầu.",
    shortDescriptions: "Xét nghiệm máu",
    usageTimeUnit: "lần",
    implementer: {
      fullname: "Bác sĩ Lê Văn C",
      avatar: "https://via.placeholder.com/100",
      position: "Bác sĩ xét nghiệm",
    },
    slug: "xet-nghiem-mau",
    reviews: 8,
    status: "inactive",
    link: "https://vanphuccare.vn/dich-vu/dich-vu-tu-van-nuoi-con-easy-truc-tuyen",
  },
  {
    origin: "vanphuc-care",
    title: "Tắm trẻ sơ sinh",
    thumbnail: "/images/service/thumbnail-4.png",
    descriptions: "Chăm sóc bé tại nhà là nỗi ám ảnh của nhiều mẹ sau sinh, nhất là sinh con lần đầu.",
    shortDescriptions: "Tư vấn sức khỏe",
    usageTimeUnit: "giờ",
    implementer: {
      fullname: "Bác sĩ Phạm Thị D",
      avatar: "https://via.placeholder.com/100",
      position: "Chuyên gia tư vấn",
    },
    slug: "tu-van-suc-khoe",
    reviews: 12,
    status: "active",
    link: "https://vanphuccare.vn/dich-vu/tam-tre-so-sinh",
  },
  {
    origin: "vanphuc-care",
    title: "Thông tắc tia sữa",
    thumbnail: "/images/service/thumbnail-5.png",
    descriptions: "Chăm sóc bé tại nhà là nỗi ám ảnh của nhiều mẹ sau sinh, nhất là sinh con lần đầu.",
    shortDescriptions: "Khám chuyên khoa",
    usageTimeUnit: "lần",
    implementer: {
      fullname: "Bác sĩ Đỗ Văn E",
      avatar: "https://via.placeholder.com/100",
      position: "Bác sĩ chuyên khoa",
    },
    slug: "kham-chuyen-khoa",
    reviews: 7,
    status: "active",
    link: "https://vanphuccare.vn/dich-vu/thong-tac-tia-sua",
  },
  {
    origin: "vanphuc-care",
    title: "Chăm sóc mẹ sau sinh",
    thumbnail: "/images/service/thumbnail-6.png",
    descriptions: "Chăm sóc bé tại nhà là nỗi ám ảnh của nhiều mẹ sau sinh, nhất là sinh con lần đầu.",
    shortDescriptions: "Khám chuyên khoa",
    usageTimeUnit: "lần",
    implementer: {
      fullname: "Bác sĩ Đỗ Văn E",
      avatar: "https://via.placeholder.com/100",
      position: "Bác sĩ chuyên khoa",
    },
    slug: "kham-chuyen-khoa",
    reviews: 7,
    status: "active",
    link: "https://vanphuccare.vn/dich-vu/cham-soc-me-sau-sinh",
  },
];

async function seedServices() {
  try {
    // Step 1: Delete all existing services
    console.log("Deleting all existing services...");
    const deleteRes = await fetch(`${API_URL}/api/a/seed/services`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const deleteData = await deleteRes.json();
    console.log("Delete result:", deleteData);

    // Step 2: Seed new services
    console.log("Seeding new services...");
    const seedRes = await fetch(`${API_URL}/api/a/seed/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });
    const seedData = await seedRes.json();
    console.log("Seeded services:", seedData);
  } catch (err) {
    console.error("Error:", err);
  }
}

seedServices();
