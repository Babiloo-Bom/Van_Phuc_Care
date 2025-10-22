import Parameters from "@libs/parameters";

declare global {
  namespace Express {
    interface Request {
      parameters: Parameters<any>;
      currentUser: any;
      currentAdmin: any;
    }
  }
}
