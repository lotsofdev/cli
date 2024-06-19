var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentSource {
    get id() {
        return this.settings.id;
    }
    get rootDir() {
        return `${this.components.rootDir}/${this.id}`;
    }
    get components() {
        return this.settings.components;
    }
    get name() {
        return this.settings.name;
    }
    get type() {
        return this.settings.type;
    }
    constructor(settings = {}) {
        this.updated = false;
        this.settings = settings;
    }
    update() {
        return __awaiter(this, arguments, void 0, function* (updated = false) {
            var _a, _b, _c, _d;
            // set if updated or not
            this.updated = updated;
            // get the lotsof.json file from the updated component
            const lotsofJson = __readJsonSync(`${this.rootDir}/lotsof.json`);
            // check dependencies
            for (let [id, sourceSettings] of Object.entries((_b = (_a = lotsofJson.components) === null || _a === void 0 ? void 0 : _a.dependencies) !== null && _b !== void 0 ? _b : {})) {
                // if source already registered, avoid continue
                if ((_c = this.components) === null || _c === void 0 ? void 0 : _c.getSources()[id]) {
                    continue;
                }
                // register new source
                sourceSettings.id = id;
                const newSource = (_d = this.components) === null || _d === void 0 ? void 0 : _d.registerSourceFromSettings(sourceSettings);
                // updating new source
                yield (newSource === null || newSource === void 0 ? void 0 : newSource.update());
            }
            return {
                updated,
            };
        });
    }
}
//# sourceMappingURL=ComponentsSource.js.map