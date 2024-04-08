import { __parseHtml } from '@lotsof/sugar/console';
import { __dirname, __readJsonSync } from '@lotsof/sugar/fs';
import { __packageRootDir } from '@lotsof/sugar/path';
import __Components from './Components.js';
import { IComponentsSourceSettings } from './components.types.js';

import { homedir as __homedir } from 'os';

// get the lotsof file path from this package to register defaults
const packageRootDir = __packageRootDir(__dirname()),
  lotsofJson = __readJsonSync(`${packageRootDir}/lotsof.json`);

const _components = new __Components({
  rootDir: `${__homedir()}/.lotsof/components`,
});

for (let [id, sourceSettings] of Object.entries(
  lotsofJson.components?.sources,
)) {
  (<IComponentsSourceSettings>sourceSettings).id = id;
  _components.registerSourceFromSettings(
    <IComponentsSourceSettings>sourceSettings,
  );
}

const nativeConsoleLog = console.log;
console.log = (...args): void => {
  args.forEach((arg) => {
    if (typeof arg === 'string') {
      arg = __parseHtml(arg);
    }
    nativeConsoleLog(arg);
  });
};

export default function __registerCommands(program: any): void {
  program.command('components.ls').action(async () => {
    const sourcesCount = Object.keys(_components.listSources()).length;
    console.log(
      `Listing components from <yellow>${sourcesCount}</yellow> source${
        sourcesCount > 1 ? 's' : ''
      }...`,
    );

    // list components
    const components = await _components.listComponents();

    let currentPackageName = '';

    for (let [componentName, component] of Object.entries(components)) {
      if (currentPackageName !== component.package.name) {
        currentPackageName = component.package.name;
        console.log(' ');
        console.log(
          `<yellow>│</yellow> ${'-'.repeat(process.stdout.columns - 2)}`,
        );
        console.log(
          `<yellow>│</yellow> (<magenta>${component.package.version}</magenta>) <cyan>${currentPackageName}</cyan>`,
        );
        console.log(
          `<yellow>│</yellow> ${'-'.repeat(process.stdout.columns - 2)}`,
        );
      }
      console.log(
        `<yellow>│</yellow> (<magenta>${component.version}</magenta>) <yellow>${component.name}</yellow>`,
      );
    }
    console.log(' ');
  });

  program.command('components.update').action(async () => {
    console.log(`Start updating components...`);
    console.log(' ');

    // update sources
    const result = await _components.updateSources();

    let updatedSourcesCount = 0;

    for (let [sourceId, source] of Object.entries(result.sources)) {
      console.log(
        `<yellow>│</yellow> - ${source.updated ? '<green>' : ''}${source.id}${
          source.updated ? '</green>' : ''
        }`,
      );
      updatedSourcesCount += source.updated ? 1 : 0;
    }
    const sourcesCount = Object.keys(result.sources).length;
    console.log(' ');
    console.log(`Total sources   : <yellow>${sourcesCount}</yellow>`);
    console.log(`Updated sources : <green>${updatedSourcesCount}</green>`);
    console.log(' ');
  });

  program
    .command('components.add <components...> ')
    .description('add one or more components into your project')
    .action((components: string[]) => {
      console.log(components);
      console.log('clone command called');
    });
}
