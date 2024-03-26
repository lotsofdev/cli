export interface IComponentSourceMetas {
  name: string;
  type: string;
}

export interface IComponentGitSourceMetas extends IComponentSourceMetas {
  repository: string;
  settings?: IGitSourceSettings;
}

export interface IComponentSource extends IComponentSourceMetas {
  metas(): IComponentSourceMetas;
  list(args: IComponentListArgs): IComponentList;
}

export interface IComponentSourceSettings {
  localDir?: string;
}

export interface IGitSourceSettings extends IComponentSourceSettings {}

export interface IComponent {
  source: string;
  path: string;
  absPath: string;
  name: string;
  description?: string;
}

export interface IComponentPackage {
  name: string;
  path: string;
}

export interface IComponentSourceUpdateResult {}

export interface IComponentList {
  sources: Record<string, IComponentSourceMetas>;
  components: Record<string, IComponent>;
}

export interface IComponentListArgs {}
