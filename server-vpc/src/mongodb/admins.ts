import mongoose, { Model, Schema } from 'mongoose';

class Admins {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'admins';
  public readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' };
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      fullname: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      code: {
        type: String,
      },
      email: {
        type: String,
        require: true,
      },
      phone: {
        type: String,
      },
      username: {
        type: String,
      },
      password: {
        type: String,
      },
      address: {
        type: String,
      },
      avatar: {
        type: String,
      },
      workAt: {
        type: String,
      },
      dob: {
        type: String,
      },
      verifyOtp: {
        type: String,
      },
      forgotPasswordToken: {
        type: String,
      },
      forgotPasswordExpireAt: {
        type: Date,
      },
      secret2fa: {
        ascii: {
          type: String,
        },
        hex: {
          type: String,
        },
        base32: {
          type: String,
        },
        otpauth_url: {
          type: String,
        },
      },
      gender: {
        type: String,
      },
      role: {
        type: String,
      },
      permissions: [],
      accessToken: {
        type: String,
      },
      verified: {
        type: String,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
      },
    },
    {
      strict: false,
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Admins.COLLECTION_NAME]) {
      mongoose.model(Admins.COLLECTION_NAME, this.schema, Admins.COLLECTION_NAME);
    }
    this.model = mongoose.model(Admins.COLLECTION_NAME);
  }

  public async generatePassword () {
    let code = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
    for (let i = 12; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    return code;
  }
}

export default new Admins();
