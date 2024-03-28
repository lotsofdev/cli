import {
  IComponentsGitSourceMetas,
  IComponentsList,
  IComponentsSourceMetas,
  IComponentsSourceUpdateResult,
} from './components.types.js';
import ComponentPackage from './ComponentsPackage.js';
import ComponentSource from './ComponentsSource.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';

import { __readJsonSync } from '@lotsof/sugar/fs';

import { globSync as __globSync } from 'glob';

import { homedir as __homedir } from 'os';

export default class Component {
  private static _sources: Record<string, ComponentSource> = {};
  public static dir: string = `${__homedir()}/.lotsof/components`;

  static registerSourceFromMetas(
    id: string,
    sourceMetas: IComponentsSourceMetas,
  ): ComponentSource | undefined {
    let source: ComponentGitSource;
    switch (sourceMetas.type) {
      case 'git':
        source = new ComponentGitSource(
          sourceMetas.name,
          sourceMetas as IComponentsGitSourceMetas,
        );
        break;
    }
    // @ts-ignore
    if (!source) {
      return;
    }
    return this.registerSource(id, source);
  }

  static registerSource(id: string, source: ComponentSource): ComponentSource {
    source.id = id;
    this._sources[id] = source;
    return this._sources[id];
  }

  static getSources(): Record<string, ComponentSource> {
    return this._sources;
  }

  static async updateSources(): Promise<IComponentsSourceUpdateResult> {
    // updating sources
    for (let [sourceId, source] of Object.entries(this.getSources())) {
      await source.update();
    }

    return {};
  }

  static listPackages(): Record<string, ComponentPackage> {
    const packages: Record<string, ComponentPackage> = {};
    const lotsofJsons = __globSync([
      `${this.dir}/*/lotsof.json`,
      `${this.dir}/*/*/lotsof.json`,
    ]);

    for (let [i, lotsofJsonPath] of lotsofJsons.entries()) {
      const lotsofJson = __readJsonSync(lotsofJsonPath);

      const p = new ComponentPackage(
        `${lotsofJsonPath.replace('/lotsof.json', '')}`,
      );
      packages[lotsofJson.name] = p;
    }

    return packages;
  }

  static async listComponents(sourceIds?: string[]): Promise<IComponentsList> {
    const componentsList: IComponentsList = {
      sources: this.getSources(),
      packages: this.listPackages(),
      components: {},
    };

    const packages = this.listPackages();
    for (let [packageName, packageObj] of Object.entries(packages)) {
      const components = packageObj.listComponents();
      for (let [componentId, component] of Object.entries(components)) {
        componentsList.components[`${packageName}/${component.name}`] =
          component;
      }
    }

    return componentsList;
  }
}
