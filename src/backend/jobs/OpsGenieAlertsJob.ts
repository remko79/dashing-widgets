import OpsGenieClient from '../api/OpsGenieClient';
import config from '../config.service';
import { ICfgOpsGenie } from '../types/OpsGenie';
import BaseJob from '../BaseJob';

export default class OpsGenieAlertsJob extends BaseJob {
  private readonly cfg?: ICfgOpsGenie;

  name = 'opsgenie-openalerts';

  constructor() {
    super();
    const cfgBackend = config.getTyped('backend');
    if (cfgBackend.opsgenie?.config) {
      this.cfg = cfgBackend.opsgenie;
    }
  }

  isEnabled = () => (this.cfg?.config !== undefined && Object.keys(this.cfg?.alerts.queries).length > 0);

  getSchedule = () => (this.cfg ? this.cfg.alerts.jobSchedule : null);

  doWork = async () => {
    if (!this.cfg?.config) {
      return Promise.resolve([]);
    }
    const { endpoint, token } = this.cfg.config;
    const api = new OpsGenieClient(endpoint, token);
    return {
      schedule: this.getSchedule(),
      openAlerts: await api.fetchAllOpenAlerts(this.cfg.alerts.queries),
    };
  };
}
