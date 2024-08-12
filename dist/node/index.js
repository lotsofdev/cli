#!/usr/bin/env -S node --experimental-json-modules --trace-warnings --trace-uncaught --no-warnings --es-module-specifier-resolution=node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command as __Command } from 'commander';
import __figlet from 'figlet';
import { __parseHtml } from '@lotsof/sugar/console';
// @ts-ignore
import __packageJson from '../../package.json' assert { type: 'json' };
import { __loadConfig } from '@lotsof/config';
import __registerComponentsCommands from './modules/components/Components.api.js';
import __registerDocmapCommands from './modules/docmap/Docmap.api.js';
import __registerFactoryCommands from './modules/factory/factory.api.js';
const nativeConsoleLog = console.log;
console.log = (...args) => {
    args.forEach((arg) => {
        if (typeof arg === 'string') {
            arg = __parseHtml(arg);
        }
        nativeConsoleLog(arg);
    });
};
const program = new __Command();
console.log(__figlet.textSync('Lotsof'));
program.version(__packageJson.version).description(__packageJson.description);
program.hook('preAction', () => __awaiter(void 0, void 0, void 0, function* () {
    yield __loadConfig();
}));
// register commands
__registerDocmapCommands(program);
__registerComponentsCommands(program);
__registerFactoryCommands(program);
program.parse(process.argv);
//# sourceMappingURL=index.js.map