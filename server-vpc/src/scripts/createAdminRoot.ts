import MongoDbAdmins from '../mongodb/admins';
import '../initializers/mongoConnection';
const bcrypt = require('bcryptjs');

const execute = async () => {
  const salt = bcrypt.genSaltSync();
  const password = bcrypt.hashSync('admin001', salt);
  await MongoDbAdmins.model.create({
    id: undefined,
    fullname: 'Admin001',
    username: 'admin001',
    email: 'admin001@gmail.com',
    password: password,
    address: 'Ha Noi',
    avatar: null,
    forgotPasswordToken: null,
    forgotPasswordExpireAt: null,
    gender: 'male',
    status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
    domain: 'admin001@gmail.com',
  });
  process.kill(process.pid);
};

execute();
