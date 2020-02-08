
/*
 * THIS CLASS IS CURRENTLY NOT USED
 */


let config = require('../../../conf/config.json');


export default abstract class Module {

    constructor () {}

    //
    
    abstract init(): void;

    //

    public static allModules: Map<string, Module> = new Map();

    public static loadModules() {
        Module.allModules = new Map;
        for (let name of config.modules) {
            let mod = new (require(`../modules/${name}.module`).default)();
            Module.allModules.set(mod, mod);
            mod.init();
        }
    }

}