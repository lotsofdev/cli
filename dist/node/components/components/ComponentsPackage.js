import { __existsSync } from '@lotsof/sugar/fs';
import { globSync as __globSync } from 'glob';
import { __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentPackage {
    get name() {
        return this.json.name;
    }
    get description() {
        var _a;
        return (_a = this.json.description) !== null && _a !== void 0 ? _a : this.name;
    }
    get rootDir() {
        return this.settings.rootDir;
    }
    get version() {
        return this.json.version;
    }
    constructor(settings) {
        this.settings = settings;
        // reading the "lotsof.json" file
        const lotsofJson = __readJsonSync(`${this.rootDir}/lotsof.json`);
        this.json = lotsofJson;
    }
    getComponents() {
        var _a;
        // reading the "lotsof.json" file
        const lotsofJson = __readJsonSync(`${this.rootDir}/lotsof.json`), componentsList = {};
        // check if we have the "components.folders" settings
        let folders = ['src/components/*'];
        if ((_a = lotsofJson.components) === null || _a === void 0 ? void 0 : _a.folders) {
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
//# sourceMappingURL=ComponentsPackage.js.map