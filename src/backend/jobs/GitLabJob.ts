import BaseJob from '../BaseJob';
import config from '../config.service';
import GitLabClient from '../api/GitLabClient';
import { ICfgGitLab } from '../types/GitLab';

export default class GitLabJob extends BaseJob {
  private readonly cfg?: ICfgGitLab;

  name = 'gitlab-projectinfo';

  constructor() {
    super();
    const cfgBackend = config.getTyped('backend');
    if (cfgBackend.gitlab?.config) {
      this.cfg = cfgBackend.gitlab;
    }
  }

  isEnabled = () => (this.cfg?.config !== undefined);

  getSchedule = () => (this.cfg ? this.cfg.jobSchedule : null);

  doWork = async () => {
    if (!this.cfg?.config) {
      return Promise.resolve([]);
    }
    const { endpoint, api, token } = this.cfg.config;
    const gl = new GitLabClient(endpoint, api, token);
    return {
      projects: await gl.fetchProjectInfo(this.cfg.projects),
    };
  };
}
