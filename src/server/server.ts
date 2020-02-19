import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const morgan = require('morgan');
const helmet = require('helmet');

const chalk = require('chalk');

import { router as pingRouter } from "./routes/ping.router";
import { router as mainRouter } from "./routes/main.router";
import { router as indexRouter } from "./routes/index.router";
import { router as apiRouter, registerApiEndpoint, sealApiEndpoints } from "./routes/api.router";
import { router as videoRouter } from "./routes/video.router";
import sockethandler from './sockethandler';
import PingApiEndpoint from './routes/api/ping.api';
import StreamApiEndpoint from './routes/api/stream.api';
import NextVideoApiEndpoint from './routes/api/nextVideo.api';
import RequestAccessEndpoint from './routes/api/requestAccess.api';
import AuthEndpoint from './routes/api/auth.api';


export let uidTokens = [];

/**
 * Do not change the order in which things get loaded / started / initialized etc.
 * Chaning the order might result in things not working the way they should.
 */
export let start = async function(port: number) {
    let app = express();

    app.use(morgan('tiny'));
    app.use(helmet());
    app.use(express.json());

    registerApiEndpoint(new PingApiEndpoint());
    registerApiEndpoint(new StreamApiEndpoint());
    registerApiEndpoint(new NextVideoApiEndpoint());
    registerApiEndpoint(new RequestAccessEndpoint());
    registerApiEndpoint(new AuthEndpoint());
    // Add new api endpoints here
    sealApiEndpoints();

    app.use(pingRouter);
    app.use(mainRouter);
    app.use(indexRouter);
    app.use(apiRouter);
    app.use(videoRouter);

    let server = http.createServer(app);
    let wss = new WebSocket.Server({ server });

    sockethandler(wss);

    server.listen(port || 9010, () => {
        console.log(`Server listening on port ${chalk.yellowBright(port || 9010)}`);
    });
}