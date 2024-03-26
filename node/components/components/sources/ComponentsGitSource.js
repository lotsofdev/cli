var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as __childProcess from 'child_process';
import { homedir as __homedir } from 'os';
import ComponentSource from '../ComponentsSource.js';
export default class GitSource extends ComponentSource {
    constructor(name, metas) {
        var _a;
        super(name);
        this.settings = {};
        this.settings = Object.assign({ localDir: `${__homedir()}/.lotsof/components/git` }, ((_a = metas.settings) !== null && _a !== void 0 ? _a : {}));
        this._repositoryUrl = metas.repository;
    }
    update() {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // cloning the repo
            const res = yield __childProcess.spawnSync(`git clone ${this._repositoryUrl} ${this.localDir}`, [], {
                shell: true,
            });
            const output = (_b = (_a = res.output) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
            if (output.includes('already exists')) {
                console.log(`Updating the "${this._repositoryUrl}" repository...`);
                // try to pull the repo
                const pullRes = yield __childProcess.spawnSync(`git pull`, [], {
                    cwd: this.localDir,
                    shell: true,
                });
                const pullOutput = (_d = (_c = pullRes.output) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '';
                console.log(pullOutput);
            }
            return _super.update.call(this);
        });
    }
}
//# sourceMappingURL=ComponentsGitSource.js.map