import BaseJob from '../BaseJob';
import config from '../config.service';
import { ICfgKatalon } from '../types/Katalon';
import KatalonClient from '../api/KatalonClient';

export default class KatalonJob extends BaseJob {
  private readonly cfg?: ICfgKatalon;

  private readonly client?: KatalonClient;

  name = 'katalon-executions';

  constructor() {
    super();
    const cfgBackend = config.getTyped('backend');
    if (cfgBackend.katalon?.config) {
      this.cfg = cfgBackend.katalon;
    }

    if (this.isEnabled()) {
      this.client = new KatalonClient(this.cfg?.config);
    }
  }

  isEnabled = () => (this.cfg?.config !== undefined && this.cfg?.config.auth.username !== undefined);

  getSchedule = () => (this.cfg ? this.cfg.jobSchedule : null);

  doWork = async () => {
    if (!this.cfg?.config || this.client === undefined) {
      return Promise.resolve([]);
    }

    const p = await this.client.fetchAllExecutions(this.cfg.projects);
    return {
      projects: p,
    };
  };
}
