import { __dirname, __readJsonSync } from '@lotsof/sugar/fs';
import { __packageRootDir } from '@lotsof/sugar/package';
import __Components from '@lotsof/components';

import { __getConfig } from '@lotsof/config';

// @ts-ignore
import { IComponent, IComponentsSourceSettings } from '@lotsof/components';

import { homedir as __homedir } from 'os';

let _components;

function setup() {
  // get the lotsof file path from this package to register defaults
  const packageRootDir = __packageRootDir(__dirname()),
    componentsJson = __readJsonSync(`${packageRootDir}/components.json`);

  _components = new __Components();

  for (let [id, sourceSettings] of Object.entries(componentsJson.sources)) {
    (<IComponentsSourceSettings>sourceSettings).id = id;
    _components.registerSourceFromSettings(
      <IComponentsSourceSettings>sourceSettings,
    );
  }
}

export default function __registerCommands(program: any): void {
  program.hook('preAction', async () => {
    setup();
  });

  program.command('components.sources.ls').action(async () => {
    console.log(`Listing sources...`);
    console.log(' ');

    // list components
    const sources = await _components.getSources();
    for (let [sourceName, source] of Object.entries(sources)) {
      console.log(
        `<yellow>│</yellow> <magenta>${source.type}</magenta> ${sourceName}`,
      );
    }
    console.log(' ');
  });

  program.command('components.ls').action(async () => {
    const sourcesCount = Object.keys(_components.getSources()).length;
    console.log(
      `Listing components from <yellow>${sourcesCount}</yellow> source${
        sourcesCount > 1 ? 's' : ''
      }...`,
    );

    // list components
    const components = await _components.getComponents();

    let currentPackageName = '';

    for (let [componentName, component] of Object.entries(components)) {
      if (currentPackageName !== component.package.name) {
        currentPackageName = component.package.name;
        console.log(' ');
        console.log(`<yellow>│</yellow> <cyan>${currentPackageName}</cyan>`);
      }
      console.log(`<yellow>│ -</yellow> <yellow>${component.name}</yellow>`);
    }
    console.log(' ');
  });

  program
    .command('components.add')
    .argument('<componentId>', 'Specify the component id you want to add')
    .option(
      '--dir <path>',
      'Specify the directory to install the component in',
      `${__packageRootDir()}/src/components`,
    )
    .option(
      '--override',
      'Override existing components with the same name',
      false,
    )
    .option('--engine', 'Specify the engine to use')
    .option('-y', 'Specify if you want to answer yes to all questions', false)
    .action(async (componentId, options) => {
      console.log(`Adding component <yellow>${componentId}</yellow>...`);

      // extends options with defaults
      options = {
        ...options,
        ...(__getConfig('components.defaults') ?? {}),
      };

      const res = await _components.addComponent(componentId, options);

      function printComponent(
        component: IComponent | undefined,
        level = 0,
      ): void {
        if (!component) {
          return;
        }

        console.log(
          `<yellow>│</yellow> (<magenta>${component.version}</magenta>) <yellow>${component.package.name}/${component.name}</yellow>`,
        );

        if (component.dependencies) {
          for (let [dependencyId, dependency] of Object.entries(
            component.dependencies,
          )) {
            printComponent(dependency as IComponent, level + 1);
          }
        }
      }

      if (!res) {
        return;
      }

      console.log(' ');
      console.log(
        `Added component${
          Object.keys(res.component?.dependencies).length ? 's' : ''
        }:`,
      );
      console.log(' ');

      printComponent(res?.component);
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
}
