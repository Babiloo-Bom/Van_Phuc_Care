import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { MongoDbTickets } from '@mongodb/tickets';

/**
 * User Ticket Controller
 * Handles ticket operations for logged-in users
 */
class UserTicketController {
  /**
   * GET /api/u/tickets
   * Get tickets created by the current user
   */
  async index(req: Request, res: Response) {
    try {
      const user = req.currentUser as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Build query filters
      const query: any = {
        userId: user._id,
      };

      // Filter by status
      if (req.query.status) {
        query.status = req.query.status;
      }

      // Filter by priority
      if (req.query.priority) {
        query.priority = req.query.priority;
      }

      // Filter by category
      if (req.query.category) {
        query.category = req.query.category;
      }

      // Search by title or description
      if (req.query.search) {
        query.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { ticketNumber: { $regex: req.query.search, $options: 'i' } },
        ];
      }

      // Sorting
      let sort: any = { createdAt: -1 }; // Default: newest first
      if (req.query.sort) {
        const sortField = req.query.sort as string;
        if (sortField.startsWith('-')) {
          sort = { [sortField.substring(1)]: -1 };
        } else {
          sort = { [sortField]: 1 };
        }
      }

      // Execute query
      const [tickets, total] = await Promise.all([
        MongoDbTickets.model
          .find(query)
          .populate('userId', 'fullname email phoneNumber')
          .populate('assignedTo', 'fullname email')
          .populate('resolvedBy', 'fullname email')
          .sort(sort)
          .skip(offset)
          .limit(limit)
          .lean(),
        MongoDbTickets.model.countDocuments(query),
      ]);

      const responseData = {
        data: tickets,
        pagination: {
          page,
          pageSize: limit,
          total,
        },
      };

      sendSuccess(res, responseData);
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * GET /api/u/tickets/:id
   * Get ticket details by ID (only if owned by current user)
   */
  async show(req: Request, res: Response) {
    try {
      const user = req.currentUser as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { id } = req.params;

      const ticket = await MongoDbTickets.model
        .findOne({ _id: id, userId: user._id })
        .populate('userId', 'fullname email phoneNumber')
        .populate('assignedTo', 'fullname email avatar')
        .populate('resolvedBy', 'fullname email')
        .lean();

      if (!ticket) {
        return sendError(res, 404, 'Ticket not found or access denied');
      }

      sendSuccess(res, { ticket });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/u/tickets
   * Create new ticket for current user
   */
  async create(req: Request, res: Response) {
    try {
      const user = req.currentUser as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const params = req.body;

      // Set userId to current user
      params.userId = user._id;

      // Set default values
      if (!params.status) {
        params.status = 'open';
      }
      if (!params.priority) {
        params.priority = 'medium';
      }

      // Create ticket
      const ticket = await MongoDbTickets.model.create(params);

      // Populate ticket details
      const populatedTicket = await MongoDbTickets.model
        .findById(ticket._id)
        .populate('userId', 'fullname email phoneNumber')
        .populate('assignedTo', 'fullname email')
        .lean();

      sendSuccess(res, { ticket: populatedTicket }, 'Ticket created successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * PATCH /api/u/tickets/:id
   * Update ticket (limited fields for user)
   */
  async update(req: Request, res: Response) {
    try {
      const user = req.currentUser as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { id } = req.params;
      const params = req.body;

      // Check if ticket exists and belongs to user
      const existingTicket = await MongoDbTickets.model.findOne({
        _id: id,
        userId: user._id,
      });

      if (!existingTicket) {
        return sendError(res, 404, 'Ticket not found or access denied');
      }

      // Users can only update certain fields
      const allowedFields = ['title', 'description', 'category', 'priority'];
      const updateData: any = {};
      allowedFields.forEach(field => {
        if (params[field] !== undefined) {
          updateData[field] = params[field];
        }
      });

      // Update ticket
      const ticket = await MongoDbTickets.model
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('userId', 'fullname email phoneNumber')
        .populate('assignedTo', 'fullname email')
        .populate('resolvedBy', 'fullname email')
        .lean();

      sendSuccess(res, { ticket }, 'Ticket updated successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * DELETE /api/u/tickets/:id
   * Delete/Cancel ticket (only if not resolved/closed)
   */
  async destroy(req: Request, res: Response) {
    try {
      const user = req.currentUser as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { id } = req.params;

      const ticket = await MongoDbTickets.model.findOne({
        _id: id,
        userId: user._id,
      });

      if (!ticket) {
        return sendError(res, 404, 'Ticket not found or access denied');
      }

      // Only allow deleting open or in-progress tickets
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        return sendError(res, 400, 'Cannot delete resolved or closed tickets');
      }

      await MongoDbTickets.model.findByIdAndDelete(id);

      sendSuccess(res, null, 'Ticket deleted successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new UserTicketController();
