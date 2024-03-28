var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ComponentPackage from './ComponentsPackage.js';
import ComponentGitSource from './sources/ComponentsGitSource.js';
import { __readJsonSync } from '@lotsof/sugar/fs';
import { globSync as __globSync } from 'glob';
import { homedir as __homedir } from 'os';
class Component {
    static registerSourceFromMetas(id, sourceMetas) {
        let source;
        switch (sourceMetas.type) {
            case 'git':
                source = new ComponentGitSource(sourceMetas.name, sourceMetas);
                break;
        }
        // @ts-ignore
        if (!source) {
            return;
        }
        return this.registerSource(id, source);
    }
    static registerSource(id, source) {
        source.id = id;
        this._sources[id] = source;
        return this._sources[id];
    }
    static getSources() {
        return this._sources;
    }
    static updateSources() {
        return __awaiter(this, void 0, void 0, function* () {
            // updating sources
            for (let [sourceId, source] of Object.entries(this.getSources())) {
                yield source.update();
            }
            return {};
        });
    }
    static listPackages() {
        const packages = {};
        const lotsofJsons = __globSync([
            `${this.dir}/*/lotsof.json`,
            `${this.dir}/*/*/lotsof.json`,
        ]);
        for (let [i, lotsofJsonPath] of lotsofJsons.entries()) {
            const lotsofJson = __readJsonSync(lotsofJsonPath);
            const p = new ComponentPackage(`${lotsofJsonPath.replace('/lotsof.json', '')}`);
            packages[lotsofJson.name] = p;
        }
        return packages;
    }
    static listComponents(sourceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const componentsList = {
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
        });
    }
}
Component._sources = {};
Component.dir = `${__homedir()}/.lotsof/components`;
export default Component;
//# sourceMappingURL=Components.js.map