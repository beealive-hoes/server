import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";

export default class PingApiEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'all',
      'ping',
      'This endpoint was created for the purpose of checking if api endpoints get loaded in properly. If you see this somewhere else than in the code that means everything works as it should. nice.',
      'public'
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    res.status(200).json({ message: 'pong', success: true, body: req.body });
  }

}
