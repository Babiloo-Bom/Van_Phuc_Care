import mongoose from 'mongoose';
import type { Model, Document } from 'mongoose';

/**
 * Ticket Comment Interface
 */
export interface ITicketComment extends Document {
  _id: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
  content: string;
  isAdmin: boolean;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ticket Comment Schema
 */
const TicketCommentSchema = new mongoose.Schema<ITicketComment>(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tickets',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins',
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'ticket-comments',
  }
);

/**
 * Indexes
 */
TicketCommentSchema.index({ ticketId: 1, createdAt: 1 });

/**
 * Create and export the model
 */
const TicketCommentModel = mongoose.model<ITicketComment>('ticket-comments', TicketCommentSchema);

export const MongoDbTicketComments = {
  model: TicketCommentModel,
  schema: TicketCommentSchema,
};

export default MongoDbTicketComments;
