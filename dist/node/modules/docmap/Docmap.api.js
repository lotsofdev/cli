var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import __Docmap, { __defaults } from '@lotsof/docmap';
import { __diff } from '@lotsof/sugar/object';
export default function __registerCommands(program) {
    program
        .command('docmap.build')
        .option('--outPath <path>', 'Specify the path where to output the generated docmap.json file', __defaults.build.outPath)
        .option('--outDir <dir>', 'Specify the directory where to output the generated docmaps', __defaults.build.outDir)
        .option('--globs <globs>', 'Specify the globs to use to search for files to parse', __defaults.build.globs)
        .option('--save', 'Specify if you want to save the generated files', __defaults.build.save)
        .option('--mdx', 'Specify if you want to have the .json files generated when setting up the <outDir> option', __defaults.build.mdx)
        .option('--json', 'Specify if you want to have the .json files generated when setting up the <outDir> option', __defaults.build.json)
        .action((args) => __awaiter(this, void 0, void 0, function* () {
        const finalParams = __diff(__defaults.build, args, {
            added: false,
        });
        const docmap = new __Docmap();
        yield docmap.build(finalParams);
    }));
}
//# sourceMappingURL=Docmap.api.js.map