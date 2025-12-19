/* eslint-disable import/first */
require('module-alias/register');
// import '@services/grpc';
import '@initializers/mongoConnection';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import strongParams from '@middlewares/parameters';
import routesServer from '@configs/routesServer';
import Settings from '@configs/settings';
const https = require('https');

const port = process.env.PORT || 3000;
const app = express();
const options = {
  secureProtocol: 'TLSv1_2_method',
  ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
  honorCipherOrder: true,
};

app.use(express.json()); // Middleware để parse JSON
app.use(express.urlencoded({ extended: true })); // Middleware để parse form data

// Cấu hình CORS tường minh
const allowedOrigins = [
  "https://localhost:3101", // CRM dev
  "https://localhost:3100", // Admin dev
  "https://localhost:3102", // Elearning dev
  "https://localhost:3000", // API itself (for swagger, etc.)
  // Production domains
  "https://elearning.vanphuccare.com",
  "https://admin.vanphuccare.com",  // Thêm dòng này
  "httpss://crm.vanphuccare.com",    // Thêm dòng này
  // Nếu có IP trực tiếp
  "https://103.216.119.104:3100",   // Admin port
  "https://103.216.119.104:3101",   // CRM port
  "https://103.216.119.104:3102",   // Elearning port
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Trong production, chỉ allow các origins trong danh sách
    if (process.env.NODE_ENV === "production") {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn('⚠️ CORS blocked origin:', origin);
        callback(new Error("Not allowed by CORS"));
      }
    } else {
      // Development: allow tất cả
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Accept-Language", "Origin", "X-Requested-With"],
  credentials: true,
  maxAge: 86400, // 24 hours - cache preflight response
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Xử lý preflight requests
app.use(strongParams());

app.get('/', (req, res) => {
  res.send("Hello World");
})

app.use('/api', routesServer);

app.use((req, res) => {
  res.status(404).send({ status: false });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

//const server: any = https.createServer(options, app);

export default server;
