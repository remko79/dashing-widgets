import fetch from 'node-fetch';
import oauth, { AccessToken } from 'simple-oauth2';
import { Logger } from '../lib/logger';
import {
  ICfgKatalon,
  ICfgKatalonProject,
  ICfgKatalonProjects,
  IKatalonExecution,
  IKatalonResult,
} from '../types/Katalon';

export default class KatalonClient {
  private readonly credentials: oauth.ModuleOptions;

  private readonly tokenConfig: oauth.PasswordTokenConfig;

  private accessToken?: AccessToken;

  private readonly apiEndpoint: string;

  constructor(config: ICfgKatalon['config']) {
    this.credentials = {
      client: {
        id: config?.auth.httpAuth.id ?? '',
        secret: config?.auth.httpAuth.secret ?? '',
      },
      auth: {
        tokenHost: config?.auth.endpoint ?? '',
      },
    };
    this.tokenConfig = {
      username: config?.auth.username ?? '',
      password: config?.auth.password ?? '',
      scope: [],
    };

    this.apiEndpoint = config?.apiEndpoint ?? '';
  }

  private async ensureValidAccessToken(): Promise<boolean> {
    if (this.accessToken) {
      try {
        // @ts-ignore
        if (this.accessToken.expired(3600)) {
          this.accessToken = await this.accessToken.refresh();
        }
        return true;
      } catch (error) {
        Logger.error('Katalon: Unable refresh access token', error);
      }
    } else {
      try {
        const oauth2 = oauth.create(this.credentials);
        const result = await oauth2.ownerPassword.getToken(this.tokenConfig);
        this.accessToken = oauth2.accessToken.create(result);
        return true;
      } catch (error) {
        Logger.error('Katalon: Unable create access token', error);
      }
    }
    return false;
  }

  public fetchAllExecutions(projects: ICfgKatalonProjects): Promise<IKatalonResult[]> {
    const promises: Promise<IKatalonResult>[] = [];

    Object.entries(projects).forEach(([key, value]) => {
      promises.push(this.fetchExecutions(key, value));
    });

    return Promise.all(promises);
  }

  private async fetchExecutions(key: string, project: ICfgKatalonProject): Promise<IKatalonResult> {
    const hasValidToken = await this.ensureValidAccessToken();
    if (!hasValidToken) {
      throw new Error('Katalon: no valid token');
    }
    const conditions = [
      {
        key: 'Project.id',
        operator: '=',
        value: project.id,
      } as {
        key: string,
        operator: string,
        value: string | number,
      },
    ];
    if (project.testSuite) {
      conditions.push({
        key: 'TestSuite.name',
        operator: '=',
        value: project.testSuite,
      });
    }
    if (project.status) {
      conditions.push({
        key: 'executionStage',
        operator: '=',
        value: project.status,
      });
    }
    const options = encodeURIComponent(JSON.stringify({
      type: 'Execution',
      conditions,
      functions: [],
      pagination: {
        page: 0,
        size: 10,
        sorts: ['id,desc'],
      },
      groupBys: [],
    }));

    const token = this.accessToken?.token.access_token;
    const url = `${this.apiEndpoint}/search?q=${options}&access_token=${token}&_=${Date.now()}`;
    try {
      return await fetch(url)
        .then((response) => response.json().then((json) => ({
          statusCode: response.status,
          json,
        })))
        .then(({ statusCode, json }) => {
          if (statusCode !== 200 || !json.content) {
            Logger.error('Katalon: Fetching executions', `${project.id}: ${JSON.stringify(json)}`);
            return {
              key,
              error: true,
              executions: [],
            };
          }
          const executions: IKatalonExecution[] = [];
          json.content.forEach((item) => {
            executions.push({
              order: item.order,
              status: item.status,
              startTime: item.startTime,
              duration: Math.round(item.duration / 1000),
              totalTests: item.totalTests,
              passedTests: item.totalPassedTests,
            });
          });
          return {
            key,
            error: false,
            executions: executions.reverse(),
          };
        });
    } catch (error) {
      Logger.error('Katalon: Fetching executions', error);
      throw error;
    }
  }
}
