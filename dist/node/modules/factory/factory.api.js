// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __childProcess from 'child_process';
import { __getConfig } from '@lotsof/config';
import '@lotsof/factory';
let factoryConfig;
function setup() {
    factoryConfig = __getConfig().factory;
}
export default function __registerCommands(program) {
    program.hook('preAction', () => __awaiter(this, void 0, void 0, function* () {
        setup();
    }));
    program.command('factory.start').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`▓ Start components factory...`);
        const factoryConfigStr = JSON.stringify(factoryConfig).replace(/"/g, '\\"');
        const serverProcess = __childProcess.spawn(`FACTORY_CONFIG="${factoryConfigStr}" php -S ${factoryConfig.server.hostname}:${factoryConfig.server.port} ${factoryConfig.server.entrypoint}`, [], {
            shell: true,
            cwd: process.cwd(),
            stdio: 'inherit',
        });
        function _exit() {
            serverProcess.kill();
            process.exit();
        }
        process.on('SIGINT', _exit); // catch ctrl-c
        process.on('SIGTERM', _exit); // catch kill
        console.log(' ');
    }));
}
//# sourceMappingURL=factory.api.js.map