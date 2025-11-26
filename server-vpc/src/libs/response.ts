import { Response } from 'express';
// import { AggregateError, ValidationError } from 'sequelize';
import { getConsoleLogger } from '@libs/consoleLogger';
// import { ServiceError } from '@grpc/grpc-js';
// import { FailValidation } from './errors';

const errorLogger = getConsoleLogger('errorLogging');
const socketOutboundLogger = getConsoleLogger('inboundLogging');
errorLogger.addContext('requestType', 'HttpLogging');
socketOutboundLogger.addContext('requestType', 'SocketLogging');

export const sendSuccess = (res: Response, data: { [key: string]: any }, message: string = '') => {
  res.status(200).json({ message, data });
};

export const sendFailed = (res: Response, message: string = '', data: { [key: string]: any } = {}) => {
  res.status(400).json({ message, data });
};

export const sendError = (res: Response, code: number, error: any, errorSubject: Error = new Error()) => {
  if (errorSubject) errorLogger.error(errorSubject);
  // if (errorSubject instanceof ValidationError) {
  //   return res.status(422).json({ error: FailValidation((errorSubject?.errors)) });
  // };
  // if (errorSubject instanceof AggregateError) {
  //   const validationErrorItems = errorSubject?.errors.map((errorGroups: any) => errorGroups.errors).map((singleError) => singleError.errors);
  //   return res.status(422).json({ error: FailValidation(validationErrorItems.flat()) });
  // }
  // if ((errorSubject as ServiceError)?.metadata?.get('code')[0] === FailValidation([]).code.toString()) {
  //   return res.status(422).json({ error: JSON.parse((errorSubject as ServiceError).details) });
  // }
  res.status(code).json({ error });
};
