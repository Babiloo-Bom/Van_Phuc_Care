import mongoose from 'mongoose';
import type { Model, Document } from 'mongoose';

/**
 * Ticket Interface
 */
export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string;
  title: string;
  description: string;
  customerId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'general' | 'complaint' | 'feature_request';
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;
  notes?: string;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ticket Schema
 */
const TicketSchema = new mongoose.Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    category: {
      type: String,
      enum: ['technical', 'billing', 'general', 'complaint', 'feature_request'],
      default: 'general',
      index: true,
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
    notes: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins',
    },
  },
  {
    timestamps: true,
    collection: 'tickets',
  }
);

/**
 * Indexes for better query performance
 */
TicketSchema.index({ status: 1, createdAt: -1 });
TicketSchema.index({ customerId: 1, status: 1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ priority: 1, status: 1 });

/**
 * Pre-save middleware to generate ticket number
 */
TicketSchema.pre('save', async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const count = await TicketModel.countDocuments();
    this.ticketNumber = `TK${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

/**
 * Pre-save middleware to set resolvedAt when status changes to resolved/closed
 */
TicketSchema.pre('save', function (next) {
  if (this.isModified('status') && (this.status === 'resolved' || this.status === 'closed')) {
    if (!this.resolvedAt) {
      this.resolvedAt = new Date();
    }
  }
  next();
});

/**
 * Virtual for customer details
 */
TicketSchema.virtual('customer', {
  ref: 'customers',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Virtual for assigned admin details
 */
TicketSchema.virtual('assignedAdmin', {
  ref: 'admins',
  localField: 'assignedTo',
  foreignField: '_id',
  justOne: true,
});

/**
 * Enable virtuals in JSON
 */
TicketSchema.set('toJSON', { virtuals: true });
TicketSchema.set('toObject', { virtuals: true });

/**
 * Ticket Model
 */
const TicketModel: Model<ITicket> = mongoose.model<ITicket>('tickets', TicketSchema);

/**
 * Export MongoDB Tickets
 */
export const MongoDbTickets = {
  model: TicketModel,
  schema: TicketSchema,
};

export default MongoDbTickets;
