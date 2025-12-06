const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const services = [
  {
    origin: 'vanphuc-care',
    title: 'Dịch vụ khám tổng quát',
    thumbnail: 'https://via.placeholder.com/150',
    descriptions: 'Khám sức khỏe tổng quát cho mọi lứa tuổi.',
    shortDescriptions: 'Khám tổng quát',
    usageTimeUnit: 'lần',
    implementer: {
      fullname: 'Bác sĩ Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/100',
      position: 'Bác sĩ chuyên khoa',
    },
    slug: 'kham-tong-quat',
    reviews: 10,
    status: 'active',
  },
  {
    origin: 'vanphuc-care',
    title: 'Dịch vụ tiêm chủng',
    thumbnail: 'https://via.placeholder.com/150',
    descriptions: 'Tiêm chủng phòng bệnh cho trẻ em và người lớn.',
    shortDescriptions: 'Tiêm chủng',
    usageTimeUnit: 'lần',
    implementer: {
      fullname: 'Bác sĩ Trần Thị B',
      avatar: 'https://via.placeholder.com/100',
      position: 'Bác sĩ tiêm chủng',
    },
    slug: 'tiem-chung',
    reviews: 5,
    status: 'active',
  },
  {
    origin: 'vanphuc-care',
    title: 'Dịch vụ xét nghiệm máu',
    thumbnail: 'https://via.placeholder.com/150',
    descriptions: 'Xét nghiệm máu định kỳ, kiểm tra sức khỏe.',
    shortDescriptions: 'Xét nghiệm máu',
    usageTimeUnit: 'lần',
    implementer: {
      fullname: 'Bác sĩ Lê Văn C',
      avatar: 'https://via.placeholder.com/100',
      position: 'Bác sĩ xét nghiệm',
    },
    slug: 'xet-nghiem-mau',
    reviews: 8,
    status: 'inactive',
  },
  {
    origin: 'vanphuc-care',
    title: 'Dịch vụ tư vấn sức khỏe',
    thumbnail: 'https://via.placeholder.com/150',
    descriptions: 'Tư vấn sức khỏe trực tuyến với chuyên gia.',
    shortDescriptions: 'Tư vấn sức khỏe',
    usageTimeUnit: 'giờ',
    implementer: {
      fullname: 'Bác sĩ Phạm Thị D',
      avatar: 'https://via.placeholder.com/100',
      position: 'Chuyên gia tư vấn',
    },
    slug: 'tu-van-suc-khoe',
    reviews: 12,
    status: 'active',
  },
  {
    origin: 'vanphuc-care',
    title: 'Dịch vụ khám chuyên khoa',
    thumbnail: 'https://via.placeholder.com/150',
    descriptions: 'Khám chuyên khoa theo yêu cầu.',
    shortDescriptions: 'Khám chuyên khoa',
    usageTimeUnit: 'lần',
    implementer: {
      fullname: 'Bác sĩ Đỗ Văn E',
      avatar: 'https://via.placeholder.com/100',
      position: 'Bác sĩ chuyên khoa',
    },
    slug: 'kham-chuyen-khoa',
    reviews: 7,
    status: 'active',
  },
];

fetch('http://103.216.119.104:3000/api/a/seed/services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ services })
})
  .then(res => res.json())
  .then(data => {
    console.log('Seeded services:', data);
  })
  .catch(err => {
    console.error('Error seeding services:', err);
  });
