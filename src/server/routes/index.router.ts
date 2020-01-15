import { Router, Request, Response, NextFunction } from "express";
import * as mime from 'mime-types';
import * as fs from 'fs';

export const router = Router();


//

let handler = (req: Request, res: Response, next: NextFunction) => {
  let path = `web/app/index.html`;
  let content = fs.readFileSync(path, 'utf8');
  let type = mime.lookup(path);

  res.writeHead(200, { 'Content-Type': type });
  res.end(content, 'utf8');
}

router.get( "/", handler );
