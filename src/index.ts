import * as chalk from "chalk";
import * as server from "./server/server";
import Database from "./database/Database";

let config = require('../config.json');


async function start() {
  
  await Database.connect(config.mysql);

  await server.start(config.port);


}
start();