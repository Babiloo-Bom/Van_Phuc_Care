class CustomError extends Error {
  public path: string
  message: any;
  constructor (message: string, path?: string) {
    super(message);
    this.path = path ?? '';
  }
}

export const FailValidation = (errors: any) => {
  const messages: any = {};
  errors.forEach((error: any) => {
    const path = (error.origin as unknown as CustomError)?.path || error.path;
    const message = (error.origin as unknown as CustomError)?.message || error.message;
    if (path !== null) {
      messages[path] ||= [];
    } else {
      // Handle the case where path is null
    }
    messages[path].push(message);
  });
  return {
    code: 120,
    messages,
  };
};

export const NoData = {
  code: 8,
  message: 'No data available',
};

export const InternalError = {
  code: 131,
  message: 'Internal error',
};

export const BadAuthentication = {
  code: 215,
  message: 'Bad authentication data',
};

export const FileIsNotSupport = {
  code: 305,
  message: 'The file is not in the required format',
};

export const UnableToModifyQuestion = {
  code: 370,
  message: 'Unable to modify question in used',
};

export const ExerciseReachMaxAttempts = {
  code: 386,
  message: 'Exercise reach max attempts',
};

export const Unauthorized = {
  code: 403,
  message: 'Not authorize to access this route',
};

export const InvalidPassword = {
  code: 425,
  message: 'invalid password',
};

export const InvalidOtp = {
  code: 426,
  message: 'invalid otp',
};

export const DiscountRegistered = {
  code: 427,
  message: 'You have registered to receive a discount code',
};

export const ProductRated = {
  code: 428,
  message: 'The product has been rated',
};

export const invalidParameter = {
  code: 415,
  message: 'invalid parameter',
};

export const CartEmpty = {
  code: 435,
  message: 'Cart is empty',
};

export const ServiceUnavailable = {
  code: 503,
  message: 'Service unavailable',
};

export const AccountExists = {
  code: 400,
  message: 'Account Exists',
};
