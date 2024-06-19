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
import __Components from '@lotsof/components';
import { __getConfig } from '@lotsof/config';
let _components;
function setup() {
    // get the lotsof file path from this package to register defaults
    const packageRootDir = __packageRootDir(__dirname()), componentsJson = __readJsonSync(`${packageRootDir}/components.json`);
    _components = new __Components();
    for (let [id, sourceSettings] of Object.entries(componentsJson.sources)) {
        sourceSettings.id = id;
        _components.registerSourceFromSettings(sourceSettings);
    }
}
export default function __registerCommands(program) {
    program.hook('preAction', () => __awaiter(this, void 0, void 0, function* () {
        setup();
    }));
    program.command('components.sources.ls').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`Listing sources...`);
        console.log(' ');
        // list components
        const sources = yield _components.getSources();
        for (let [sourceName, source] of Object.entries(sources)) {
            console.log(`<yellow>│</yellow> <magenta>${source.type}</magenta> ${sourceName}`);
        }
        console.log(' ');
    }));
    program.command('components.ls').action(() => __awaiter(this, void 0, void 0, function* () {
        const sourcesCount = Object.keys(_components.getSources()).length;
        console.log(`Listing components from <yellow>${sourcesCount}</yellow> source${sourcesCount > 1 ? 's' : ''}...`);
        // list components
        const components = yield _components.getComponents();
        let currentPackageName = '';
        for (let [componentName, component] of Object.entries(components)) {
            if (currentPackageName !== component.package.name) {
                currentPackageName = component.package.name;
                console.log(' ');
                console.log(`<yellow>│</yellow> <cyan>${currentPackageName}</cyan>`);
            }
            console.log(`<yellow>│ -</yellow> <yellow>${component.name}</yellow>`);
        }
        console.log(' ');
    }));
    program
        .command('components.add')
        .argument('<componentId>', 'Specify the component id you want to add')
        .option('--dir <path>', 'Specify the directory to install the component in', `${__packageRootDir()}/src/components`)
        .option('--override', 'Override existing components with the same name', false)
        .option('--engine', 'Specify the engine to use')
        .option('-y', 'Specify if you want to answer yes to all questions', false)
        .action((componentId, options) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log(`Adding component <yellow>${componentId}</yellow>...`);
        // extends options with defaults
        options = Object.assign(Object.assign({}, options), ((_a = __getConfig('components.defaults')) !== null && _a !== void 0 ? _a : {}));
        const res = yield _components.addComponent(componentId, options);
        function printComponent(component, level = 0) {
            if (!component) {
                return;
            }
            console.log(`<yellow>│</yellow> (<magenta>${component.version}</magenta>) <yellow>${component.package.name}/${component.name}</yellow>`);
            if (component.dependencies) {
                for (let [dependencyId, dependency] of Object.entries(component.dependencies)) {
                    printComponent(dependency, level + 1);
                }
            }
        }
        if (!res) {
            return;
        }
        console.log(' ');
        console.log(`Added component${Object.keys((_b = res.component) === null || _b === void 0 ? void 0 : _b.dependencies).length ? 's' : ''}:`);
        console.log(' ');
        printComponent(res === null || res === void 0 ? void 0 : res.component);
    }));
    program.command('components.update').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`Start updating components...`);
        console.log(' ');
        // update sources
        const result = yield _components.updateSources();
        let updatedSourcesCount = 0;
        for (let [sourceId, source] of Object.entries(result.sources)) {
            console.log(`<yellow>│</yellow> - ${source.updated ? '<green>' : ''}${source.id}${source.updated ? '</green>' : ''}`);
            updatedSourcesCount += source.updated ? 1 : 0;
        }
        const sourcesCount = Object.keys(result.sources).length;
        console.log(' ');
        console.log(`Total sources   : <yellow>${sourcesCount}</yellow>`);
        console.log(`Updated sources : <green>${updatedSourcesCount}</green>`);
        console.log(' ');
    }));
}
//# sourceMappingURL=Components.api.js.map