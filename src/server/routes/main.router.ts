import { Router, Request, Response, NextFunction } from "express";
import * as mime from 'mime-types';
import * as fs from 'fs';

export const router = Router();


//

let handler = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  url = url.replace('//', '/').replace('..', '.');

  let path = `web${url}`;
  let notfound = false;
  if (!fs.existsSync(path)) {
    path = `web/pages/404.html`;
    notfound = true;
  }
  let content = fs.readFileSync(path, path.endsWith('png') ? 'Base64' : 'utf8');
  let type = mime.lookup(path);

  res.writeHead(notfound ? 404 : 200, { 'Content-Type': type });
  res.end(content, path.endsWith('png') ? 'Base64' : 'utf8');
}

router.get( "/app/*", handler );
router.get( "/assets/*", handler );
router.get( "/public/*", handler );
