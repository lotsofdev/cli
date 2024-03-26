import { __parseHtml } from '@lotsof/sugar/console';
import { __dirname, __readJsonSync } from '@lotsof/sugar/fs';
import { __packageRootDir } from '@lotsof/sugar/path';
import __Components from './Components.js';
import { IComponentSourceMetas } from './components.types.js';

// get the lotsof file path from this package to register defaults
const packageRootDir = __packageRootDir(__dirname()),
  lotsofJson = __readJsonSync(`${packageRootDir}/lotsof.json`);

for (let [id, sourceMetas] of Object.entries(lotsofJson.components?.sources)) {
  __Components.registerSourceFromMetas(id, <IComponentSourceMetas>sourceMetas);
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
    console.log(
      `Listing components from ${
        Object.keys(__Components.getSources()).length
      } source(s)...`,
    );

    // list components
    const components = await __Components.listComponents();

    console.log(components);

    for (let [sourceId, source] of Object.entries(components.sources)) {
      console.log('\n');
      console.log(`<bgYellow> </bgYellow><yellow> ${sourceId} </yellow>`);

      for (let [componentId, component] of Object.entries(
        components.components,
      )) {
        // list only components from the source
        if (component.source !== sourceId) continue;

        console.log(`<bgYellow> </bgYellow>   ${component.name}`);
      }
    }
  });

  program.command('components.update').action(async () => {
    console.log(
      `Updating components from <yellow>${
        Object.keys(__Components.getSources()).length
      }</yellow> source(s)...`,
    );

    // update sources
    await __Components.updateSources();

    console.log('Components updated <green>successfully!</green>');
  });

  program
    .command('components.add <components...> ')
    .description('add one or more components into your project')
    .action((components: string[]) => {
      console.log(components);
      console.log('clone command called');
    });
}
