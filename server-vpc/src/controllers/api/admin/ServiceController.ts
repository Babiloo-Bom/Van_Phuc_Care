import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbService from '@mongodb/services';
import MongoDbFeedbacks from '@mongodb/feedbacks';
import { NoData } from '@libs/errors';
import moment from 'moment';

class ServiceController {
  public async create (req: Request, res: Response) {
    try {
      if (req.currentAdmin.role === 'manager') {
        const admin = req.currentAdmin;
        const body = req.body;
        const checkExistSlug = await MongoDbService.model.findOne({ slug: body.slug });
        if (checkExistSlug) {
          return sendError(res, 401, 'Đường dẫn đã tồn tại');
        }
        const service = await MongoDbService.model.create({ ...body, origin: admin.domain });
        sendSuccess(res, { service });
      } else {
        sendError(res, 404, NoData);
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const { searchKey } = req.query;

      // Hiện tại: bỏ filter theo origin để admin thấy đầy đủ danh sách dịch vụ
      // (bao gồm cả dữ liệu seed cũ và dữ liệu theo domain)
      const queryString: any = {};
      if (searchKey) {
        Object.assign(queryString, {
          $or: [
            { title: { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [services, total] = await Promise.all([
        MongoDbService.model.find(queryString)
          .select({ updatedAt: 0, descriptions: 0, origin: 0, progress: 0, content: 0, implementer: 0 })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        MongoDbService.model.countDocuments(queryString),
      ]);
      // Standardized pagination response format
      sendSuccess(res, { 
        data: services, 
        pagination: { 
          page, 
          pageSize: limit, 
          total 
        } 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const service = await MongoDbService.model.findOne({
        $or: [
          { target: req.params.id },
          { slug: req.params.id },
        ],
        origin: req.currentAdmin.domain,
      }).lean();
      if (!service) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { service });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const service: any = await MongoDbService.model.findById(req.params.id);
      if (!service) {
        return sendError(res, 404, NoData);
      }
      if (service.status === 'active' && req.params.status === 'inactive') {
        await MongoDbService.updateNumberReview(req.params.id, -1);
      } else if (service.status === 'inactive' && req.params.status === 'active') {
        await MongoDbService.updateNumberReview(req.params.id, 1);
      }
      await service.update({
        ...req.body,
        origin: req.currentAdmin.domain,
      });
      const result = await MongoDbService.model.findById(req.params.id);
      sendSuccess(res, { service: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      if (req.currentAdmin.role !== 'manager') {
        sendError(res, 400, NoData);
      }
      await MongoDbService.model.deleteMany({ _id: { $in: req.body.ids } });
      await MongoDbFeedbacks.model.deleteMany({ serviceId: { $in: req.body.ids } });
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * GET /api/a/services/statistics
   * Advanced service statistics with flexible filtering
   * Query params:
   * - range: 7d|30d|90d|all (default: 30d)
   * - groupBy: status|type|date (default: status)
   * - from: start date (YYYY-MM-DD)
   * - to: end date (YYYY-MM-DD)
   */
  public async statistics (req: Request, res: Response) {
    try {
      const { range, groupBy, from, to } = req.query;

      // Calculate date range
      let startDate: Date;
      let endDate: Date = new Date();

      if (from && to) {
        // Custom date range
        startDate = moment(from.toString()).startOf('day').toDate();
        endDate = moment(to.toString()).endOf('day').toDate();
      } else if (range) {
        // Predefined range
        switch (range) {
          case '7d':
            startDate = moment().subtract(7, 'days').startOf('day').toDate();
            break;
          case '30d':
            startDate = moment().subtract(30, 'days').startOf('day').toDate();
            break;
          case '90d':
            startDate = moment().subtract(90, 'days').startOf('day').toDate();
            break;
          case 'all':
            startDate = new Date(0); // Beginning of time
            break;
          default:
            startDate = moment().subtract(30, 'days').startOf('day').toDate();
        }
      } else {
        // Default: last 30 days
        startDate = moment().subtract(30, 'days').startOf('day').toDate();
      }

      // Base query with date filter and domain
      const dateQuery: any = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        origin: req.currentAdmin.domain,
      };

      // Get total services in range
      const totalInRange = await MongoDbService.model.countDocuments(dateQuery);

      // Get total services (all time for this domain)
      const totalAllTime = await MongoDbService.model.countDocuments({
        origin: req.currentAdmin.domain,
      });

      let groupedData: any = {};

      // Group by parameter
      switch (groupBy) {
        case 'status':
          // Group by service status
          const statusStats = await MongoDbService.model.aggregate([
            { $match: dateQuery },
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ]);

          groupedData.byStatus = statusStats.map((item) => ({
            status: item._id || 'unknown',
            count: item.count,
            percentage: totalInRange > 0 ? ((item.count / totalInRange) * 100).toFixed(2) : '0',
          }));
          break;

        case 'type':
          // Group by service type/category
          const typeStats = await MongoDbService.model.aggregate([
            { $match: dateQuery },
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' },
              },
            },
            { $sort: { count: -1 } },
          ]);

          groupedData.byType = typeStats.map((item) => ({
            type: item._id || 'unknown',
            count: item.count,
            avgPrice: item.avgPrice ? Math.round(item.avgPrice) : 0,
            percentage: totalInRange > 0 ? ((item.count / totalInRange) * 100).toFixed(2) : '0',
          }));
          break;

        case 'date':
          // Group by date (daily, weekly, or monthly based on range)
          let dateFormat: string;
          let groupFormat: string;

          if (range === '7d' || (from && to && moment(to.toString()).diff(moment(from.toString()), 'days') <= 7)) {
            // Daily for 7 days or less
            dateFormat = '%Y-%m-%d';
            groupFormat = 'daily';
          } else if (range === '30d' || (from && to && moment(to.toString()).diff(moment(from.toString()), 'days') <= 30)) {
            // Daily for 30 days or less
            dateFormat = '%Y-%m-%d';
            groupFormat = 'daily';
          } else {
            // Monthly for longer periods
            dateFormat = '%Y-%m';
            groupFormat = 'monthly';
          }

          const dateStats = await MongoDbService.model.aggregate([
            { $match: dateQuery },
            {
              $group: {
                _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]);

          groupedData.byDate = {
            format: groupFormat,
            data: dateStats.map((item) => ({
              date: item._id,
              count: item.count,
            })),
          };
          break;

        default:
          // Default: group by status
          const defaultStats = await MongoDbService.model.aggregate([
            { $match: dateQuery },
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ]);

          groupedData.byStatus = defaultStats.map((item) => ({
            status: item._id || 'unknown',
            count: item.count,
            percentage: totalInRange > 0 ? ((item.count / totalInRange) * 100).toFixed(2) : '0',
          }));
      }

      // Get growth rate (compare with previous period)
      const periodLength = moment(endDate).diff(moment(startDate), 'days');
      const previousStartDate = moment(startDate).subtract(periodLength, 'days').toDate();
      const previousEndDate = moment(startDate).subtract(1, 'day').toDate();

      const previousPeriodCount = await MongoDbService.model.countDocuments({
        createdAt: {
          $gte: previousStartDate,
          $lte: previousEndDate,
        },
        origin: req.currentAdmin.domain,
      });

      const growthRate = previousPeriodCount > 0
        ? (((totalInRange - previousPeriodCount) / previousPeriodCount) * 100).toFixed(2)
        : '100';

      // Get popular services (most viewed/ordered)
      const popularServices = await MongoDbService.model
        .find(dateQuery)
        .sort({ views: -1 })
        .limit(10)
        .select('title slug status type price views createdAt')
        .lean();

      // Get feedback statistics for services
      const feedbackStats = await MongoDbFeedbacks.model.aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service',
          },
        },
        { $unwind: '$service' },
        { $match: { 'service.origin': req.currentAdmin.domain } },
        {
          $group: {
            _id: null,
            totalFeedbacks: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            satisfied: {
              $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] },
            },
            neutral: {
              $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] },
            },
            unsatisfied: {
              $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] },
            },
          },
        },
      ]);

      const feedbacks = feedbackStats.length > 0 ? feedbackStats[0] : {
        totalFeedbacks: 0,
        avgRating: 0,
        satisfied: 0,
        neutral: 0,
        unsatisfied: 0,
      };

      const statistics = {
        summary: {
          totalInRange,
          totalAllTime,
          growthRate: parseFloat(growthRate),
          periodStart: moment(startDate).format('YYYY-MM-DD'),
          periodEnd: moment(endDate).format('YYYY-MM-DD'),
          periodDays: periodLength,
        },
        grouped: groupedData,
        popular: popularServices,
        feedbacks: {
          total: feedbacks.totalFeedbacks,
          avgRating: feedbacks.avgRating ? parseFloat(feedbacks.avgRating.toFixed(2)) : 0,
          satisfied: feedbacks.satisfied,
          neutral: feedbacks.neutral,
          unsatisfied: feedbacks.unsatisfied,
        },
      };

      sendSuccess(res, { statistics });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ServiceController();
