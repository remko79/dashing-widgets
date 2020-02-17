import { ICfgDashboard, WidgetType } from '../../typed_config';

const dashboard: ICfgDashboard = {
  title: 'Projects',
  url: '/projects',
  screensaver: {
    every: 3600,
    show: 30,
  },
  widgets: [
    {
      type: WidgetType.OpenAlerts,
      title: 'Alerts - Prio 1',
      extraProps: { alias: 'all_p1' },
    },
    {
      type: WidgetType.OpenAlerts,
      title: 'Alerts - Prio 2',
      extraProps: {
        alias: 'all_p2',
        thresholds: {
          warning: 1,
          error: 5,
        },
      },
    },
    {
      type: WidgetType.OpenAlerts,
      title: 'Alerts Project 1',
      extraProps: { alias: 'project1' },
    },
    {
      type: WidgetType.CurrentTestCoverage,
      title: 'Test coverage',
      widgetSize: 2,
      extraProps: { projects: ['proj1', 'proj2', 'proj3'] },
    },
    {
      type: WidgetType.EnvironmentStatus,
      title: 'Latest deploys',
      extraProps: {
        projects: {
          proj3: { environments: ['acceptance', 'production'] },
        },
      },
    },
    {
      type: WidgetType.BuildStatus,
      title: 'Project 1',
      extraProps: { project: 'proj1' },
    },
    {
      type: WidgetType.BuildStatus,
      title: 'Project 2',
      extraProps: { project: 'proj2' },
    },
    {
      type: WidgetType.BuildStatus,
      title: 'Project 3',
      extraProps: { project: 'proj3' },
    },
  ],
};

export default dashboard;
