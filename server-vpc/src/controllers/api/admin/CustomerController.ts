import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MonggoDbCustomer from '@mongodb/customers';
import MongoDbOrder from '@mongodb/orders';
import moment from 'moment';
import MongoDbUsers from '@mongodb/users';

class CustomerController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const customer = await MonggoDbCustomer.model.create({
        ...params,
        status: 'verified',
      });
      sendSuccess(res, { customer });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      console.log('🔍 CustomerController.index called');
      console.log('📥 Query params:', req.query);
      
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { from, to, categoryId, searchKey, status, gender } = req.query;
      
      // Chỉ query từ users collection với role customer hoặc type normal
      let customers: any[] = [];
      let total = 0;
      
      // Build base query cho users collection
      // Customers có type: 'normal' hoặc role: 'customer'
      const baseQuery: any = {
        $or: [
          { type: 'normal' }, // type: 'normal' là customers
          { role: 'customer' }, // hoặc role: 'customer' (nếu có field role)
        ],
      };
      
      // Add status filter
      if (status) {
        const statusStr = String(status);
        if (statusStr === 'active') {
          baseQuery.$and = [
            ...(baseQuery.$and || []),
            {
              $or: [
                { status: 'active' },
                { isActive: true },
              ],
            },
          ];
        } else if (statusStr === 'inactive') {
          baseQuery.$and = [
            ...(baseQuery.$and || []),
            {
              $or: [
                { status: 'inactive' },
                { isActive: false },
              ],
            },
          ];
        }
      }
      
      // Add gender filter
      if (gender) {
        baseQuery.gender = String(gender);
      }
      
      // Add search query
      if (searchKey) {
        const searchKeyStr = (typeof searchKey === 'string' ? searchKey : String(searchKey)).trim();
        console.log('🔎 Searching with key (trimmed):', searchKeyStr);
        
        if (searchKeyStr.length > 0) {
          baseQuery.$and = [
            ...(baseQuery.$and || []),
            {
              $or: [
                { fullname: { $regex: searchKeyStr, $options: 'i' } },
                { email: { $regex: searchKeyStr, $options: 'i' } },
                { phoneNumber: { $regex: searchKeyStr, $options: 'i' } },
              ],
            },
          ];
        }
      }
      
      // Query users collection
      const [usersData, totalCount] = await Promise.all([
        MongoDbUsers.model.find(baseQuery).skip(offset).limit(limit).sort({ createdAt: -1 }).select('-password').lean(),
        MongoDbUsers.model.countDocuments(baseQuery),
      ]);
      
      // Normalize data từ users collection
      customers = usersData.map((u: any) => {
        const fullname = u.fullname || '';
        const nameParts = fullname.split(' ').filter((p: string) => p.length > 0);
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';
        
        return {
          ...u,
          _id: u._id,
          _source: 'users',
          firstname,
          lastname,
          fullname,
          phone: u.phoneNumber || '',
          email: u.email || '',
          address: u.fullAddress || (u.address ? JSON.stringify(u.address) : ''),
          city: u.address?.province?.name || '',
          gender: u.gender || '',
          status: u.status || (u.isActive ? 'active' : 'inactive'),
          isActive: u.isActive !== undefined ? u.isActive : (u.status === 'active'),
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        };
      });
      
      total = totalCount;
      
      console.log('✅ Found customers:', customers.length, 'Total:', total);
      
      const responseData = { 
        data: customers, 
        pagination: { 
          page, 
          pageSize: limit, 
          total 
        } 
      };
      sendSuccess(res, responseData);
    } catch (error: any) {
      console.error('❌ CustomerController.index error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const queryString: any = {
        _id: req.params.customerId,
      };
      const customer = await MonggoDbCustomer.model.findOne(queryString);
      const orders = await MongoDbOrder.model.find({ 'customer._id': req.params.customerId });
      sendSuccess(res, { customer: { ...customer, orders } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const { customerId } = req.params;
      let updatedCustomer = null;
      updatedCustomer = await MonggoDbCustomer.model.findByIdAndUpdate(
        customerId,
        {
          ...params,
        },
        { new: true },
      );
      sendSuccess(res, { customer: updatedCustomer });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const customer = await MonggoDbCustomer.model.findById(req.params.customerId);
      if (!customer) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * GET /api/a/customers/statistics
   * Advanced customer statistics with flexible filtering
   * Query params:
   * - range: 7d|30d|90d|all (default: 30d)
   * - groupBy: status|region|date (default: status)
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

      // Base query with date filter
      const dateQuery = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      // Get total customers in range
      const totalInRange = await MonggoDbCustomer.model.countDocuments(dateQuery);

      // Get total customers (all time)
      const totalAllTime = await MonggoDbCustomer.model.countDocuments();

      let groupedData: any = {};

      // Group by parameter
      switch (groupBy) {
        case 'status':
          // Group by customer status
          const statusStats = await MonggoDbCustomer.model.aggregate([
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

        case 'region':
          // Group by region/city (from address field)
          const regionStats = await MonggoDbCustomer.model.aggregate([
            { $match: dateQuery },
            {
              $group: {
                _id: '$city',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 20 }, // Top 20 regions
          ]);

          groupedData.byRegion = regionStats.map((item) => ({
            region: item._id || 'unknown',
            count: item.count,
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

          const dateStats = await MonggoDbCustomer.model.aggregate([
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
          const defaultStats = await MonggoDbCustomer.model.aggregate([
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

      const previousPeriodCount = await MonggoDbCustomer.model.countDocuments({
        createdAt: {
          $gte: previousStartDate,
          $lte: previousEndDate,
        },
      });

      const growthRate = previousPeriodCount > 0
        ? (((totalInRange - previousPeriodCount) / previousPeriodCount) * 100).toFixed(2)
        : '100';

      // Recent customers in range
      const recentCustomers = await MonggoDbCustomer.model
        .find(dateQuery)
        .sort({ createdAt: -1 })
        .limit(10)
        .select('firstname lastname email phone createdAt status city')
        .lean();

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
        recent: recentCustomers,
      };

      sendSuccess(res, { statistics });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CustomerController();
