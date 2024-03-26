var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __existsSync } from '@lotsof/sugar/fs';
import __Component from './Components.js';
import { globSync as __globSync } from 'glob';
import { __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentSource {
    get localDir() {
        return `${this.settings.localDir}/${this.id}`;
    }
    constructor(name, settings = {}) {
        this.id = '';
        this.name = 'Unimplementedsource';
        this.settings = {};
        this.name = name;
        this.settings = Object.assign({}, settings);
    }
    get metas() {
        return {
            name: this.name,
            type: 'unknown',
        };
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // get the lotsof.json file from the updated component
            const lotsofJson = __readJsonSync(`${this.localDir}/lotsof.json`);
            // check dependencies
            for (let [id, sourceMetas] of Object.entries((_b = (_a = lotsofJson.components) === null || _a === void 0 ? void 0 : _a.dependencies) !== null && _b !== void 0 ? _b : {})) {
                // if source already registered, avoid continue
                if (__Component.getSources()[id]) {
                    continue;
                }
                // register new source
                const newSource = __Component.registerSourceFromMetas(id, sourceMetas);
                // updating new source
                yield (newSource === null || newSource === void 0 ? void 0 : newSource.update());
            }
            return {};
        });
    }
    listComponents() {
        var _a;
        // reading the "lotsof.json" file
        const lotsofJson = __readJsonSync(`${this.localDir}/lotsof.json`), componentsList = {};
        // check if we have the "components.folders" settings
        let folders = ['src/components/*'];
        if ((_a = lotsofJson.components) === null || _a === void 0 ? void 0 : _a.folders) {
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
//# sourceMappingURL=ComponentsSource.js.map