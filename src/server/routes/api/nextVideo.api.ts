import { ApiEndpoint } from "../api.router";
import { Request, Response, NextFunction } from "express";
import VideoFileManager from "../../../core/videoFileManager";
import { outStreams } from "../video.router";

export default class NextVideoApiEndpoint extends ApiEndpoint {

  constructor() {
    super (
      'get',
      'nextVideo',
      'When called, popps the video stack and by doing so, changes the next part of the whole video to current.mp4',
      'localhost'
    );
  }
  
  handle(req: Request, res: Response, next: NextFunction): void {
    outStreams.forEach(s => s.close());
    outStreams.splice(0, outStreams.length);
    let success = VideoFileManager.pop();
    if (success) res.status(200).send({ success: true });
    else res.status(502).send({ success: false, error: 502, message: "No new video available. Repeat cached one." });
  }

}
