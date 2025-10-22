import mongoose, { Model, Schema } from 'mongoose';

class Carts {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'carts';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      customer: {
        _id: {
          type: String,
        },
        fullname: {
          type: String,
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        address: {
          type: String,
        },
        note: {
          type: String,
        },
      },
      status: {
        type: String,
        default: 'active',
      },
      discount: {
        type: String,
      },
      archived: {
        status: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
      },
      notes: {
        type: String,
      },
      paymentMethod: {
        type: String,
      },
      transport: {
        name: {
          type: String,
        },
        price: {
          type: String,
        },
        partner: {
          type: String,
        },
        tracking: [
          {
            time: {
              type: Date,
            },
            status: {
              type: String,
            },
            descriptions: {
              type: String,
            },
          },
        ],
      },
      items: [
        {
          name: {
            type: String,
          },
          thumbnail: {
            type: String,
          },
          number: {
            type: String,
          },
          price: {
            type: String,
          },
          discount: {
            type: String,
          },
          typeDiscount: {
            type: String,
          },
        },
      ],
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Carts.COLLECTION_NAME]) {
      mongoose.model(Carts.COLLECTION_NAME, this.schema, Carts.COLLECTION_NAME);
    }
    this.model = mongoose.model(Carts.COLLECTION_NAME);
  }
}

export default new Carts();
