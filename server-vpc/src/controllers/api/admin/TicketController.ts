import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { MongoDbTickets } from '@mongodb/tickets';
import MongoDbCustomers from '@mongodb/customers';

/**
 * Ticket Controller
 * Handles all ticket-related operations for customer support
 */
class TicketController {
  /**
   * GET /api/a/tickets
   * Get list of tickets with pagination, sorting, and filtering
   */
  async index(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Build query filters
      const query: any = {};

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

      // Filter by customer
      if (req.query.customerId) {
        query.customerId = req.query.customerId;
      }

      // Filter by assigned admin
      if (req.query.assignedTo) {
        query.assignedTo = req.query.assignedTo;
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
          .populate('customerId', 'firstname lastname email phone')
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
   * GET /api/a/tickets/:id
   * Get ticket details by ID
   */
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ticket = await MongoDbTickets.model
        .findById(id)
        .populate('customerId', 'firstname lastname email phone address dateOfBirth')
        .populate('assignedTo', 'fullname email avatar')
        .populate('resolvedBy', 'fullname email')
        .lean();

      if (!ticket) {
        return sendError(res, 404, 'Ticket not found');
      }

      sendSuccess(res, { ticket });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/a/tickets
   * Create new ticket
   */
  async create(req: Request, res: Response) {
    try {
      const params = req.body;

      // Validate customer exists
      const customer = await MongoDbCustomers.model.findById(params.customerId);
      if (!customer) {
        return sendError(res, 404, 'Customer not found');
      }

      // Create ticket
      const ticket = await MongoDbTickets.model.create(params);

      // Populate customer details
      const populatedTicket = await MongoDbTickets.model
        .findById(ticket._id)
        .populate('customerId', 'firstname lastname email phone')
        .populate('assignedTo', 'fullname email')
        .lean();

      sendSuccess(res, { ticket: populatedTicket }, 'Ticket created successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * PATCH /api/a/tickets/:id
   * Update ticket
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const params = req.body;

      // Check if ticket exists
      const existingTicket = await MongoDbTickets.model.findById(id);
      if (!existingTicket) {
        return sendError(res, 404, 'Ticket not found');
      }

      // If status is being changed to resolved/closed, set resolvedAt and resolvedBy
      if (params.status === 'resolved' || params.status === 'closed') {
        if (!existingTicket.resolvedAt) {
          params.resolvedAt = new Date();
        }
        if (!params.resolvedBy && req.user) {
          params.resolvedBy = (req.user as any)._id;
        }
      }

      // Update ticket
      const ticket = await MongoDbTickets.model
        .findByIdAndUpdate(id, params, { new: true })
        .populate('customerId', 'firstname lastname email phone')
        .populate('assignedTo', 'fullname email')
        .populate('resolvedBy', 'fullname email')
        .lean();

      sendSuccess(res, { ticket }, 'Ticket updated successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * DELETE /api/a/tickets/:id
   * Delete ticket
   */
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ticket = await MongoDbTickets.model.findByIdAndDelete(id);

      if (!ticket) {
        return sendError(res, 404, 'Ticket not found');
      }

      sendSuccess(res, {}, 'Ticket deleted successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * GET /api/a/tickets/statistics
   * Get ticket statistics
   */
  async statistics(req: Request, res: Response) {
    try {
      // Get total tickets
      const total = await MongoDbTickets.model.countDocuments();

      // Get tickets by status
      const statusStats = await MongoDbTickets.model.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Get tickets by priority
      const priorityStats = await MongoDbTickets.model.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
      ]);

      // Get tickets by category
      const categoryStats = await MongoDbTickets.model.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);

      // Active tickets (open, pending, in_progress)
      const activeCount = await MongoDbTickets.model.countDocuments({
        status: { $in: ['open', 'pending', 'in_progress'] },
      });

      // Pending tickets
      const pendingCount = await MongoDbTickets.model.countDocuments({
        status: 'pending',
      });

      // Resolved tickets
      const resolvedCount = await MongoDbTickets.model.countDocuments({
        status: 'resolved',
      });

      // Closed tickets
      const closedCount = await MongoDbTickets.model.countDocuments({
        status: 'closed',
      });

      // Latest tickets (limit 5)
      const latestTickets = await MongoDbTickets.model
        .find()
        .populate('customerId', 'firstname lastname email')
        .populate('assignedTo', 'fullname email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // Format statistics
      const statistics = {
        total,
        active: activeCount,
        pending: pendingCount,
        resolved: resolvedCount,
        closed: closedCount,
        byStatus: statusStats.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byCategory: categoryStats.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        latest: latestTickets,
      };

      sendSuccess(res, { statistics });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/a/tickets/bulk-delete
   * Delete multiple tickets
   */
  async bulkDelete(req: Request, res: Response) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendError(res, 400, 'Invalid ticket IDs provided');
      }

      const result = await MongoDbTickets.model.deleteMany({
        _id: { $in: ids },
      });

      sendSuccess(
        res,
        { deletedCount: result.deletedCount },
        `${result.deletedCount} ticket(s) deleted successfully`
      );
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new TicketController();

