import * as __childProcess from 'child_process';
import type {
  IComponentGitSourceSettings,
  IComponentsSourceUpdateResult,
} from '../components.types.js';
import ComponentSource from '../ComponentsSource.js';

export default class GitSource extends ComponentSource {
  // @ts-ignore
  public settings: IComponentGitSourceSettings;

  constructor(settings: IComponentGitSourceSettings) {
    settings.type = 'git';
    super(settings);
  }

  async update(): Promise<IComponentsSourceUpdateResult> {
    let updated = false;

    // cloning the repo
    const res = await __childProcess.spawnSync(
      `git clone ${this.settings.repository} ${this.components.rootDir}/${this.id}`,
      [],
      {
        shell: true,
      },
    );

    const output = res.output?.toString() ?? '';
    updated = !output.match(/already exists/);

    if (output.includes('already exists')) {
      // console.log(
      //   `Updating the "<yellow>${this.id}</yellow>" source from the "<cyan>${this.settings.repository}</cyan>" repository...`,
      // );

      // try to pull the repo
      const pullRes = await __childProcess.spawnSync(`git pull`, [], {
        cwd: `${this.components.rootDir}/${this.id}`,
        shell: true,
      });
      const pullOutput = pullRes.output?.toString().split(',').join('') ?? '';
      // console.log(pullOutput);

      updated = !pullOutput.match(/Already up to date/);
    }

    return super.update(!updated);
  }
}
