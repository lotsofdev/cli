import ComponentPackage from './ComponentsPackage.js';

export interface IComponentsSourceMetas {
  name: string;
  type: string;
  dir: string;
}

export interface IComponentsGitSourceMetas extends IComponentsSourceMetas {
  repository: string;
  settings?: IComponentGitSourceSettings;
}

export interface IComponentSource extends IComponentsSourceMetas {
  metas(): IComponentsSourceMetas;
  list(args: IComponentsListArgs): IComponentsList;
}

export interface IComponentsSourceSettings {
  rootDir: string;
}

export interface IComponentGitSourceSettings
  extends IComponentsSourceSettings {}

export interface IComponentsPackageSettings {}

export interface IComponentsPackageMetas {
  dir: string;
}

export interface IComponent {
  version: string;
  name: string;
  description?: string;
  package: ComponentPackage;
  path: string;
  absPath: string;
}

export interface IComponentPackage {
  name: string;
  path: string;
}

export interface IComponentsSourceUpdateResult {}

export interface IComponentsList {
  sources: Record<string, IComponentsSourceMetas>;
  packages: Record<string, ComponentPackage>;
  components: Record<string, IComponent>;
}

export interface IComponentsListArgs {}
