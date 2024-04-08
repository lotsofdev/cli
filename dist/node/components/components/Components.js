var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ComponentGitSource from './sources/ComponentsGitSource.js';
import __path from 'path';
import { globSync as __globSync } from 'glob';
import ComponentPackage from './ComponentsPackage.js';
export default class Components {
    get rootDir() {
        return this.settings.rootDir;
    }
    constructor(settings) {
        this._sources = {};
        this.settings = settings;
    }
    registerSourceFromSettings(settings) {
        let source;
        settings.components = this;
        switch (settings.type) {
            case 'git':
                source = new ComponentGitSource(settings);
                break;
        }
        // @ts-ignore
        if (!source) {
            return;
        }
        return this.registerSource(source);
    }
    registerSource(source) {
        this._sources[source.id] = source;
        return this._sources[source.id];
    }
    listSources() {
        return this._sources;
    }
    updateSources() {
        return __awaiter(this, void 0, void 0, function* () {
            // updating sources
            for (let [sourceId, source] of Object.entries(this.listSources())) {
                yield source.update();
            }
            return {
                sources: this.listSources(),
            };
        });
    }
    listPackages(sourceIds) {
        const packages = {};
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
    listComponents(sourceIds) {
        let componentsList = {};
        const packages = this.listPackages(sourceIds);
        for (let [packageName, p] of Object.entries(packages)) {
            const components = p.listComponents();
            componentsList = Object.assign(Object.assign({}, componentsList), components);
        }
        return componentsList;
    }
}
//# sourceMappingURL=Components.js.map