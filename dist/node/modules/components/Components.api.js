var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __dirname, __readJsonSync } from '@lotsof/sugar/fs';
import { __packageRootDir } from '@lotsof/sugar/package';
import { __getConfig } from '@lotsof/config';
// @ts-ignore
import __Components from '@lotsof/components';
let _components;
function setup() {
    var _a;
    // init a new components instance
    _components = new __Components();
    // get the lotsof file path from this package to register defaults
    const packageRootDir = __packageRootDir(__dirname()), componentsJson = __readJsonSync(`${packageRootDir}/components.json`);
    for (let [name, librarySettings] of Object.entries((_a = componentsJson.libraries) !== null && _a !== void 0 ? _a : {})) {
        librarySettings.name = name;
        _components.registerLibraryFromSettings(librarySettings);
    }
}
export default function __registerCommands(program) {
    program.hook('preAction', () => __awaiter(this, void 0, void 0, function* () {
        setup();
    }));
    program.command('components.libraries.ls').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`▓ Listing libraries...`);
        // list components
        const libraries = yield _components.getLibraries();
        for (let [libraryName, library] of Object.entries(libraries)) {
            console.log(`│ <cyan>${libraryName}</cyan>`);
        }
        console.log(' ');
    }));
    program.command('components.ls').action(() => __awaiter(this, void 0, void 0, function* () {
        const librariesCount = Object.keys(_components.getLibraries()).length;
        console.log(`▓ Listing components from <yellow>${librariesCount}</yellow> librar${librariesCount > 1 ? 'ies' : 'y'}...`);
        // list components
        const components = yield _components.getComponents();
        let currentPackageName = '';
        for (let [componentName, component] of Object.entries(components)) {
            if (currentPackageName !== component.library.name) {
                currentPackageName = component.library.name;
                console.log(`│ <cyan>${currentPackageName}</cyan>`);
            }
            console.log(`│ - <yellow>${component.name}</yellow> <grey>${component.description}</grey>`);
        }
        console.log(' ');
    }));
    program
        .command('components.add')
        .argument('<componentId>', 'Specify the component id you want to add')
        .option('--dir <path>', 'Specify the directory to install the component in', `${__packageRootDir()}/src/components`)
        .option('--name <name>', 'Specify a name for the component')
        .option('--engine', 'Specify the engine to use')
        .option('-y', 'Specify if you want to answer yes to all questions', false)
        .action((componentId, options) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log(`▓ Adding component <yellow>${componentId}</yellow>...`);
        // extends options with defaults
        options = Object.assign(Object.assign({}, options), ((_a = __getConfig('components.defaults')) !== null && _a !== void 0 ? _a : {}));
        const res = yield _components.addComponent(componentId, options);
        function printComponent(component) {
            var _a, _b;
            if (!component) {
                return;
            }
            console.log(`│ <yellow>${
            // @ts-ignore
            (_b = (_a = component.component) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : component.name}</yellow> <magenta>${component.version}</magenta>`);
            // @ts-ignore
            if (component.dependencies) {
                for (let [dependencyId, dependency] of Object.entries(
                // @ts-ignore
                component.dependencies)) {
                    console.log(
                    // @ts-ignore
                    `│ - <cyan>${dependency.type}</cyan> <yellow>${dependency.name}</yellow> <magenta>${component.version}</magenta>`);
                }
            }
        }
        if (!res) {
            return;
        }
        console.log(' ');
        console.log(`▓ Added component${Object.keys(res.addedComponents).length ? 's' : ''}:`);
        for (let [componentName, component] of Object.entries(res.addedComponents)) {
            printComponent(component);
        }
    }));
    program.command('components.update').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`▓ Start updating components libraries...`);
        // update sources
        const result = yield _components.updateLibraries();
        let updatedSourcesCount = 0;
        console.log('│ ');
        console.log(`▓ Librarie${Object.entries(result.libraries).length ? 's' : ''} updated:`);
        for (let [libraryName, library] of Object.entries(result.libraries)) {
            console.log(`│ - ${library.updated ? '<green>' : ''}${library.name}${library.updated ? '</green>' : ''}`);
            updatedSourcesCount += library.updated ? 1 : 0;
        }
        const sourcesCount = Object.keys(result.libraries).length;
        console.log('│');
        console.log(`▓ Total sources   : <yellow>${sourcesCount}</yellow>`);
        console.log(`▓ Updated sources : <green>${updatedSourcesCount}</green>`);
    }));
}
//# sourceMappingURL=Components.api.js.map