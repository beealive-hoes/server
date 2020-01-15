

let config = require('../../../conf/config.json');


export default abstract class Module {

    constructor () {}

    //
    
    abstract init(): void;

    //

    public static allModules: Module[] = [];

    public static loadModules() {
        Module.allModules = [];
        for (let name of config.modules) {
            let mod = new (require(`../modules/${name}.module`).default)();
            Module.allModules.push(mod);
            mod.init();
        }
    }

}