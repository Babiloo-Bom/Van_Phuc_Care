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
      domain: {
        default: '',
        type: String,
        require: true,
      },
      status: {
        default: 'inverified',
        type: String,
      },
      timeline: [],
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
      },
      points: {
        type: Number,
        default: 0,
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
      gender: {
        type: String,
        default: 'male',
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
    this.schema.index({ domain: 1, email: 1, firstname: 1, lastname: 1 });
    if (!mongoose.models[Customers.COLLECTION_NAME]) {
      mongoose.model(Customers.COLLECTION_NAME, this.schema, Customers.COLLECTION_NAME);
    }
    this.model = mongoose.model(Customers.COLLECTION_NAME);
  }

  public async createLog (customerId: String, message: String) {
    try {
      await this.model.findByIdAndUpdate(
        customerId,
        {
          $push: {
            timeline: {
              content: message,
              createdAt: new Date(),
            },
          },
        },
        { new: true },
      );
      return true;
    } catch {
      return false;
    }
  }

  public async clearCustomerCache (cache: { keys: () => any; del: (arg0: any) => void; }, domain: String) {
    const allKeys = cache.keys();
    allKeys.forEach((key: string) => {
      if (key.startsWith(`customers_${domain}`)) {
        cache.del(key); // Delete matching cache key
      }
    });
  }
}

export default new Customers();
