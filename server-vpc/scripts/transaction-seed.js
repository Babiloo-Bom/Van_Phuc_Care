const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const transactions = [
  {
    origin: "vanphuc-care",
    userId: "6933d2f257dc3bda3dda65fa",
    type: "payment",
    title: "Thanh toán dịch vụ khám",
    total: 500000,
    status: "success",
  },
  {
    origin: "vanphuc-care",
    userId: "6933d2f257dc3bda3dda65fa",
    type: "refund",
    title: "Hoàn tiền dịch vụ tiêm chủng",
    total: 200000,
    status: "pending",
  },
  {
    origin: "vanphuc-care",
    userId: "6933d2f257dc3bda3dda65fa",
    type: "payment",
    title: "Thanh toán dịch vụ xét nghiệm",
    total: 350000,
    status: "success",
  },
  {
    origin: "vanphuc-care",
    userId: "6933d2f257dc3bda3dda65fa",
    type: "payment",
    title: "Thanh toán dịch vụ tư vấn",
    total: 150000,
    status: "denied",
  },
  {
    origin: "vanphuc-care",
    userId: "6933d2f257dc3bda3dda65fa",
    type: "refund",
    title: "Hoàn tiền dịch vụ khám",
    total: 100000,
    status: "success",
  },
];

fetch('http://103.216.119.104:3000/api/a/seed/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transactions })
})
  .then(res => res.json())
  .then(data => {
    console.log('Seeded transactions:', data);
  })
  .catch(err => {
    console.error('Error seeding transactions:', err);
  });
