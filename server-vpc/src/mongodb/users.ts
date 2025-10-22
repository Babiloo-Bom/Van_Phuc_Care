import mongoose, { Model, Schema } from 'mongoose';

class Users {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'users';
  public readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive', PENDING: 'pending' };
  public readonly CREATABLE_PARAMETERS = ['fullname', 'email', 'phoneNumber', 'password', 'avatar', 'gender',
    { address: [{ province: ['id', 'name'] }, { district: ['id', 'name'] }, { ward: ['id', 'name'] }, 'addressDetail'] }]

  public readonly UPDATABLE_PARAMETERS = ['fullname', 'email', 'phoneNumber', 'avatar', 'gender',
    { address: [{ province: ['id', 'name'] }, { district: ['id', 'name'] }, { ward: ['id', 'name'] }, 'addressDetail'] }]

  public readonly ADMIN_UPDATABLE_PARAMETERS = ['fullname', 'email', 'phoneNumber', 'avatar', 'gender', 'password', 'status',
    { address: [{ province: ['id', 'name'] }, { district: ['id', 'name'] }, { ward: ['id', 'name'] }, 'addressDetail'] }]

  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      fullname: {
        type: String,
      },
      email: {
        type: String,
        unique: [true, 'email đã tồn tại'],
      },
      phoneNumber: {
        type: String,
        require: true,
      },
      // username: {
      //   type: String,
      //   unique: [true, 'username đã tồn tại'],
      // },
      password: {
        type: String,
      },
      address: {
        province: {
          id: { type: String },
          name: { type: String },
        },
        district: {
          id: { type: String },
          name: { type: String },
        },
        ward: {
          id: { type: String },
          name: { type: String },
        },
        addressDetail: { type: String },
      },
      avatar: {
        type: String,
      },
      forgotPasswordToken: {
        type: String,
      },
      forgotPasswordExpireAt: {
        type: Date,
      },
      gender: {
        type: String,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive', 'pending'],
      },
      verifyOtp: {
        type: String,
        default: null,
      },
      type: {
        type: String,
        default: 'normal',
        enum: ['normal', 'vip'],
      },
      postNumber: {
        type: String,
      },
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Users.COLLECTION_NAME]) {
      mongoose.model(Users.COLLECTION_NAME, this.schema, Users.COLLECTION_NAME);
    }
    this.model = mongoose.model(Users.COLLECTION_NAME);
  }
}

export default new Users();
