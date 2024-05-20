#!/usr/bin/env -S node --experimental-json-modules --trace-warnings --trace-uncaught --no-warnings --es-module-specifier-resolution node
import { Command as __Command } from 'commander';
import __figlet from 'figlet';
import { __parseHtml } from '@lotsof/sugar/console';
// @ts-ignore
import __packageJson from '../../package.json' assert { type: 'json' };
import __registerComponentsCommands from './components/components/Components.api.js';
import __registerDocmapCommands from './components/docmap/Docmap.api.js';
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
// docmap
__registerDocmapCommands(program);
// components
__registerComponentsCommands(program);
program.parse(process.argv);
const options = program.opts();
//# sourceMappingURL=index.js.map