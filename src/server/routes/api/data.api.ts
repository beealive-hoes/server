import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";
import Database from "../../../database/Database";

export default class DataApiEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'post',
      'data',
      'This endpoint is for delivering data measured on the hive raspi. Data has to be in the format { "timestamp": "", "data": 0, "data2": 0, ...}. Timestamp has to be the unix timestamp in seconds of the moment the data was measured!',
      'authorized'
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    if (!req.body) {
      res.status(400).json({ success: false, error: "Invalid Request", message: "Missing Request Body" });
      return;
    }

    try {
      if (!req.body.timestamp) {
        res.status(400).json({ success: false, error: "Invalid Request", message: "Missing timestamp property" });
        return;
      }

      Database.saveData(req.body.timestamp, req.body);
      res.status(200).json({ success: true });
    } catch (ex) {
      console.error(ex);
      res.status(500).json({ success: false, error: "Internal Error", message: ex });
    }
  }

}
