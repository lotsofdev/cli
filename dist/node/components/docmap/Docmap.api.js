var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Docmap, { __defaults } from '@lotsof/docmap';
import { __deepMerge } from '@lotsof/sugar/object';
import { __loadConfig } from '@lotsof/config';
export default function __registerCommands(program) {
    program
        .command('docmap.build')
        .option('--outPath <path>', 'Specify the path where to output the generated docmap.json file', __defaults.build.outPath)
        .option('--outDir <dir>', 'Specify the directory where to output the generated docmaps', undefined)
        .option('--globs <globs>', 'Specify the globs to use to search for files to parse', undefined)
        .option('--mdx', 'Specify if the output have to be .mdx files or .json files when setting up the <outDir> option', false)
        .action((args) => __awaiter(this, void 0, void 0, function* () {
        const config = yield __loadConfig('docmap'), finalConfig = __deepMerge(config, args);
        const docmap = new Docmap();
        yield docmap.build(finalConfig);
    }));
}
//# sourceMappingURL=Docmap.api.js.map