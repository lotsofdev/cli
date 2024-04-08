import type {
  IComponentsSourceMetas,
  IComponentsSourceSettings,
  IComponentsSourceUpdateResult,
} from './Components.types.js';

import __Component from './Components.js';

import { __readJsonSync } from '@lotsof/sugar/fs';

export default abstract class ComponentSource {
  public id: string = '';
  public name: string = 'Unimplementedsource';
  public type: string = 'unknown';
  public settings: IComponentsSourceSettings;

  public get dir(): string {
    return `${this.settings.rootDir}/${this.id}`;
  }

  constructor(
    name: string,
    type: string,
    settings: Partial<IComponentsSourceSettings> = {},
  ) {
    this.name = name;
    this.type = type;
    this.settings = {
      rootDir: __Component.dir,
      ...settings,
    };
  }

  get metas(): IComponentsSourceMetas {
    return {
      name: this.name,
      type: this.type,
      dir: this.dir,
    };
  }
  async update(): Promise<IComponentsSourceUpdateResult> {
    // get the lotsof.json file from the updated component
    const lotsofJson = __readJsonSync(`${this.dir}/lotsof.json`);

    // check dependencies
    for (let [id, sourceMetas] of Object.entries(
      lotsofJson.components?.dependencies ?? {},
    )) {
      // if source already registered, avoid continue
<<<<<<< Updated upstream
      if (__Component.getSources()[id]) {
=======
      if (this.components?.getSources()[id]) {
>>>>>>> Stashed changes
        continue;
      }

      // register new source
      const newSource = __Component.registerSourceFromMetas(
        id,
        <IComponentsSourceMetas>sourceMetas,
      );

      // updating new source
      await newSource?.update();
    }

    return {};
  }
}
