import mongoose, { Model, Schema } from 'mongoose';

class Customers {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'customers';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      status: {
        default: 'inverified',
        type: String,
      },
      email: {
        type: String,
      },
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      accepts_email_marketing: {
        type: String,
      },
      accepts_sms_marketing: {
        type: String,
      },
      company: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      province: {
        type: String,
      },
      province_code: {
        type: String,
      },
      country: {
        type: String,
      },
      country_code: {
        type: String,
      },
      zip: {
        type: String,
      },
      total_order: {
        type: Number,
        default: 0,
      },
      total_spent: {
        type: Number,
        default: 0,
      },
      tags: [],
      note: {
        type: String,
      },
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Customers.COLLECTION_NAME]) {
      mongoose.model(Customers.COLLECTION_NAME, this.schema, Customers.COLLECTION_NAME);
    }
    this.model = mongoose.model(Customers.COLLECTION_NAME);
  }
}

export default new Customers();
