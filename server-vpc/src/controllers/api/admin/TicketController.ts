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

      // Filter by user
      if (req.query.userId) {
        query.userId = req.query.userId;
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
   * GET /api/a/tickets/:id
   * Get ticket details by ID
   */
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ticket = await MongoDbTickets.model
        .findById(id)
        .populate('userId', 'fullname email phoneNumber address')
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

      // Validate user exists
      const MongoDbUsers = require('@mongodb/users').default;
      const user = await MongoDbUsers.model.findById(params.userId);
      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      // Create ticket
      const ticket = await MongoDbTickets.model.create(params);

      // Populate user details
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
        .populate('userId', 'fullname email')
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

  /**
   * GET /api/a/tickets/assignable-admins
   * Get list of admins/managers who can be assigned to tickets
   */
  async getAssignableAdmins(req: Request, res: Response) {
    try {
      const MongoDbAdmins = require('@mongodb/admins').default;
      
      // Get all active admins, managers, and workers
      const admins = await MongoDbAdmins.model
        .find({
          role: { $in: ['admin', 'manager', 'worker'] },
          status: 'active'
        })
        .select('fullname email avatar role')
        .sort({ role: 1, fullname: 1 }) // Sort by role first, then name
        .lean();

      console.log(`📋 Found ${admins.length} assignable admins/managers/workers`);

      sendSuccess(res, { admins });
    } catch (error: any) {
      console.error('❌ Error getting assignable admins:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/a/tickets/:id/assign
   * Assign ticket to an admin/manager
   * Only admin and manager can assign tickets
   */
  async assignTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;

      // Check user role - only admin and manager can assign
      const currentUser = req.user as any;
      if (!currentUser) {
        return sendError(res, 401, 'Unauthorized');
      }

      const userRole = currentUser.role;
      if (userRole !== 'admin' && userRole !== 'manager') {
        return sendError(res, 403, 'Only admin and manager can assign tickets');
      }

      // Check if ticket exists
      const ticket = await MongoDbTickets.model.findById(id);
      if (!ticket) {
        return sendError(res, 404, 'Ticket not found');
      }

      // If assignedTo is provided, verify the admin exists
      if (assignedTo) {
        const MongoDbAdmins = require('@mongodb/admins').default;
        const assignedAdmin = await MongoDbAdmins.model.findById(assignedTo);
        if (!assignedAdmin) {
          return sendError(res, 404, 'Assigned admin not found');
        }
      }

      // Update ticket
      const updatedTicket = await MongoDbTickets.model
        .findByIdAndUpdate(
          id,
          { assignedTo: assignedTo || null },
          { new: true }
        )
        .populate('userId', 'fullname email phoneNumber')
        .populate('assignedTo', 'fullname email avatar')
        .populate('resolvedBy', 'fullname email')
        .lean();

      // If assigned, update status to "in_progress" if it's still "open" or "pending"
      if (assignedTo && (ticket.status === 'open' || ticket.status === 'pending')) {
        await MongoDbTickets.model.findByIdAndUpdate(id, {
          status: 'in_progress',
        });
        updatedTicket.status = 'in_progress';
      }

      sendSuccess(res, { ticket: updatedTicket }, 'Ticket assigned successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/a/seed/tickets
   * Seed sample ticket data for testing
   */
  async seedTickets(req: Request, res: Response) {
    try {
      console.log('🎫 Starting Ticket Seed Process via API...\n');

      // Get users
      const MongoDbUsers = require('@mongodb/users').default;
      const users = await MongoDbUsers.model.find().limit(50).lean();

      if (users.length === 0) {
        return sendError(res, 400, 'No users found. Please seed users first.');
      }

      // Ticket templates by category
      const TEMPLATES = {
        technical: [
          { title: 'Cannot login to my account', description: 'I have been trying to log in but keep getting "Invalid credentials" error.', priority: 'high' as const },
          { title: 'Website loading very slowly', description: 'The website has been loading extremely slowly for the past few days.', priority: 'medium' as const },
          { title: 'Error when uploading files', description: 'Every time I try to upload a document, I get an error message.', priority: 'medium' as const },
          { title: 'Mobile app keeps crashing', description: 'The mobile app crashes immediately after I open it.', priority: 'high' as const },
        ],
        billing: [
          { title: 'Double charge on my card', description: 'I was charged twice for the same transaction.', priority: 'urgent' as const },
          { title: 'Refund not received', description: 'I requested a refund but haven\'t received it yet.', priority: 'high' as const },
          { title: 'Invoice missing', description: 'I need an invoice for my recent purchase.', priority: 'low' as const },
        ],
        complaint: [
          { title: 'Cannot update profile', description: 'Unable to save changes to my profile information.', priority: 'medium' as const },
          { title: 'Poor customer service', description: 'I am not satisfied with the customer service I received.', priority: 'high' as const },
        ],
        feature_request: [
          { title: 'Add dark mode', description: 'It would be great to have a dark mode option.', priority: 'low' as const },
          { title: 'Export data feature', description: 'Need ability to export my data to CSV.', priority: 'medium' as const },
        ],
        general: [
          { title: 'How to use feature?', description: 'Need help understanding how to use the new feature.', priority: 'low' as const },
          { title: 'Feedback on service', description: 'I want to provide feedback about your service.', priority: 'low' as const },
        ],
      };

      // Generate tickets
      const tickets: any[] = [];
      const categories = Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>;
      const statuses = ['open', 'in_progress', 'resolved', 'closed'];
      
      let ticketNumber = 1000;
      
      for (let i = 0; i < 50; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const templates = TEMPLATES[category];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        ticketNumber++;
        
        const ticket: any = {
          ticketNumber: `TKT-${ticketNumber}`,
          title: template.title,
          description: template.description,
          category,
          priority: template.priority,
          status,
          userId: user._id,
          tags: [category, template.priority],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        };

        if (status === 'in_progress' || status === 'resolved' || status === 'closed') {
          ticket.responses = [{
            message: 'Thank you for contacting us. We are looking into this issue.',
            respondedAt: new Date(ticket.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          }];
        }

        if (status === 'resolved' || status === 'closed') {
          ticket.resolvedAt = new Date(ticket.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
          ticket.resolution = 'Issue has been resolved. Please let us know if you need further assistance.';
        }

        tickets.push(ticket);
      }

      // Clear existing and insert new
      await MongoDbTickets.model.deleteMany({});
      const result = await MongoDbTickets.model.insertMany(tickets);

      console.log(`✅ Successfully seeded ${result.length} tickets`);

      sendSuccess(res, { 
        count: result.length,
        tickets: result 
      }, `Successfully seeded ${result.length} tickets`);
    } catch (error: any) {
      console.error('❌ Error seeding tickets:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new TicketController();

