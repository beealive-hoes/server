import * as chalk from "chalk";
import * as server from "./server/server";

let config = require('../config.json');


function start() {
  console.log(chalk.green('Starting Server ...'));

  server.start(config.port);

}
start();