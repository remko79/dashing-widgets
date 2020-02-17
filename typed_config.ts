import { ICfgGitLab } from './src/backend/types/GitLab';
import { ICfgOpsGenie } from './src/backend/types/OpsGenie';
import { ICfgKatalon } from './src/backend/types/Katalon';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

/**
 * Available widget sizes (number of spanning columns).
 */
export type WidgetSize = 1 | 2 | 3;

/**
 * Available widget types.
 */
export enum WidgetType {
  AutomatedTestsGraph,
  AutomatedTestsNrRunning,
  AutomatedTestsRunning,
  BuildStatus,
  CurrentTestCoverage,
  EnvironmentStatus,
  OnCall,
  OpenAlerts,
  Placeholder,
}

/**
 * Widget configuration.
 */
export interface ICfgWidget {
  /** type, see widget class names. */
  type: WidgetType;

  /** display title */
  title: string;

  /** size of the widget */
  widgetSize?: WidgetSize;

  /** extra properties for the widget, see specific widgets */
  extraProps?: any;
}

/**
 * Screensaver configuration.
 */
export interface IScreenSaver {
  /** show the screensaver every 'x' seconds */
  every: number,

  /** number of seconds to show the screensaver before returning to the dashboard */
  show: number,
}

/**
 * Dashboard configuration.
 */
export interface ICfgDashboard {
  /** title, shown on the overview page */
  title: string;

  /** url (path) of the dashboard */
  url: string;

  /** optional screensaver configuration */
  screensaver?: IScreenSaver;

  /** number of columns for the dashboard */
  columns?: 3 | 4;

  /** list of widgets */
  widgets: ICfgWidget[];
}

/**
 * Server / backend configuration.
 */
export interface ICfgBackend {
  /** GitLab configuration */
  gitlab?: ICfgGitLab;

  /** OpsGenie configuration */
  opsgenie?: ICfgOpsGenie;

  /** Katalon analytics configuration */
  katalon?: ICfgKatalon;
}

/**
 * Application configuration.
 */
export interface IDWConfig {
  /** list of configuration dashboards */
  dashboards: ICfgDashboard[];

  /** server / backend configuration */
  backend: ICfgBackend;
}
