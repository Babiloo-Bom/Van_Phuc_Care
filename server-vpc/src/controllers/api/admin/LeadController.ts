import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbServiceRegistrations from '@mongodb/service-registrations';
import MongoDbServices from '@mongodb/services';
import MongoDbAdmins from '@mongodb/admins';

class LeadController {
  /**
   * Get all leads (service registrations)
   * GET /api/a/leads
   */
  public static async getAllLeads(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search = '', leadStatus = '', serviceId = '' } = req.query;
      
      const query: any = {};
      
      if (search) {
        query.$or = [
          { customerName: { $regex: search, $options: 'i' } },
          { customerEmail: { $regex: search, $options: 'i' } },
          { customerPhone: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (leadStatus) {
        query.leadStatus = leadStatus;
      }
      
      if (serviceId) {
        query.serviceId = serviceId;
      }
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const [leads, total] = await Promise.all([
        MongoDbServiceRegistrations.model
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        MongoDbServiceRegistrations.model.countDocuments(query)
      ]);
      
      // Populate service information
      const leadsWithService = await Promise.all(
        leads.map(async (lead: any) => {
          const service: any = await MongoDbServices.model.findById(lead.serviceId).lean();
          return {
            ...lead,
            service: service ? {
              _id: service._id,
              title: service.title,
              slug: service.slug
            } : null
          };
        })
      );
      
      sendSuccess(res, {
        leads: leadsWithService,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error: any) {
      console.error('❌ Get all leads error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get lead by ID
   * GET /api/a/leads/:id
   */
  public static async getLeadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const lead: any = await MongoDbServiceRegistrations.model.findById(id).lean();
      
      if (!lead) {
        return sendError(res, 404, 'Lead not found');
      }
      
      // Populate service information
      const service: any = await MongoDbServices.model.findById(lead.serviceId).lean();
      const leadWithService = {
        ...lead,
        service: service ? {
          _id: service._id,
          title: service.title,
          slug: service.slug,
          thumbnail: service.thumbnail
        } : null
      };
      
      sendSuccess(res, { lead: leadWithService });
    } catch (error: any) {
      console.error('❌ Get lead by ID error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update lead status
   * PUT /api/a/leads/:id/status
   */
  public static async updateLeadStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { leadStatus, notes } = req.body;
      
      if (!leadStatus || !['new', 'contacted', 'in_crm'].includes(leadStatus)) {
        return sendError(res, 400, 'Invalid lead status');
      }
      
      const lead = await MongoDbServiceRegistrations.model.findByIdAndUpdate(
        id,
        { 
          leadStatus,
          ...(notes && { notes })
        },
        { new: true }
      );
      
      if (!lead) {
        return sendError(res, 404, 'Lead not found');
      }
      
      sendSuccess(res, {
        message: 'Lead status updated successfully',
        lead
      });
    } catch (error: any) {
      console.error('❌ Update lead status error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Delete lead
   * DELETE /api/a/leads/:id
   */
  public static async deleteLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const lead = await MongoDbServiceRegistrations.model.findByIdAndDelete(id);
      
      if (!lead) {
        return sendError(res, 404, 'Lead not found');
      }
      
      sendSuccess(res, {
        message: 'Lead deleted successfully'
      });
    } catch (error: any) {
      console.error('❌ Delete lead error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get lead statistics
   * GET /api/a/leads/stats
   */
  public static async getLeadStats(req: Request, res: Response) {
    try {
      const [total, newLeads, contacted, inCrm] = await Promise.all([
        MongoDbServiceRegistrations.model.countDocuments({}),
        MongoDbServiceRegistrations.model.countDocuments({ leadStatus: 'new' }),
        MongoDbServiceRegistrations.model.countDocuments({ leadStatus: 'contacted' }),
        MongoDbServiceRegistrations.model.countDocuments({ leadStatus: 'in_crm' })
      ]);
      
      sendSuccess(res, {
        stats: {
          total,
          new: newLeads,
          contacted,
          inCrm
        }
      });
    } catch (error: any) {
      console.error('❌ Get lead stats error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default LeadController;

