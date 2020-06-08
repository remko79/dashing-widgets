import { GraphQLClient } from 'graphql-request';
import fetch from 'node-fetch';
import { Logger } from '../lib/logger';
import {
  IBuildStatus,
  ICoverage,
  IGitLabProjectResult,
  ICfgGitLabProjects,
  IEnvironment,
} from '../types/GitLab';

const projectFragment = `fragment projectInfo on Project {
  fullPath
  coverage:pipelines(ref: "master", first: 1, status: SUCCESS) {
    edges {
      node {
        finishedAt
        coverage
      }
    }
  }
  buildStatus:pipelines(ref: "master", first: 1) {
    edges {
      node {
        status
        startedAt
      }
    }
  }
}`;

type EnvironmentInfo = {
  [key: string]: IEnvironment;
};

interface EnvironmentList {
  [key: string]: IEnvironment[];
}

export default class GitLabClient {
  private client: GraphQLClient;

  private readonly api: string;

  private readonly token: string;

  constructor(endpoint: string, api: string, token: string) {
    this.api = api;
    this.token = token;

    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Private-Token': token,
      },
    });
  }

  public async fetchProjectInfo(projects: ICfgGitLabProjects): Promise<IGitLabProjectResult[]> {
    let gql = '{\n';
    Object.keys(projects).forEach((key) => {
      gql += `${key}: project(fullPath: "${projects[key].fullPath}") {
        ... projectInfo
      }\n`;
    });
    gql += `}\n${projectFragment}`;

    try {
      const data: IGitLabProjectResult[] = [];

      const res: {} = await this.client.request(gql);
      const allEnvironments = await this.fetchAllEnvironments(projects);

      Object.keys(res).forEach((key) => {
        const val = res[key];
        if (val === null) {
          Logger.error(`GitLab: Could not fetch info for ${key}`, projects[key]);
          data.push({
            key,
            name: projects[key].name,
            error: true,
            coverage: [],
            buildStatus: {
              status: 'UNKNOWN',
              date: '',
            },
            environments: [],
          });
          return;
        }
        const coverage = val.coverage.edges.map((edge: any) => ({
          value: edge.node.coverage,
          date: edge.node.finishedAt,
        }) as ICoverage);
        const buildStatus = val.buildStatus.edges.map((edge: any) => ({
          status: edge.node.status,
          date: edge.node.startedAt,
        }) as IBuildStatus);

        data.push({
          key,
          name: projects[key].name,
          error: false,
          coverage,
          buildStatus: buildStatus[0],
          environments: allEnvironments[key] || [],
        });
      });
      return data;
    } catch (error) {
      Logger.error('GitLab: Fetching project info', error.message);
      throw error;
    }
  }

  private async fetchAllEnvironments(projects: ICfgGitLabProjects): (Promise<EnvironmentList>) {
    const promises: Promise<EnvironmentList>[] = [];
    Object.keys(projects).forEach((key) => {
      const { environments } = projects[key];
      if (environments) {
        environments.forEach((envId: number) => {
          promises.push(this.fetchEnvironmentInfo(key, projects[key].fullPath, envId));
        });
      }
    });
    const data = await Promise.all(promises);

    const result: EnvironmentList = {};
    data.forEach((item) => {
      Object.keys(item).forEach((key: string) => {
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(...item[key]);
      });
    });
    return result;
  }

  private async fetchEnvironmentInfo(key: string, projectPath: string, envId: number): Promise<EnvironmentList> {
    try {
      const url = `${this.api}/projects/${encodeURIComponent(projectPath)}/environments/${envId}`;
      return await fetch(url, {
        headers: {
          'PRIVATE-TOKEN': this.token,
        },
        timeout: 1000,
      })
        .then((response) => response.json().then((json) => ({
          statusCode: response.status,
          json,
        })))
        .then(({ statusCode, json }) => {
          const pipeline = json.last_deployment?.deployable?.pipeline;
          if (statusCode !== 200 || !json.name || !pipeline) {
            Logger.error('GitLab: Fetching environment info', `${projectPath} - ${envId}: ${JSON.stringify(json)}`);
            return {};
          }
          return {
            [key]: [{
              name: json.name,
              date: pipeline.updated_at,
              status: pipeline.status.toUpperCase(),
            }],
          };
        });
    } catch (error) {
      Logger.error('GitLab: Fetching environment info', error.message);
      throw error;
    }
  }
}
