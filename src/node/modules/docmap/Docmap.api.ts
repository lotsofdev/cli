import __Docmap, { TDocmapBuildParams, __defaults } from '@lotsof/docmap';
import { __diff } from '@lotsof/sugar/object';

export default function __registerCommands(program: any): void {
  program
    .command('docmap.build')
    .option(
      '--outPath <path>',
      'Specify the path where to output the generated docmap.json file',
      __defaults.build.outPath,
    )
    .option(
      '--outDir <dir>',
      'Specify the directory where to output the generated docmaps',
      __defaults.build.outDir,
    )
    .option(
      '--globs <globs>',
      'Specify the globs to use to search for files to parse',
      __defaults.build.globs,
    )
    .option(
      '--save',
      'Specify if you want to save the generated files',
      __defaults.build.save,
    )
    .option(
      '--mdx',
      'Specify if you want to have the .json files generated when setting up the <outDir> option',
      __defaults.build.mdx,
    )
    .option(
      '--json',
      'Specify if you want to have the .json files generated when setting up the <outDir> option',
      __defaults.build.json,
    )
    .action(async (args) => {
      const finalParams: TDocmapBuildParams = __diff(__defaults.build, args, {
        added: false,
      });
      const docmap = new __Docmap();
      await docmap.build(finalParams);
    });
}
