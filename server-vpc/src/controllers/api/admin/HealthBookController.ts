import MongoDbCustomer from '@mongodb/customers/index';
import MongoDbUsers from '@mongodb/users';
import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbAdmins from '@mongodb/admins';
import MongoDbHealthBooks from '@mongodb/vanphuccare/health-book';
import { NoData } from '@libs/errors';
import moment from 'moment';
import { isEmpty } from 'lodash';
// import { handleSpecificNotification } from '../../../notificationHandlers';

class HealthBookController {
  public async index (req: Request, res: Response) {
    try {
      // Cho phép cả admin và manager
      if (req.currentAdmin.role !== 'admin' && req.currentAdmin.role !== 'manager') {
        return sendError(res, 403, 'Không có quyền truy cập');
      }
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const { category, searchKey, date, createdAt } = req.query;
      const queryString: any = {
        domain: req.currentAdmin.domain,
      };
      
      // Filter theo createdAt (ưu tiên) hoặc date
      const filterDateParam = createdAt || date;
      let filterDate: string | undefined;
      
      // Đảm bảo filterDate là string
      if (filterDateParam) {
        if (typeof filterDateParam === 'string') {
          filterDate = filterDateParam;
        } else if (Array.isArray(filterDateParam) && filterDateParam.length > 0) {
          filterDate = String(filterDateParam[0]);
        } else {
          filterDate = String(filterDateParam);
        }
      }
      
      if (filterDate) {
        // Chuyển đổi date string thành Date object để filter
        let startDate: Date;
        let endDate: Date;
        
        // Nếu là format DD/MM/YYYY, chuyển sang YYYY-MM-DD
        if (filterDate.includes('/')) {
          const [day, month, year] = filterDate.split('/');
          startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
          endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
        } else {
          // Format YYYY-MM-DD
          startDate = new Date(`${filterDate}T00:00:00.000Z`);
          endDate = new Date(`${filterDate}T23:59:59.999Z`);
        }
        
        // Filter theo createdAt (ngày tạo)
        queryString.createdAt = {
          $gte: startDate,
          $lte: endDate
        };
      }
      
      if (category) {
        const categoryStr = typeof category === 'string' ? category : String(category);
        Object.assign(queryString, { category: categoryStr });
      }
      
      if (searchKey) {
        const searchKeyStr = typeof searchKey === 'string' ? searchKey : String(searchKey);
        // Nếu đã có date filter, dùng $and
        if (filterDate) {
          if (!queryString.$and) {
            queryString.$and = [];
          }
          queryString.$and.push({
            $or: [
              { name: { $regex: searchKeyStr, $options: 'i' } },
              { customerEmail: { $regex: searchKeyStr, $options: 'i' } },
            ],
          });
        } else {
          queryString.$or = [
            { name: { $regex: searchKeyStr, $options: 'i' } },
            { customerEmail: { $regex: searchKeyStr, $options: 'i' } },
          ];
        }
      }
      
      const [healthBooks, total] = await Promise.all([
        MongoDbHealthBooks.model.find(queryString)
          .select({ origin: 0, domain: 0 })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        MongoDbHealthBooks.model.countDocuments(queryString),
      ]);
      sendSuccess(res, { pagination: { total, page, limit }, healthBooks });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { date } = req.query;
      let healthBook = {};
      const queryString: any = {
        // Sửa từ origin sang domain
        domain: req.currentAdmin.domain,
        $or: [
          { customerEmail: req.currentAdmin.email },
          { customerId: req.currentAdmin._id },
        ],
      };
      healthBook = await MongoDbHealthBooks.model.findOne({ ...queryString, recordedAt: date || moment().format('DD/MM/YYYY') }).lean();
      if (isEmpty(healthBook)) {
        healthBook = await MongoDbHealthBooks.model.findOne(queryString).sort({ updatedAt: -1 }).lean();
      }
      sendSuccess(res, { data: healthBook || {} });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async getOne (req: Request, res: Response) {
    try {
      const { date } = req.query;
      const queryString: any = {
        _id: req.params.id,
        // Sửa từ origin sang domain
        domain: req.currentAdmin.domain,
      };
      if (date) {
        queryString.recordedAt = date;
      }
      const healthBook = await MongoDbHealthBooks.model.findOne(queryString).lean();
      sendSuccess(res, { data: healthBook || {} });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async getByDate (req: Request, res: Response) {
    try {
      const { date } = req.query;
      const queryString: any = {
        $or: [
          { customerEmail: req.params.customerId },
          { customerId: req.params.customerId },
        ],
        // Sửa từ origin sang domain
        domain: req.currentAdmin.domain,
      };
      if (date) {
        queryString.recordedAt = date;
      }
      const healthBook = await MongoDbHealthBooks.model.findOne(queryString).lean();
      sendSuccess(res, { data: healthBook || {} });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      
      // Tìm trong cả customers và users collections
      let customer: any = await MongoDbCustomer.model.findOne({ account_code: params.account_code }).lean();
      
      // Nếu không tìm thấy trong customers, tìm trong users
      if (!customer) {
        // Nếu có customerEmail, tìm theo email
        if (params.customerEmail) {
          customer = await MongoDbUsers.model.findOne({ 
            email: params.customerEmail,
            type: 'normal'
          }).lean();
        }
        
        // Nếu tìm thấy trong users, normalize data
        if (customer) {
          customer = {
            ...customer,
            firstname: customer.fullname ? customer.fullname.split(' ')[0] : '',
            lastname: customer.fullname ? customer.fullname.split(' ').slice(1).join(' ') : '',
            phone: customer.phoneNumber || '',
            _source: 'users'
          };
        }
      } else {
        customer._source = 'customers';
      }
      
      if (!customer) {
        return sendError(res, 400, { data: 'Không tìm thấy khách hàng' });
      }

      const healthBookCheck = await MongoDbHealthBooks.model.findById(req.params.id);

      if (!healthBookCheck) {
        sendError(res, 400, NoData);
      } else {
        await healthBookCheck.update({
          ...params,
          // Sửa từ origin sang domain
          domain: req.currentAdmin.domain,
        });
      }
      const result = await MongoDbHealthBooks.model.findById(req.params.id);
      sendSuccess(res, { healthBookCheck: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      
      // Tìm trong cả customers và users collections
      let customer: any = await MongoDbCustomer.model.findOne({ email: params.customerEmail }).lean();
      let user: any = null;
      
      // Nếu không tìm thấy trong customers, tìm trong users
      if (!customer) {
        user = await MongoDbUsers.model.findOne({ 
          email: params.customerEmail,
          type: 'normal' // Chỉ lấy customers (type: 'normal')
        }).lean();
        
        // Nếu tìm thấy trong users, normalize data
        if (user) {
          customer = {
            ...user,
            firstname: user.fullname ? user.fullname.split(' ')[0] : '',
            lastname: user.fullname ? user.fullname.split(' ').slice(1).join(' ') : '',
            phone: user.phoneNumber || '',
            _source: 'users'
          };
        }
      } else {
        customer._source = 'customers';
      }

      if (!customer) {
        return sendError(res, 400, { data: 'Không tìm thấy khách hàng' });
      }

      const userId = String(customer._id);
      
      // Tìm health book hiện có của user (nếu có) để lấy thông tin bé
      let existingHealthBook: any = null;
      
      if (user || customer._source === 'users') {
        // Tìm health book bằng userId
        existingHealthBook = await MongoDbHealthBooks.model
          .findOne({ userId: userId })
          .lean();
      }

      // Lấy thông tin bé từ health book hiện có (nếu có)
      let childData: any = {};
      
      if (existingHealthBook) {
        // Ưu tiên lấy từ health book hiện có (thông tin chính xác nhất)
        childData = {
          name: existingHealthBook.name,
          dob: existingHealthBook.dob,
          gender: existingHealthBook.gender,
          avatar: existingHealthBook.avatar
        };
      } else if (user && user.children) {
        // Nếu chưa có health book, thử lấy từ user.children
        if (Array.isArray(user.children) && user.children.length > 0) {
          childData = user.children[0];
        } else if (typeof user.children === 'object' && user.children !== null) {
          childData = user.children;
        }
      }

      // Parse recordedAt date
      const recordedAtDate = params.recordedAt ? 
        (typeof params.recordedAt === 'string' ? params.recordedAt : params.recordedAt.format('DD/MM/YYYY')) : 
        moment().format('DD/MM/YYYY');

      // Tìm health book theo userId và recordedAt (nếu có)
      // Nếu không có recordedAt trong params, tìm health book của user (không filter theo date)
      let healthBookCheck: any = null;
      
      if (params.recordedAt) {
        healthBookCheck = await MongoDbHealthBooks.model.findOne({ 
          userId: userId,
          recordedAt: recordedAtDate
        }).lean();
      } else {
        // Nếu không có recordedAt, tìm health book của user (bất kỳ ngày nào)
        healthBookCheck = await MongoDbHealthBooks.model.findOne({ 
          userId: userId
        }).lean();
      }

      // Chuẩn bị dữ liệu health book
      const healthBookData = {
        ...params,
        // Ưu tiên: existing health book > children > params
        name: existingHealthBook?.name || childData.name || params.name || '',
        dob: existingHealthBook?.dob || childData.dob || params.dob || '',
        gender: existingHealthBook?.gender || childData.gender || params.gender || '',
        avatar: existingHealthBook?.avatar || childData.avatar || params.avatar || '',
        isAcceptedHealthBook: false,
        customerId: userId,
        userId: userId,
        customerEmail: params.customerEmail,
        recordedAt: recordedAtDate,
        domain: req.currentAdmin.domain,
      };

      // Upsert: update nếu đã có, create nếu chưa có
      if (healthBookCheck) {
        // Update health book hiện có
        await MongoDbHealthBooks.model.updateOne(
          { _id: healthBookCheck._id },
          healthBookData
        );
      } else {
        // Create health book mới
        await MongoDbHealthBooks.model.create(healthBookData);
      }
      
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async createLogs (req: Request, res: Response) {
    try {
      const params = req.body;
      const customer: any = await MongoDbCustomer.model.findOne({ account_code: params.account_code }).lean();
      if (!customer) {
        return sendError(res, 400, { data: 'Không tìm thấy khách hàng' });
      }
      const admin: any = await MongoDbAdmins.model.findOne({ email: customer.email, domain: 'vanphuccare.gensi.vn' }).lean();
      const healthBookCheck = await MongoDbHealthBooks.model.findOne({ customerId: admin._id, recordedAt: req.body.recordedAt }).lean();
      const dataChildren = customer.children || {};
      if (!healthBookCheck) {
        await MongoDbHealthBooks.model.create({
          ...params,
          ...dataChildren,
          customerId: admin._id,
          customerEmail: admin.email,
          isAcceptedHealthBook: false,
          createdBy: {
            name: 'Điều dưỡng viên',
          },
        });
      } else {
        await MongoDbHealthBooks.model.updateOne({ customerId: params.customerId }, {
          ...healthBookCheck,
          ...params,
          ...dataChildren,
          customerId: admin._id,
          customerEmail: admin.email,
          isAcceptedHealthBook: false,
          createdBy: {
            name: 'Điều dưỡng viên',
          },
        });
      }
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const healthBook = await MongoDbHealthBooks.model.findByIdAndDelete(id);
      if (!healthBook) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async comment (req: Request, res: Response) {
    try {
      // const params = req.body;
      // const healthBookCheck = await MongoDbHealthBooks.model.findOne({ customerId: admin._id }).lean();
      // if (!healthBookCheck) {
      //   await MongoDbHealthBooks.model.create(params);
      // } else {
      //   await MongoDbHealthBooks.model.updateOne({ customerId: params.customerId }, {
      //     ...healthBookCheck,
      //     ...params,
      //   });
      // }
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async temperature (req: Request, res: Response) {
    try {
      const { date } = req.query;
      if (typeof date !== 'string') {
        throw new Error('Invalid date format');
      }
      const specificDateObj = new Date(
        date.split('/').reverse().join('-'),
      );
      const queryString: any = {
        // Sửa từ origin sang domain
        domain: req.currentAdmin.domain,
        $or: [
          { customerEmail: req.currentAdmin.email },
          { customerId: req.currentAdmin._id },
        ],
      };
      const data = await MongoDbHealthBooks.model.aggregate([
        { $match: queryString },
        {
          $addFields: {
            recordedDate: {
              $dateFromString: {
                dateString: '$recordedAt',
                format: '%d/%m/%Y',
              },
            },
          },
        },
        { $match: { recordedDate: { $lte: specificDateObj } } },
        { $sort: { recordedDate: -1 } },
        { $limit: 30 },
        { $project: { temperature: 1, recordedAt: 1, createdAt: 1 } },
      ]);
      sendSuccess(res, { data });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new HealthBookController();
