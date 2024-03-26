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
    static listComponents(sourceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const componentsList = {
                sources: {},
                components: {},
            };
            // list components from source
            for (let [sourceId, source] of Object.entries(this.getSources())) {
                // filter if needed
                if (sourceIds && !sourceIds.includes(sourceId)) {
                    continue;
                }
                componentsList.sources[sourceId] = source.metas;
                componentsList.components = yield source.listComponents();
            }
            return componentsList;
        });
    }
    static listComponentsFromSource(sourceId) {
        if (!this._sources[sourceId]) {
            throw new Error(`The requested source "${sourceId}" does not exists. Here's the list of available sources:\n-${Object.keys(this._sources).join('\n-')}`);
        }
    }
}
Component._sources = {};
export default Component;
//# sourceMappingURL=Components.js.map