import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";
import AuthEndpoint from "./auth.api";


/**
 * @see AuthEndpoint
 */
export default class RequestAccessEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'get',
      'requestAccess',
      'Request this endpoint to recieve a token. Append this token to your client secret and perform a md5 hash on the whole to gain your access token. The recieved token is valid for 10 seconds.',
      'public'
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    res.status(200).send(req.body);
  }

}
