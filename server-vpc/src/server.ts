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
const corsOptions = {
  origin: '*', // Thay bằng domain thực tế được phép
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
  credentials: true, // Cho phép gửi cookie trong CORS
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Xử lý preflight requests
app.use(strongParams());

app.get('/', (req, res) => {
  res.send('Hello World!')
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
