
import * as WebSocket from 'ws';
import { uidTokens } from './server';
import Module from '../core/module';

const chalk = require('chalk');


export let socketConnections: WebSocket[] = [];

export default function(socket: WebSocket.Server) {

    socket.on('connection', (ws: WebSocket, req: any) => {

        ws.on('message', message => {
            let mes = message;
            let data = '';
            if (mes.includes('=')) {
                mes = mes.split('=')[0];
                data = message.substring(mes.length + 1);
            }
            console.log(`Websocket message in. ${chalk.yellowBright(message)} - ignoring`);

            socketSend(mes, data); // TODO REMOVE
        });

        ws.on('close', () => {
            socketConnections.splice(socketConnections.indexOf(ws), 1);
        });

        socketConnections.push(ws);
    });

}

export function socketSend(key, value?) {
    if (value) key += '=' + value;
    socketConnections.forEach(s => s.send(key));
}