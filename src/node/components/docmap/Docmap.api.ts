import Docmap, { __defaults } from '@lotsof/docmap';
import { __packageRootDir } from '@lotsof/sugar/package';

import { __deepMerge } from '@lotsof/sugar/object';

import { __getConfig, __loadConfig } from '@lotsof/config';

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
      undefined,
    )
    .option(
      '--globs <globs>',
      'Specify the globs to use to search for files to parse',
      undefined,
    )
    .action(async (args) => {
      const config = await __loadConfig('docmap'),
        finalConfig = __deepMerge(config, args);
      const docmap = new Docmap();
      await docmap.build(finalConfig);
    });
}
