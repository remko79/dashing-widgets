import OpsGenieClient from '../api/OpsGenieClient';
import config from '../config.service';
import { ICfgOpsGenie } from '../types/OpsGenie';
import BaseJob from '../BaseJob';

export default class OpsGenieOnCallsJob extends BaseJob {
  private readonly cfg?: ICfgOpsGenie;

  name = 'opsgenie-oncalls';

  constructor() {
    super();
    const cfgBackend = config.getTyped('backend');
    if (cfgBackend.opsgenie?.config) {
      this.cfg = cfgBackend.opsgenie;
    }
  }

  isEnabled = () => (this.cfg?.config !== undefined && Object.keys(this.cfg?.onCalls.queries).length > 0);

  getSchedule = () => (this.cfg ? this.cfg.onCalls.jobSchedule : null);

  doWork = async () => {
    if (!this.cfg?.config) {
      return Promise.resolve([]);
    }
    const { endpoint, token } = this.cfg.config;
    const api = new OpsGenieClient(endpoint, token);
    return {
      schedule: this.getSchedule(),
      onCalls: await api.fetchAllOnCalls(this.cfg.onCalls.queries),
    };
  };
}
