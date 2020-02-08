import { Router, Request, Response, NextFunction } from "express";
import * as mime from 'mime-types';
import * as fs from 'fs';

export const router = Router();


//

export let outStreams: fs.ReadStream[] = [];

let handler = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  url = url.split('//').join('/').split('..').join('.').split('?')[0];

  let path = `.${url}`;
  if (!fs.existsSync(path)) {
    res.status(404).send({ error: 404, message: 'requested file was not found' });
    return;
  }

  // source: https://medium.com/better-programming/video-stream-with-node-js-and-html5-320b3191a6b6
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1;
    const chunksize = (end-start)+1;
    const stream = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    stream.pipe(res);
    outStreams.push(stream);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    let stream = fs.createReadStream(path);
    stream.pipe(res);
    outStreams.push(stream);
  }
}

router.get( "/video/*", handler );
