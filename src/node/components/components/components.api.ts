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
  });

  program.command('components.update').action(async () => {
    console.log(
      `Updating components from ${
        Object.keys(__Components.getSources()).length
      } source(s)...`,
    );

    // update sources
    await __Components.updateSources();
  });

  program
    .command('components.add <components...> ')
    .description('add one or more components into your project')
    .action((components: string[]) => {
      console.log(components);
      console.log('clone command called');
    });
}
