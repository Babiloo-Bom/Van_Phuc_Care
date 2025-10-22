import mongoose, { Model, Schema } from 'mongoose';

class Exercises {
  public schema: Schema;
  public model: Model<unknown>;
  static readonly COLLECTION_NAME = 'exercises';
  constructor () {
    this.generateSchema();
  }

  public generateSchema () {
    this.schema = new Schema({
      title: {
        type: String,
      },
      course: {
        value: {
          type: String,
        },
        label: {
          type: String,
        },
      },
      classroom: {
        value: {
          type: String,
        },
        label: {
          type: String,
        },
      },
      deadline: {
        type: Date,
      },
      students: [
        {
          _id: {
            type: String,
          },
          fullname: {
            type: String,
          },
          avatar: {
            type: String,
          },
          status: {
            type: String,
          },
        },
      ],
    },
    {
      timestamps: {
      },
    },
    );
    if (!mongoose.models[Exercises.COLLECTION_NAME]) {
      mongoose.model(Exercises.COLLECTION_NAME, this.schema, Exercises.COLLECTION_NAME);
    }
    this.model = mongoose.model(Exercises.COLLECTION_NAME);
  }
}

export default new Exercises();
