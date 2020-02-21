import { ICfgJobSchedule } from './JobSchedule';

/** Available priorities in OpsGenie */
type Priority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

/**
 * Result item for 'open alerts' queries.
 */
export type IOpenAlertsResult = {
  /** search key, as defined in [[ICfgOpenAlerts]] */
  key: string;

  /** result contains an error? */
  error: boolean;

  /** number of open alerts */
  count: number;
};

/**
 * Query parameters for searching alerts.
 */
export type AlertQueryParams = {
  /** Include teams in result */
  teams?: string[];

  /** Exclude teams from result */
  notTeams?: string[];

  /** Priorities to search for */
  priorities: Priority[];

  /** Acknowledged? */
  acked?: boolean;
};

/**
 * List of configured search queries for open alerts.
 */
export interface ICfgOpenAlerts {
  /** A list of queries for open alerts. The key is the 'search key' */
  [key: string]: AlertQueryParams;
}

/**
 * Result item for 'who is on call' queries.
 */
export type IOnCallsResult = {
  /** search key, as defined in [[ICfgOnCalls]] */
  key: string;

  /** result contains an error? */
  error: boolean;

  /** name(s) of the people on call */
  names: string[];
};

/**
 * Query parameters for searching who is on call.
 */
export type OnCallsParams = {
  /** On call schedule ID */
  scheduleId: string;
};

/**
 * List of configured search queries for who is on call.
 */
export interface ICfgOnCalls {
  /** A list of queries for open alerts. The key is the 'search key' */
  [key: string]: OnCallsParams;
}

/**
 * OpsGenie configuration.
 */
export interface ICfgOpsGenie {
  /** Basic config. If omitted, the job(s) are disabled. */
  config?: {
    /** Endpoint, e.g. 'https://api.eu.opsgenie.com/v2' */
    endpoint: string;

    /** API token */
    token: string;
  }

  /** Open alerts configuration */
  alerts: {
    /** List of configured queries for open alerts */
    queries: ICfgOpenAlerts;

    /** Job schedule for fetching open alerts */
    jobSchedule: ICfgJobSchedule;
  }

  /** On call configuration */
  onCalls: {
    /** List of configured queries for who is on call */
    queries: ICfgOnCalls;

    /** Job schedule for fetching who is on call */
    jobSchedule: ICfgJobSchedule;
  }
}
