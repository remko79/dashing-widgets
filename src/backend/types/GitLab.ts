import { ICfgJobSchedule } from './JobSchedule';

/**
 * Unit test coverage information per fetched pipeline.
 */
export interface ICoverage {
  /** unit test coverage */
  value: number;

  /** finished date */
  date: string;
}

/**
 * Build status information per fetched pipeline.
 */
export interface IBuildStatus {
  /** Status, e.g. SUCCESS or FAILED */
  status: string;

  /** start date */
  date: string;
}

export interface IEnvironment {
  /** env name */
  name: string;

  /** last update date */
  date: string;

  /** Status, e.g. SUCCESS or FAILED */
  status: string;
}

/**
 * Result item for a GitLab project.
 */
export interface IGitLabProjectResult {
  /** project key, as defined in [[ICfgGitLabProjects]] */
  key: string;

  /** Name to display on the widget, as defined in [[ICfgGitLabProjects]] */
  name: string;

  /** result contains an error? */
  error: boolean;

  /** unit test coverage information */
  coverage: ICoverage[];

  /** build status information */
  buildStatus: IBuildStatus;

  /** environments information */
  environments: IEnvironment[];
}

/**
 * List of configured projects to fetch info for.
 */
export interface ICfgGitLabProjects {
  /** A list of projects to fetch info for. The key is the 'project key'. */
  [key: string]: {

    /** project name, used for displaying in widget */
    name: string;

    /** project path in GitLab */
    fullPath: string;

    environments?: number[];
  }
}

/**
 * GitLab configuration.
 */
export interface ICfgGitLab {
  /** Basic config. If omitted, the job(s) are disabled. */
  config?: {
    endpoint: string;
    api: string;
    token: string;
  }

  /** Job schedule for fetching data */
  jobSchedule: ICfgJobSchedule;

  /** Projects configuration */
  projects: ICfgGitLabProjects;
}
