import {
  IComponentGitSourceMetas,
  IComponentList,
  IComponentSourceMetas,
  IComponentSourceUpdateResult,
} from './components.types.js';
import ComponentSource from './ComponentsSource.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';

export default class Component {
  private static _sources: Record<string, ComponentSource> = {};

  static registerSourceFromMetas(
    id: string,
    sourceMetas: IComponentSourceMetas,
  ): ComponentSource | undefined {
    let source: ComponentGitSource;
    switch (sourceMetas.type) {
      case 'git':
        source = new ComponentGitSource(
          sourceMetas.name,
          sourceMetas as IComponentGitSourceMetas,
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

  static async updateSources(): Promise<IComponentSourceUpdateResult> {
    // updating sources
    for (let [sourceId, source] of Object.entries(this.getSources())) {
      await source.update();
    }

    return {};
  }

  static async listComponents(sourceIds?: string[]): Promise<IComponentList> {
    const componentsList: IComponentList = {
      sources: {},
      components: {},
    };

    // list components from source
    for (let [sourceId, source] of Object.entries(this.getSources())) {
      // filter if needed
      if (sourceIds && !sourceIds.includes(sourceId)) {
        continue;
      }

      componentsList.sources[sourceId] = source.metas;
      componentsList.components = await source.listComponents();
    }

    return componentsList;
  }

  static listComponentsFromSource(sourceId: string): any {
    if (!this._sources[sourceId]) {
      throw new Error(
        `The requested source "${sourceId}" does not exists. Here's the list of available sources:\n-${Object.keys(
          this._sources,
        ).join('\n-')}`,
      );
    }
  }
}
