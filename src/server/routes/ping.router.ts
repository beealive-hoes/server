import { Router, Request, Response, NextFunction } from "express";

export const router = Router();

let data = {
  status: 200,
  problems: []
};

router.get(
  "/ping",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(data.status).send(data);
  },
);
