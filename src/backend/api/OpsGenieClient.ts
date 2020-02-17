import Bottleneck from 'bottleneck';
import fetch from 'node-fetch';
import { Logger } from '../lib/logger';
import {
  AlertQueryParams,
  ICfgOnCalls,
  ICfgOpenAlerts,
  IOnCallsResult,
  IOpenAlertsResult,
  OnCallsParams,
} from '../types/OpsGenie';

export default class OpsGenieClient {
  private readonly endpoint: string;

  private readonly token: string;

  private limiter: Bottleneck;

  constructor(endpoint: string, token: string) {
    this.endpoint = endpoint;
    this.token = token;
    this.limiter = new Bottleneck({
      minTime: 1000 / 5, // 5 per second
    });
  }

  buildQuery = (params: AlertQueryParams) => {
    const res = [
      'status!%3Dclosed', // status != closed
    ];
    if (params.teams !== undefined && params.teams.length > 0) {
      const encoded = params.teams.map((val) => encodeURIComponent(val)).join('%20OR%20');
      res.push(`teams%3D%28${encoded}%29`); // teams = (... OR ...)
    }
    if (params.priorities.length > 0) {
      res.push(`priority%3D%28${params.priorities.join('%20OR%20')}%29`); // priority = (P1 OR P2 OR ...)
    }
    if (params.acked !== undefined) {
      res.push(`acknowledged%3D${params.acked ? 'true' : 'false'}`);
    }
    return res.join('%20AND%20');
  };

  public fetchAllOpenAlerts(queries: ICfgOpenAlerts): Promise<IOpenAlertsResult[]> {
    const promises: Promise<IOpenAlertsResult>[] = [];

    Object.entries(queries).forEach(([key, value]) => {
      promises.push(this.fetchOpenAlerts(key, value));
    });
    return Promise.all(promises);

    // @todo fix not failing fast in Promise.all...
    // see https://stackoverflow.com/questions/31424561/wait-until-all-promises-complete-even-if-some-rejected
  }

  private async fetchOpenAlerts(alias: string, params: AlertQueryParams): Promise<IOpenAlertsResult> {
    try {
      const url = `${this.endpoint}/alerts/count?query=${this.buildQuery(params)}`;
      return await this.limiter.schedule(() => fetch(url, {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
        timeout: 2000,
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.data && json.data.count !== undefined) {
            return {
              key: alias,
              error: false,
              count: json.data.count,
            };
          }
          Logger.error('OpsGenie: Could not fetch open alerts count:', json);
          return {
            key: alias,
            error: true,
            count: -1,
          };
        })
        .catch((err) => {
          Logger.error(`Error fetching open alerts for: ${alias}`, err);
          return {
            key: alias,
            error: true,
            count: -1,
          };
        }));
    } catch (error) {
      Logger.error('OpsGenie: Error fetching open alerts', error.message);
      throw error;
    }
  }

  public fetchAllOnCalls(queries: ICfgOnCalls): Promise<IOnCallsResult[]> {
    const promises: Promise<IOnCallsResult>[] = [];

    Object.entries(queries).forEach(([key, value]) => {
      promises.push(this.fetchOnCalls(key, value));
    });
    return Promise.all(promises);

    // @todo fix not failing fast in Promise.all...
    // see https://stackoverflow.com/questions/31424561/wait-until-all-promises-complete-even-if-some-rejected
  }

  private async fetchOnCalls(alias: string, params: OnCallsParams): Promise<IOnCallsResult> {
    try {
      const url = `${this.endpoint}/schedules/${params.scheduleId}/on-calls?flat=true`;
      return await this.limiter.schedule(() => fetch(url, {
        headers: {
          Authorization: `GenieKey ${this.token}`,
        },
        timeout: 2000,
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.data && json.data.onCallRecipients !== undefined) {
            return {
              key: alias,
              error: false,
              names: json.data.onCallRecipients,
            };
          }
          Logger.error('OpsGenie: Could not fetch on calls:', json);
          return {
            key: alias,
            error: true,
            names: [],
          };
        }))
        .catch((err) => {
          Logger.error(`Error fetching on call for: ${alias}`, err);
          return {
            key: alias,
            error: true,
            names: [],
          };
        });
    } catch (error) {
      Logger.error('OpsGenie: Error fetching on calls', error.message);
      throw error;
    }
  }
}
