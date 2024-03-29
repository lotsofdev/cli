#!/usr/bin/env -S node --experimental-json-modules --trace-warnings --trace-uncaught --no-warnings --es-module-specifier-resolution node
import { Command as __Command } from 'commander';
import __figlet from 'figlet';
// @ts-ignore
import __packageJson from '../../package.json' assert { type: 'json' };
import __registerComponentsCommands from './components/components/components.api.js';
const program = new __Command();
console.log(__figlet.textSync('Lotsof'));
program.version(__packageJson.version).description(__packageJson.description);
// components
__registerComponentsCommands(program);
program.parse(process.argv);
const options = program.opts();
//# sourceMappingURL=index.js.map