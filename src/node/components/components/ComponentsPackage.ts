import type {
  IComponent,
  IComponentsPackageMetas,
  IComponentsPackageSettings,
} from './components.types.js';

import { __existsSync } from '@lotsof/sugar/fs';

import { globSync as __globSync } from 'glob';

import { __readJsonSync } from '@lotsof/sugar/fs';

export default class ComponentPackage {
  public name: string;
  public dir: string;
  public settings: IComponentsPackageSettings;

  constructor(dir: string, settings: Partial<IComponentsPackageSettings> = {}) {
    this.dir = dir;
    this.settings = {
      ...settings,
    };

    // reading the "lotsof.json" file
    const lotsofJson = __readJsonSync(`${this.dir}/lotsof.json`);
    this.name = lotsofJson.name;
  }

  get metas(): IComponentsPackageMetas {
    return {
      dir: this.dir,
    };
  }

  listComponents(): Record<string, IComponent> {
    // reading the "lotsof.json" file
    const lotsofJson = __readJsonSync(`${this.dir}/lotsof.json`),
      componentsList: Record<string, IComponent> = {};

    // check if we have the "components.folders" settings
    let folders = ['src/components/*'];
    if (lotsofJson.components?.folders) {
      folders = lotsofJson.components.folders;
    }

    // list components
    for (let [i, path] of folders.entries()) {
      const components = __globSync(path, {
        cwd: this.dir,
      });

      for (let [j, componentPath] of components.entries()) {
        const componentJsonPath = `${this.dir}/${componentPath}/component.json`;
        // make sure e have a component.json file
        if (!__existsSync(componentJsonPath)) {
          continue;
        }
        const componentJson = __readJsonSync(componentJsonPath);
        componentJson.package = this;
        componentJson.path = componentPath;
        componentJson.absPath = `${this.dir}/${componentPath}`;
        componentsList[`${this.name}/${componentJson.name}`] = componentJson;
      }
    }

    return componentsList;
  }
}
