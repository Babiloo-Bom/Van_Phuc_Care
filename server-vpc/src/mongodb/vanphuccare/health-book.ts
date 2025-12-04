import mongoose, { Model, Schema } from 'mongoose';

class HealthBooks {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'health-books';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      userId: {
        type: String,
        required: true,
        index: true,
      },
      customerId: {
        type: String,
      },
      name: {
        type: String,
      },
      dob: {
        type: String, // Assuming date of birth is represented as a string
      },
      avatar: {
        type: String, // Assuming the avatar URL is represented as a string
      },
      weight: {
        type: String,
      },
      height: {
        type: String,
      },
      gender: {
        type: String,
      },
      skinConditions: {
        type: String,
      },
      tooth: {
        count: {
          type: String,
        },
        descriptions: {
          type: String,
        },
      },
      nutrition: {
        count: {
          type: String,
        },
        descriptions: {
          type: String,
        },
      },
      sleep: {
        time: {
          type: String,
        },
        descriptions: {
          type: String,
        },
      },
      frequencyOfDefecation: {
        type: String,
      },
      fecalCondition: {
        type: String,
      },
      digestiveProblems: {
        type: String,
      },
      healthCondition: {
        type: String,
      },
      vaccination: {
        type: String,
      },
      vaccinationDate: {
        type: String,
      },
      vaccinationContent: {
        type: String,
      },
      note: {
        type: String,
      },
      method: {
        status: {
          type: String,
        },
        descriptions: {
          type: String,
        },
      },
      exerciseAndSkills: {
        type: String,
      },
      domain: {
        type: String,
        require: true,
      },
    },
    {
      strict: false, // Allow dynamic fields
      timestamps: {
      },
    },
    );
    this.schema.index({ domain: 1, customerId: 1 });
    this.schema.index({ userId: 1, customerId: 1 });
    if (!mongoose.models[HealthBooks.COLLECTION_NAME]) {
      mongoose.model(HealthBooks.COLLECTION_NAME, this.schema, HealthBooks.COLLECTION_NAME);
    }
    this.model = mongoose.model(HealthBooks.COLLECTION_NAME);
  }
}

export default new HealthBooks();
