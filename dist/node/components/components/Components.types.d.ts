import Components from './Components.js';
import ComponentsPackage from './ComponentsPackage.js';
import ComponentsSource from './ComponentsSource.js';
export interface IComponentsSourceMetas {
}
export interface IComponentsSourceSettings {
    id: string;
    name: string;
    type: 'git';
    components: Components;
}
export interface IComponentGitSourceSettings extends IComponentsSourceSettings {
    repository: string;
}
export interface IComponentsPackageJson {
    version: string;
    name: string;
    description?: string;
}
export interface IComponentsPackageSettings {
    rootDir: string;
    components: Components;
}
export interface IComponentJson {
    version: string;
    name: string;
    description?: string;
    dependencies?: Record<string, string | IComponent>;
}
export interface IComponent extends IComponentJson {
    package: ComponentsPackage;
    path: string;
    absPath: string;
}
export interface IComponentsSettings {
    rootDir: string;
}
export interface IComponentsSourceUpdateResult {
    updated: boolean;
}
export interface IComponentsSourcesUpdateResult {
    sources: Record<string, ComponentsSource>;
}
export interface IComponentsAddComponentOptions {
    dir: string;
    y: boolean;
    override: boolean;
}
export interface IComponentsAddComponentResult {
    component: IComponent;
}
