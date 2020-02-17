import { ICfgJobSchedule } from './JobSchedule';

/**
 * Test execution information.
 */
export interface IKatalonExecution {
  /** Order / ID */
  order: number;

  /** Status, for example 'FAILED' */
  status: string;

  /** Start time */
  startTime: string;

  /** Duration in seconds */
  duration: number;

  /** Total number of tests */
  totalTests: number;

  /** Total number of passed tests */
  passedTests: number;
}

/**
 * Result item for a Katalon project.
 */
export interface IKatalonResult {
  /** project key, as defined in [[ICfgKatalonProjects]] */
  key: string;

  /** result contains an error? */
  error: boolean;

  /** test executions information */
  executions: IKatalonExecution[];
}

export interface ICfgKatalonProject {
  /** Katalon project ID */
  id: number;

  /** Name of the test suite to fetch info for */
  testSuite?: string;

  /** Status of the execution */
  status?: 'RUNNING' | 'COMPLETED';
}

export interface ICfgKatalonProjects {
  /** A list of projects to fetch info for. The key is the 'project key'. */
  [key: string]: ICfgKatalonProject;
}

export interface ICfgKatalon {
  /** Basic config. If omitted, the job(s) are disabled. */
  config?: {

    /** Authentication */
    auth: {
      /** Authentication url to fetch oauth2 token */
      endpoint: string;

      /** username */
      username?: string;

      /** password */
      password?: string;

      /** Authorization header */
      httpAuth: {
        /** ID / username for basic authentication header */
        id: string;

        /** Secret for basic authentication header */
        secret: string;
      };
    }

    /** Endpoint for the API, e.g. 'https://analytics.katalon.com/api/v1' */
    apiEndpoint: string;
  }

  /** Job schedule for fetching data */
  jobSchedule: ICfgJobSchedule;

  /** Projects configuration */
  projects: ICfgKatalonProjects;
}
