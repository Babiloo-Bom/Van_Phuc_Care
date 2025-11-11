import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MongoDbCustomers from '@mongodb/customers';
import MongoDbService from '@mongodb/services';
import MongoDbFeedbacks from '@mongodb/feedbacks';
import { MongoDbTickets } from '@mongodb/tickets';

/**
 * Dashboard Controller
 * Provides comprehensive summary data for admin dashboard
 */
class DashboardController {
  /**
   * GET /api/a/dashboard/summary
   * Get comprehensive dashboard summary with all key metrics
   */
  async summary(req: Request, res: Response) {
    try {
      // Get total customers count
      const totalCustomers = await MongoDbCustomers.model.countDocuments();

      // Get total tickets count
      const totalTickets = await MongoDbTickets.model.countDocuments();

      // Get total services count
      const totalServices = await MongoDbService.model.countDocuments();

      // Get feedbacks statistics by rating
      const feedbackStats = await MongoDbFeedbacks.model.aggregate([
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
      ]);

      // Calculate satisfied, neutral, unsatisfied based on rating
      // Rating 4-5: satisfied
      // Rating 3: neutral
      // Rating 1-2: unsatisfied
      let satisfied = 0;
      let neutral = 0;
      let unsatisfied = 0;

      feedbackStats.forEach((item) => {
        const rating = item._id;
        const count = item.count;

        if (rating >= 4) {
          satisfied += count;
        } else if (rating === 3) {
          neutral += count;
        } else if (rating <= 2) {
          unsatisfied += count;
        }
      });

      const summary = {
        customers: totalCustomers,
        tickets: totalTickets,
        services: totalServices,
        feedbacks: {
          satisfied,
          neutral,
          unsatisfied,
        },
      };

      sendSuccess(res, summary);
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new DashboardController();
