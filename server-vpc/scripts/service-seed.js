const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const API_URL = ""; //Backend URL here
const services = [
  {
    origin: "vanphuc-care",
    title: "Dịch vụ khám tổng quát",
    thumbnail: "https://via.placeholder.com/150",
    descriptions: "Khám sức khỏe tổng quát cho mọi lứa tuổi.",
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
    link: "https://vanphuccare.vn/kham-tong-quat",
  },
  {
    origin: "vanphuc-care",
    title: "Dịch vụ tiêm chủng",
    thumbnail: "https://via.placeholder.com/150",
    descriptions: "Tiêm chủng phòng bệnh cho trẻ em và người lớn.",
    shortDescriptions: "Tiêm chủng",
    usageTimeUnit: "lần",
    implementer: {
      fullname: "Bác sĩ Trần Thị B",
      avatar: "https://via.placeholder.com/100",
      position: "Bác sĩ tiêm chủng",
    },
    slug: "tiem-chung",
    reviews: 5,
    status: "active",
    link: "https://vanphuccare.vn/tiem-chung",
  },
  {
    origin: "vanphuc-care",
    title: "Dịch vụ xét nghiệm máu",
    thumbnail: "https://via.placeholder.com/150",
    descriptions: "Xét nghiệm máu định kỳ, kiểm tra sức khỏe.",
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
    link: "https://vanphuccare.vn/xet-nghiem-mau",
  },
  {
    origin: "vanphuc-care",
    title: "Dịch vụ tư vấn sức khỏe",
    thumbnail: "https://via.placeholder.com/150",
    descriptions: "Tư vấn sức khỏe trực tuyến với chuyên gia.",
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
    link: "https://vanphuccare.vn/tu-van-suc-khoe",
  },
  {
    origin: "vanphuc-care",
    title: "Dịch vụ khám chuyên khoa",
    thumbnail: "https://via.placeholder.com/150",
    descriptions: "Khám chuyên khoa theo yêu cầu.",
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
    link: "https://vanphuccare.vn/kham-chuyen-khoa",
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
