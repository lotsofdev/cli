var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __Component from './Components.js';
import { __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentSource {
    get dir() {
        return `${this.settings.rootDir}/${this.id}`;
    }
    constructor(name, type, settings = {}) {
        this.id = '';
        this.name = 'Unimplementedsource';
        this.type = 'unknown';
        this.name = name;
        this.type = type;
        this.settings = Object.assign({ rootDir: __Component.dir }, settings);
    }
    get metas() {
        return {
            name: this.name,
            type: this.type,
            dir: this.dir,
        };
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // get the lotsof.json file from the updated component
            const lotsofJson = __readJsonSync(`${this.dir}/lotsof.json`);
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
}
//# sourceMappingURL=ComponentsSource.js.map