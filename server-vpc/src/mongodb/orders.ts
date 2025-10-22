import mongoose, { Model, Schema } from 'mongoose';

class Orders {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'orders';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      cartId: {
        type: String,
      },
      code: {
        type: Number,
      },
      products: [
        {
          _id: {
            type: String,
          },
          name: {
            type: String,
          },
          thumbnail: {
            type: String,
          },
          quantity: {
            type: Number,
          },
          price: {
            type: Number,
          },
        },
      ],
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
      salesChannel: {
        _id: {
          type: String,
        },
        name: {
          type: String,
        },
      },
      status: {
        type: String,
        default: 'pending',
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
      discount: {
        name: {
          type: String,
        },
        price: {
          type: String,
        },
        type: {
          type: String,
        },
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
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Orders.COLLECTION_NAME]) {
      mongoose.model(Orders.COLLECTION_NAME, this.schema, Orders.COLLECTION_NAME);
    }
    this.model = mongoose.model(Orders.COLLECTION_NAME);
  }

  public convertToDate (dateString: any, type: string) {
    const d = dateString.split('-');
    let dataHandled;
    if (type === 'next') {
      if (Number(d[0]) > 29) {
        dataHandled = d[2] + '-' + Number(d[1]) + '-' + d[0];
      } else {
        dataHandled = d[2] + '-' + d[1] + '-' + (((Number(d[0])) + 1) < 10 ? `0${((Number(d[0])) + 1).toString()}` : ((Number(d[0])) + 1).toString());
      }
    } else {
      dataHandled = d[2] + '-' + d[1] + '-' + d[0];
    }
    return dataHandled;
  }

  public totalPrice (data: any[]) {
    const totalPrice = data.reduce((accumulator: number, product: { price: number; quantity: number; }) => accumulator + (product.price * product.quantity), 0);
    return totalPrice;
  }

  public totalBill (data: any) {
    const transportPrice = data?.transportFee ? Number(data?.transportFee.price) : 0;
    const productTotal = Number(this.totalPrice(data.products));

    if (data.discount) {
      if (data.discount.type === 'percentage') {
        const discountPercentage = Number(data.discount.price) / 100;
        return productTotal * (1 - discountPercentage) + transportPrice;
      } if (data.discount.type === 'amount') {
        return productTotal - Number(data.discount.price) + transportPrice;
      }
    }
    return productTotal + transportPrice;
  }
}

export default new Orders();
