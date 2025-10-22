import mongoose, { Model, Schema } from 'mongoose';

class Product {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'products';
  public readonly STATUS_ENUM = { ACTIVE: 'active', ARCHIVED: 'archived', DRAFT: 'draft', OUT_STOCK: 'out_stock' };
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
      shortDescription: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      typeDiscount: {
        type: String,
      },
      category: [
        {
          _id: {
            type: String,
          },
          name: {
            type: String,
          },
        },
      ],
      price: {
        type: Number,
        default: 0,
      },
      priceDiscount: {
        type: Number,
        default: 0,
      },
      showHome: {
        type: Boolean,
        default: true,
      },
      discount: {
        type: Number,
      },
      gtin: {
        type: String,
      },
      images: [String],
      reviews: [{
        user: String,
        rating: Number,
        comment: String,
      }],
      quantityInStock: {
        type: Number,
        default: 0,
      },
      quantitySelled: {
        type: Number,
        default: 0,
      },
      isOutOfStock: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        default: 'active',
        enum: ['active', 'archived', 'draft', 'out_stock'],
      },
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Product.COLLECTION_NAME]) {
      mongoose.model(Product.COLLECTION_NAME, this.schema, Product.COLLECTION_NAME);
    }
    this.model = mongoose.model(Product.COLLECTION_NAME);
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

  public async handleStock (products: [], type: String) {
    try {
      for (const product of products) {
        const data: {_id: string, quantity: number} = product;
        await this.model.findByIdAndUpdate(data._id,
          { $inc: { quantityInStock: type === 'buy' ? -(data.quantity) : data.quantity, quantitySelled: type === 'buy' ? (data.quantity) : -(data.quantity) } },
        );
      }
      return true;
    } catch {
      return false;
    }
  }
}

export default new Product();
