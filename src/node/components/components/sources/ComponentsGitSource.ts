import * as __childProcess from 'child_process';
import { homedir as __homedir } from 'os';
import ComponentSource from '../ComponentsSource.js';
import type {
  IComponentGitSourceMetas,
  IComponentSourceUpdateResult,
  IGitSourceSettings,
} from '../components.types.js';

export default class GitSource extends ComponentSource {
  private _repositoryUrl: string;

  public settings: IGitSourceSettings = {};

  constructor(name: string, metas: IComponentGitSourceMetas) {
    super(name);
    this.settings = {
      localDir: `${__homedir()}/.lotsof/components/git`,
      ...(metas.settings ?? {}),
    };
    this._repositoryUrl = metas.repository;
  }

  async update(): Promise<IComponentSourceUpdateResult> {
    // cloning the repo
    const res = await __childProcess.spawnSync(
      `git clone ${this._repositoryUrl} ${this.localDir}`,
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
        cwd: this.localDir,
        shell: true,
      });
      const pullOutput = pullRes.output?.toString().split(',').join('') ?? '';
      console.log(pullOutput);
    }

    return super.update();
  }
}
