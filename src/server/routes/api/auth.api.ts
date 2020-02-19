import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";
import RequestAccessEndpoint from "./requestAccess.api";


/**
 * @see RequestAccessEndpoint
 */
export default class AuthEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'post',
      'auth',
      'Perform a post request with your \'Authorization\' header set to the generated secret as described in the /api/requestAccess endpoint description. NAH NAH NAH WE CANT DO IT THAT WAY',
      'public'
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    res.status(200).send(req.body);
  }

}
