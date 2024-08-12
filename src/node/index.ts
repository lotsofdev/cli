#!/usr/bin/env -S node --experimental-json-modules --trace-warnings --trace-uncaught --no-warnings --es-module-specifier-resolution=node

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
console.log = (...args): void => {
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

program.hook('preAction', async () => {
  await __loadConfig();
});

// register commands
__registerDocmapCommands(program);
__registerComponentsCommands(program);
__registerFactoryCommands(program);

program.parse(process.argv);
