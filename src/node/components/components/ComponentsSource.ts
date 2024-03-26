import type {
  IComponent,
  IComponentSourceMetas,
  IComponentSourceSettings,
  IComponentSourceUpdateResult,
} from './components.types.js';

import { __existsSync } from '@lotsof/sugar/fs';

import __Component from './Components.js';

import { globSync as __globSync } from 'glob';

import { __readJsonSync } from '@lotsof/sugar/fs';

export default abstract class ComponentSource {
  public id: string = '';
  public name: string = 'Unimplementedsource';
  public settings: IComponentSourceSettings = {};

  public get localDir(): string {
    return `${this.settings.localDir}/${this.id}`;
  }

  constructor(name: string, settings: IComponentSourceSettings = {}) {
    this.name = name;
    this.settings = {
      ...settings,
    };
  }

  get metas(): IComponentSourceMetas {
    return {
      name: this.name,
      type: 'unknown',
    };
  }
  async update(): Promise<IComponentSourceUpdateResult> {
    // get the lotsof.json file from the updated component
    const lotsofJson = __readJsonSync(`${this.localDir}/lotsof.json`);

    // check dependencies
    for (let [id, sourceMetas] of Object.entries(
      lotsofJson.components?.dependencies ?? {},
    )) {
      // if source already registered, avoid continue
      if (__Component.getSources()[id]) {
        continue;
      }

      // register new source
      const newSource = __Component.registerSourceFromMetas(
        id,
        <IComponentSourceMetas>sourceMetas,
      );

      // updating new source
      await newSource?.update();
    }

    return {};
  }

  listComponents(): any {
    // reading the "lotsof.json" file
    const lotsofJson = __readJsonSync(`${this.localDir}/lotsof.json`),
      componentsList: Record<string, IComponent> = {};

    // check if we have the "components.folders" settings
    let folders = ['src/components/*'];
    if (lotsofJson.components?.folders) {
      folders = lotsofJson.components.folders;
    }

    // list components
    for (let [i, path] of folders.entries()) {
      const components = __globSync(path, {
        cwd: this.localDir,
      });

      for (let [j, componentPath] of components.entries()) {
        const componentJsonPath = `${this.localDir}/${componentPath}/component.json`;
        // make sure e have a component.json file
        if (!__existsSync(componentJsonPath)) {
          continue;
        }
        const componentJson = __readJsonSync(componentJsonPath);
        componentJson.source = this.id;
        componentJson.path = componentPath;
        componentJson.absPath = `${this.localDir}/${componentPath}`;
        componentsList[`${this.id}/${componentJson.name}`] = componentJson;
      }
    }

    return componentsList;
  }
}
