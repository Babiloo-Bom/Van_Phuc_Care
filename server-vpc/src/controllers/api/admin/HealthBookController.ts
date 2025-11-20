import MongoDbCustomer from '@mongodb/customers/index';
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
      if (req.currentAdmin.role !== 'manager') {
        return sendError(res, 400, NoData);
      }
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const { category, searchKey, date } = req.query;
      const queryString: any = {
        origin: req.currentAdmin.domain,
      };
      if (date) {
        queryString.$or = [
          {
            recordedAt: date,
          },
        ];
      }
      if (category) {
        Object.assign(queryString, { category });
      }
      if (searchKey) {
        Object.assign(queryString, {
          $or: [
            { name: { $regex: searchKey, $options: 'i' } },
            { customerEmail: { $regex: searchKey, $options: 'i' } },
          ],
        });
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
        origin: req.currentAdmin.domain,
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
      const healthBook = await MongoDbHealthBooks.model.findOne({
        _id: req.params.id,
        recordedAt: date,
        origin: req.currentAdmin.domain,
      }).lean();
      sendSuccess(res, { data: healthBook || {} });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async getByDate (req: Request, res: Response) {
    try {
      const { date } = req.query;
      const healthBook = await MongoDbHealthBooks.model.findOne({
        $or: [
          { customerEmail: req.params.customerId },
          { customerId: req.params.customerId },
        ],
        recordedAt: date,
        origin: req.currentAdmin.domain,
      }).lean();
      sendSuccess(res, { data: healthBook || {} });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const healthBookCheck = await MongoDbHealthBooks.model.findById(req.params.id);

      if (!healthBookCheck) {
        sendError(res, 400, NoData);
      } else {
        await healthBookCheck.update({
          ...req.body,
          origin: req.currentAdmin.domain,
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
      // const admin = await MongoDbAdmins.model.findOne({ email: params.customerEmail }).lean();
      // if (!admin) {
      //   return sendError(res, 400, { data: 'Không tìm thấy khách hàng' });
      // }
      const healthBookCheck = await MongoDbHealthBooks.model.findOne({ customerEmail: params.customerEmail, recordedAt: req.body.recordedAt }).lean();
      const customer: any = await MongoDbCustomer.model.findOne({ email: params.customerEmail }).lean();

      if (!customer) {
        return sendError(res, 400, { data: 'Không tìm thấy khách hàng' });
      }

      const dataChildren = customer.children || {};
      if(params.name){
        dataChildren.name = params.name;
      }
      if(params.dob){
        dataChildren.dob = params.dob;
      }
      if(params.gender){
        dataChildren.gender = params.gender;
      }
      if (!healthBookCheck) {
        await MongoDbHealthBooks.model.create({
          ...params,
          ...dataChildren,
          isAcceptedHealthBook: false,
          customerId: customer._id,
        });
      } else {
        await MongoDbHealthBooks.model.updateOne({ customerId: customer._id }, {
          ...healthBookCheck,
          ...params,
          ...dataChildren,
          isAcceptedHealthBook: false,
        });
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
      // eslint-disable-next-line
        date.split('/').reverse().join('-'),
      );
      const queryString: any = {
        origin: req.currentAdmin.domain,
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
        { $sort: { recordedDate: -1 } }, // Sort in descending order to get the latest records first
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
