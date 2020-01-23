import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const morgan = require('morgan');
const helmet = require('helmet');

const chalk = require('chalk');

import { router as pingRouter } from "./routes/ping.router";
import { router as mainRouter } from "./routes/main.router";
import { router as indexRouter } from "./routes/index.router";
import sockethandler from './sockethandler';


export let uidTokens = [];

export let start = async function(port: number) {
    let app = express();

    app.use(morgan('tiny'));
    app.use(helmet());
    app.use(express.json());

    app.use(pingRouter);
    app.use(mainRouter);
    app.use(indexRouter);

    let server = http.createServer(app);
    let wss = new WebSocket.Server({ server });

    sockethandler(wss);

    server.listen(port || 9010, () => {
        console.log(`Server listening on port ${chalk.yellowBright(port || 9010)}`);
    });
}