var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __inquier from 'inquirer';
import ComponentGitSource from './sources/ComponentsGitSource.js';
import { __packageRootDir } from '@lotsof/sugar/path';
import { __copySync, __ensureDirSync, __existsSync, __readJsonSync, __removeSync, } from '@lotsof/sugar/fs';
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
    getSources() {
        return this._sources;
    }
    updateSources() {
        return __awaiter(this, void 0, void 0, function* () {
            // updating sources
            for (let [sourceId, source] of Object.entries(this.getSources())) {
                yield source.update();
            }
            return {
                sources: this.getSources(),
            };
        });
    }
    getPackages(sourceIds) {
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
    getComponents(sourceIds) {
        let componentsList = {};
        const packages = this.getPackages(sourceIds);
        for (let [packageName, p] of Object.entries(packages)) {
            const components = p.getComponents();
            componentsList = Object.assign(Object.assign({}, componentsList), components);
        }
        return componentsList;
    }
    addComponent(componentId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({ dir: `${__packageRootDir()}/src/components`, y: false, override: false }, (options !== null && options !== void 0 ? options : {}));
            // get components list
            const components = yield this.getComponents();
            if (!components[componentId]) {
                console.log(`Component <yellow>${componentId}</yellow> not found.`);
                return;
            }
            let component = components[componentId], componentDir = `${options.dir}/${component.name}`;
            // override
            if (options.override) {
                console.log(`<red>Overriding</red> the component "<yellow>${component.name}</yellow>"...`);
                // delete the existing component
                __removeSync(componentDir);
            }
            // check if already exists
            if (__existsSync(`${componentDir}/component.json`)) {
                if (options.y) {
                    // delete the existing component
                    __removeSync(componentDir);
                }
                else {
                    const skipResponse = yield __inquier.prompt({
                        type: 'confirm',
                        name: 'skip',
                        default: true,
                        message: `The component "${component.name}" already exists. Skip it?`,
                    });
                    if (!skipResponse.skip) {
                        const overrideResponse = yield __inquier.prompt({
                            type: 'confirm',
                            name: 'override',
                            default: false,
                            message: `Do you want to overwrite it?`,
                        });
                        if (!overrideResponse.override) {
                            const newNameResponse = yield __inquier.prompt({
                                type: 'input',
                                name: 'newName',
                                default: `${component.name}1`,
                                message: `Specify a new name for your component`,
                            });
                            componentDir = `${options.dir}/${newNameResponse.newName}`;
                            component.name = newNameResponse.newName;
                        }
                        else {
                            console.log(`Overriding the component "${component.name}"...`);
                            // delete the existing component
                            __removeSync(componentDir);
                        }
                    }
                }
            }
            // ensure the directory exists
            __ensureDirSync(options.dir);
            // copy the component to the specified directory
            __copySync(component.absPath, componentDir);
            // read the component.json file
            const componentJson = __readJsonSync(`${componentDir}/component.json`);
            // handle dependencies
            if (componentJson.dependencies) {
                const dependencies = {};
                component.dependencies = dependencies;
                for (let [dependencyId, version] of Object.entries(componentJson.dependencies)) {
                    const dependendiesRes = yield this.addComponent(dependencyId, options);
                    if (dependendiesRes) {
                        component.dependencies[dependencyId] = dependendiesRes.component;
                    }
                }
            }
            return {
                component,
            };
        });
    }
}
//# sourceMappingURL=Components.js.map