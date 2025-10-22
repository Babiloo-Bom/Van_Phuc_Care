import mongoose, { Model, Schema } from 'mongoose';

class News {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'news';
  public readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive', PENDING: 'pending' };
  public readonly TYPE_ENUM = { NORMAL: 'normal', VIP: 'vip', OFFICIAL: 'official' };
  public readonly CATEGORY_ENUM = { RENT: 'rent', BUY: 'buy' };
  public readonly TYPE_PRICE_ENUM = { PRICE: 'price', AGREE: 'agree' };
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema(
      {
        title: {
          type: String,
        },
        shortDescription: {
          type: String,
        },
        content: {
          type: String,
        },
        status: {
          type: String,
          default: 'pending',
          enum: ['active', 'inactive', 'pending', 'expired'],
        },
        createdId: {
          type: String,
        },
        createdBy: {
          fullname: {
            type: String,
            default: '',
          },
          email: {
            type: String,
            require: true,
          },
          avatar: {
            type: String,
            default: null,
          },
          phoneNumber: {
            type: String,
            default: '',
          },
        },
        project: {
          type: Schema.Types.ObjectId,
          ref: 'Projects',
        },
        type: {
          type: String,
          default: 'normal',
          enum: ['normal', 'vip', 'official'],
        },
        typeNew: {
          type: String,
        },
        medias: [
          {
            source: {
              type: String,
            },
            type: {
              type: String,
            },
          },
        ],
        tags: [
          {
            label: {
              type: String,
            },
            slug: {
              type: String,
            },
          },
        ],
        isBeginning: {
          type: Boolean,
          default: false,
        },
        typePrice: {
          type: String,
        },
        category: {
          type: String,
          enum: ['rent', 'buy'],
        },
        purchasePrice: {
          type: Number,
        },
        rentPrice: {
          type: Number,
        },
        infor: {
          area: Number,
          facade: String,
          floors: String,
          toilet: String,
          interior: String,
          price: String,
          roadDistance: String,
          bedRoom: String,
          juridical: String,
          houseDirection: String,
          balcony: String,
        },
        province: {
          id: Number,
          name: String,
        },
        district: {
          id: Number,
          name: String,
        },
        ward: {
          id: Number,
          name: String,
        },
        addressDetail: {
          type: String,
        },
        expirationDate: {
          type: Date,
        },
        map: {
          type: String,
        },
      },
      {
        timestamps: {},
      },
    );
    if (!mongoose.models[News.COLLECTION_NAME]) {
      mongoose.model(News.COLLECTION_NAME, this.schema, News.COLLECTION_NAME);
    }
    this.model = mongoose.model(News.COLLECTION_NAME);
  }
}

export default new News();
