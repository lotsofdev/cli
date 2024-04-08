import {
  IComponent,
  IComponentGitSourceSettings,
  IComponentsSettings,
  IComponentsSourceSettings,
  IComponentsSourcesUpdateResult,
} from './components.types.js';
import ComponentSource from './ComponentsSource.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';

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

  public listSources(): Record<string, ComponentSource> {
    return this._sources;
  }

  public async updateSources(): Promise<IComponentsSourcesUpdateResult> {
    // updating sources
    for (let [sourceId, source] of Object.entries(this.listSources())) {
      await source.update();
    }

    return {
      sources: this.listSources(),
    };
  }

  public listPackages(sourceIds?: string[]): Record<string, ComponentPackage> {
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

  public listComponents(sourceIds?: string[]): Record<string, IComponent> {
    let componentsList: Record<string, IComponent> = {};

    const packages = this.listPackages(sourceIds);

    for (let [packageName, p] of Object.entries(packages)) {
      const components = p.listComponents();
      componentsList = {
        ...componentsList,
        ...components,
      };
    }

    return componentsList;
  }
}
