import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";

export default class DataApiEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'post',
      'data',
      'This endpoint id for delivering data measured on the hive raspi. Data has to be in the format { "time": "", "data": [ {"type": "", "value": ""}, ... ]}. Time has to be the unix timestamp of very moment the data was measured!',
      'authorized'
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    if (!req.body) {
      res.status(400).send({ success: false, error: "Invalid Request", message: "Missing Request Body" });
      return;
    }

    try {
      const time = new Date(parseInt(req.body.time));
      const data = req.body.data as { type: string, value: string }[];
      
    } catch (ex) {
      console.error(ex);
      res.status(500).send({ success: false, error: "Internal Error", message: ex });
    }
  }

}
