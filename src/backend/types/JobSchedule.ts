/**
 * A job schedule.
 */
export interface ICfgJobSchedule {
  /** Fetch every 'x' seconds */
  every: number;

  /** Timeout on the widget after 'x' seconds */
  timeout: number;
}
