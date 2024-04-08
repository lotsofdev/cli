var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { __parseHtml } from '@lotsof/sugar/console';
import { __dirname, __readJsonSync } from '@lotsof/sugar/fs';
import { __packageRootDir } from '@lotsof/sugar/path';
import __Components from './Components.js';
const packageRootDir = __packageRootDir(__dirname()), lotsofJson = __readJsonSync(`${packageRootDir}/lotsof.json`);
for (let [id, sourceMetas] of Object.entries((_a = lotsofJson.components) === null || _a === void 0 ? void 0 : _a.sources)) {
    __Components.registerSourceFromMetas(id, sourceMetas);
}
const nativeConsoleLog = console.log;
console.log = (...args) => {
    args.forEach((arg) => {
        if (typeof arg === 'string') {
            arg = __parseHtml(arg);
        }
        nativeConsoleLog(arg);
    });
};
export default function __registerCommands(program) {
    program.command('components.ls').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`Listing components from ${Object.keys(__Components.getSources()).length} source(s)...`);
        // list components
        const components = yield __Components.listComponents();
        for (let [componentId, component] of Object.entries(components.components)) {
            console.log(`<bgYellow> </bgYellow>   <cyan>${component.package.name}</cyan>/${component.name} (<magenta>${component.version}</magenta>)`);
        }
    }));
    program
        .command('components.add')
        .argument('<componentId>', 'Specify the component id you want to add')
        .option('--dir <path>', 'Specify the directory to install the component in', `${__packageRootDir()}/src/components`)
        .option('--override', 'Override existing components with the same name', false)
        .option('-y', 'Specify if you want to answer yes to all questions', false)
        .action((componentId, options) => __awaiter(this, void 0, void 0, function* () {
        console.log(`Adding component <yellow>${componentId}</yellow>...`);
        const res = yield _components.addComponent(componentId, options);
        function printComponent(component, level = 0) {
            if (!component) {
                return;
            }
            console.log(`<yellow>│</yellow> (<magenta>${component.version}</magenta>) <yellow>${component.package.name}/${component.name}</yellow>`);
            // console.log(
            //   `<yellow>│</yellow>      <cyan>${component.absPath}</cyan>`,
            // );
            if (component.dependencies) {
                for (let [dependencyId, dependency] of Object.entries(component.dependencies)) {
                    printComponent(dependency, level + 1);
                }
            }
        }
        console.log(`Added component(s):`);
        console.log(' ');
        printComponent(res === null || res === void 0 ? void 0 : res.component);
    }));
    program.command('components.update').action(() => __awaiter(this, void 0, void 0, function* () {
        console.log(`Updating components from <yellow>${Object.keys(__Components.getSources()).length}</yellow> source(s)...`);
        // update sources
        yield __Components.updateSources();
        console.log('Components updated <green>successfully!</green>');
    }));
}
//# sourceMappingURL=components.api.js.map