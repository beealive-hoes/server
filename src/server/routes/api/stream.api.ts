import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

let upload = multer({ dest: 'video/' });

export default class StreamApiEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'post',
      'stream',
      'Used to upload the video file.',
      'authorized',
      upload.single('datei')
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    console.log("yeeet");
    // req.file
    (async () => {
      while (fs.existsSync('./video/delete')) {
        // to not interfere a video stack pop; see /src/core/videoFileManager.ts
        await new Promise(r => setTimeout(r, 200));
      }
  
      let id = 0;
      while (fs.existsSync(`./video/${id}.mp4`))
        id++;
  
      let from = `./video/${req.file.filename}`;
      let to = `./video/${id}.mp4`;
  
      fs.rename(from, to, () => { });
      
      res.status(200).send('Pong!');
    })();
  }

}
