import type {
  IComponent,
  IComponentsPackageJson,
  IComponentsPackageSettings,
} from './components.types.js';

import { __existsSync } from '@lotsof/sugar/fs';

import { globSync as __globSync } from 'glob';

import { __readJsonSync } from '@lotsof/sugar/fs';

export default class ComponentPackage {
  public settings: IComponentsPackageSettings;
  public json: IComponentsPackageJson;

  public get name(): string {
    return this.json.name;
  }

  public get description(): string {
    return this.json.description ?? this.name;
  }

  public get rootDir(): string {
    return this.settings.rootDir;
  }

  public get version(): string {
    return this.json.version;
  }

  constructor(settings: IComponentsPackageSettings) {
    this.settings = settings;

    // reading the "lotsof.json" file
    const lotsofJson = __readJsonSync(`${this.rootDir}/lotsof.json`);
    this.json = lotsofJson;
  }

  listComponents(): Record<string, IComponent> {
    // reading the "lotsof.json" file
    const lotsofJson = __readJsonSync(`${this.rootDir}/lotsof.json`),
      componentsList: Record<string, IComponent> = {};

    // check if we have the "components.folders" settings
    let folders = ['src/components/*'];
    if (lotsofJson.components?.folders) {
      folders = lotsofJson.components.folders;
    }

    // list components
    for (let [i, path] of folders.entries()) {
      const components = __globSync(path, {
        cwd: this.rootDir,
      });

      for (let [j, componentPath] of components.entries()) {
        const componentJsonPath = `${this.rootDir}/${componentPath}/component.json`;
        // make sure e have a component.json file
        if (!__existsSync(componentJsonPath)) {
          continue;
        }
        const componentJson = __readJsonSync(componentJsonPath);
        componentJson.package = this;
        componentJson.path = componentPath;
        componentJson.absPath = `${this.rootDir}/${componentPath}`;
        componentsList[`${this.name}/${componentJson.name}`] = componentJson;
      }
    }

    return componentsList;
  }
}
