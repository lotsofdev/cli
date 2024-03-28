import * as __childProcess from 'child_process';
import ComponentSource from '../ComponentsSource.js';
import type {
  IComponentsGitSourceMetas,
  IComponentsSourceUpdateResult,
} from '../components.types.js';

export default class GitSource extends ComponentSource {
  private _repositoryUrl: string;

  constructor(name: string, metas: IComponentsGitSourceMetas) {
    super(name, 'git', metas.settings);
    this._repositoryUrl = metas.repository;
  }

  async update(): Promise<IComponentsSourceUpdateResult> {
    // cloning the repo
    const res = await __childProcess.spawnSync(
      `git clone ${this._repositoryUrl} ${this.dir}`,
      [],
      {
        shell: true,
      },
    );

    const output = res.output?.toString() ?? '';

    if (output.includes('already exists')) {
      console.log(
        `Updating the "<yellow>${this.id}</yellow>" source from the "<cyan>${this._repositoryUrl}</cyan>" repository...`,
      );
      // try to pull the repo
      const pullRes = await __childProcess.spawnSync(`git pull`, [], {
        cwd: this.dir,
        shell: true,
      });
      const pullOutput = pullRes.output?.toString().split(',').join('') ?? '';
      console.log(pullOutput);
    }

    return super.update();
  }
}
