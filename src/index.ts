import VideoFileManager from "./core/videoFileManager";



const chalk = require('chalk');

const PORT = 9010;




let server = require('./server/server');

server.start(PORT);


// MongoAdapter.connect(`mongodb://127.0.0.1:27017/admin`)
//     .catch(console.error)
//     .then(() => {

//         console.info(chalk.greenBright('Connected to Mongo!'));

//         Database.init();

//         server.start(PORT);

//         Module.loadModules();

//     });