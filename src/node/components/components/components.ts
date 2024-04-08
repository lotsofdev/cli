import __inquier from 'inquirer';

import {
  IComponent,
  IComponentGitSourceSettings,
  IComponentsAddComponentOptions,
  IComponentsAddComponentResult,
  IComponentsSettings,
  IComponentsSourceSettings,
  IComponentsSourcesUpdateResult,
} from './Components.types.js';
import ComponentSource from './ComponentsSource.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';

import { __packageRootDir } from '@lotsof/sugar/path';

import {
  __copySync,
  __ensureDirSync,
  __existsSync,
  __readJsonSync,
  __removeSync,
} from '@lotsof/sugar/fs';

import __path from 'path';

import { globSync as __globSync } from 'glob';
import ComponentPackage from './ComponentsPackage.js';

export default class Components {
  private _sources: Record<string, ComponentSource> = {};
  public settings: IComponentsSettings;

  public get rootDir(): string {
    return this.settings.rootDir;
  }

  constructor(settings: IComponentsSettings) {
    this.settings = settings;
  }

  public registerSourceFromSettings(
    settings: IComponentsSourceSettings,
  ): ComponentSource | undefined {
    let source: ComponentGitSource;
    settings.components = this;
    switch (settings.type) {
      case 'git':
        source = new ComponentGitSource(<IComponentGitSourceSettings>settings);
        break;
    }
    // @ts-ignore
    if (!source) {
      return;
    }
    return this.registerSource(source);
  }

  public registerSource(source: ComponentSource): ComponentSource {
    this._sources[source.id] = source;
    return this._sources[source.id];
  }

  public getSources(): Record<string, ComponentSource> {
    return this._sources;
  }

  public async updateSources(): Promise<IComponentsSourcesUpdateResult> {
    // updating sources
    for (let [sourceId, source] of Object.entries(this.getSources())) {
      await source.update();
    }

    return {
      sources: this.getSources(),
    };
  }

  public getPackages(sourceIds?: string[]): Record<string, ComponentPackage> {
    const packages: Record<string, ComponentPackage> = {};

    // list components in the root folder
    const lotsofJsonFiles = __globSync([
      `${this.rootDir}/*/lotsof.json`,
      `${this.rootDir}/*/*/lotsof.json`,
    ]);

    for (let [i, jsonPath] of lotsofJsonFiles.entries()) {
      const p = new ComponentPackage({
        rootDir: __path.dirname(jsonPath),
        components: this,
      });
      packages[p.name] = p;
    }

    return packages;
  }

  public getComponents(sourceIds?: string[]): Record<string, IComponent> {
    let componentsList: Record<string, IComponent> = {};

    const packages = this.getPackages(sourceIds);

    for (let [packageName, p] of Object.entries(packages)) {
      const components = p.getComponents();
      componentsList = {
        ...componentsList,
        ...components,
      };
    }

    return componentsList;
  }

  public async addComponent(
    componentId: string,
    options?: IComponentsAddComponentOptions,
  ): Promise<IComponentsAddComponentResult | undefined> {
    options = {
      dir: `${__packageRootDir()}/src/components`,
      y: false,
      override: false,
      ...(options ?? {}),
    };

    // get components list
    const components = await this.getComponents();

    if (!components[componentId]) {
      console.log(`Component <yellow>${componentId}</yellow> not found.`);
      return;
    }

    let component = components[componentId],
      componentDir = `${options.dir}/${component.name}`;

    // override
    if (options.override) {
      console.log(
        `<red>Overriding</red> the component "<yellow>${component.name}</yellow>"...`,
      );
      // delete the existing component
      __removeSync(componentDir);
    }

    // check if already exists
    if (__existsSync(`${componentDir}/component.json`)) {
      if (options.y) {
        // delete the existing component
        __removeSync(componentDir);
      } else {
        const skipResponse = await __inquier.prompt({
          type: 'confirm',
          name: 'skip',
          default: true,
          message: `The component "${component.name}" already exists. Skip it?`,
        });

        if (!skipResponse.skip) {
          const overrideResponse = await __inquier.prompt({
            type: 'confirm',
            name: 'override',
            default: false,
            message: `Do you want to overwrite it?`,
          });

          if (!overrideResponse.override) {
            const newNameResponse = await __inquier.prompt({
              type: 'input',
              name: 'newName',
              default: `${component.name}1`,
              message: `Specify a new name for your component`,
            });

            componentDir = `${options.dir}/${newNameResponse.newName}`;
            component.name = newNameResponse.newName;
          } else {
            console.log(`Overriding the component "${component.name}"...`);
            // delete the existing component
            __removeSync(componentDir);
          }
        }
      }
    }

    // ensure the directory exists
    __ensureDirSync(options.dir);

    // copy the component to the specified directory
    __copySync(component.absPath, componentDir);

    // read the component.json file
    const componentJson = __readJsonSync(`${componentDir}/component.json`);

    // handle dependencies
    if (componentJson.dependencies) {
      const dependencies: Record<string, IComponent> = {};
      component.dependencies = dependencies;

      for (let [dependencyId, version] of Object.entries(
        componentJson.dependencies,
      )) {
        const dependendiesRes = await this.addComponent(dependencyId, options);
        if (dependendiesRes) {
          component.dependencies[dependencyId] = dependendiesRes.component;
        }
      }
    }

    return {
      component,
    };
  }
}
