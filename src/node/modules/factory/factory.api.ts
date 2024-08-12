// @ts-nocheck

import __childProcess from 'child_process';

import type { IFactoryConfig } from '@lotsof/factory';

import { __getConfig } from '@lotsof/config';

import { IComponentsConfig } from '@lotsof/components';
import '@lotsof/factory';

let factoryConfig: IFactoryConfig, componentsConfig: IComponentsConfig;

function setup() {
  factoryConfig = __getConfig().factory;
  componentsConfig = __getConfig().components;
}

export default function __registerCommands(program: any): void {
  program.hook('preAction', async () => {
    setup();
  });

  program.command('factory.start').action(async () => {
    console.log(`▓ Start components factory...`);

    const factoryConfigStr = JSON.stringify(factoryConfig).replace(/"/g, '\\"');
    const serverProcess = __childProcess.spawn(
      `FACTORY_CONFIG="${factoryConfigStr}" php -S ${factoryConfig.server.hostname}:${factoryConfig.server.port} ${factoryConfig.server.entrypoint}`,
      [],
      {
        shell: true,
        cwd: process.cwd(),
        stdio: 'inherit',
      },
    );

    function _exit() {
      serverProcess.kill();
      process.exit();
    }
    process.on('SIGINT', _exit); // catch ctrl-c
    process.on('SIGTERM', _exit); // catch kill

    console.log(' ');
  });
}
