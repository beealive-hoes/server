import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as chalk from "chalk";
import * as morgan from "morgan";
import * as helmet from "helmet";

import { router as pingRouter } from "./routes/ping.router";
import { router as mainRouter } from "./routes/main.router";
import { router as indexRouter } from "./routes/index.router";
import { router as apiRouter, registerApiEndpoint, sealApiEndpoints } from "./routes/api.router";
import { router as videoRouter } from "./routes/video.router";
import sockethandler from './sockethandler';
import PingApiEndpoint from './routes/api/ping.api';
import StreamApiEndpoint from './routes/api/stream.api';
import NextVideoApiEndpoint from './routes/api/nextVideo.api';
import DataApiEndpoint from './routes/api/data.api';


export const uidTokens = [];

/**
 * Do not change the order in which things get loaded / started / initialized etc.
 * Chaning the order might result in things not working the way they should.
 */
export const start = async function (port: number) {
  console.log(chalk.yellowBright('Starting Server ...'));

  const app = express();

  app.use(morgan('tiny'));
  app.use(helmet());
  app.use(express.json());

  registerApiEndpoint(new PingApiEndpoint());
  registerApiEndpoint(new NextVideoApiEndpoint());
  registerApiEndpoint(new StreamApiEndpoint());
  registerApiEndpoint(new DataApiEndpoint());
  // Add new api endpoints here
  sealApiEndpoints();

  app.use(pingRouter);
  app.use(mainRouter);
  app.use(indexRouter);
  app.use('/api', apiRouter);
  app.use(videoRouter);

  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  sockethandler(wss);

  server.listen(port || 9010, () => {
    console.log(chalk.greenBright(`Server listening on port ${chalk.black.bgGreenBright(` ${port || 9010} `)}`)
              + chalk.gray(`   http://127.0.0.1:${port || 9010}/`));
  });
}