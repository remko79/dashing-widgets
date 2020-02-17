import { ICfgDashboard, WidgetType } from '../../typed_config';

const dashboard: ICfgDashboard = {
  title: 'Test Automation',
  url: '/testautomation',
  columns: 4,
  screensaver: {
    every: 1800,
    show: 30,
  },
  widgets: [
    {
      type: WidgetType.AutomatedTestsNrRunning,
      title: 'Project 1 - Running',
      extraProps: { project: 'project1_running' },
    },
    { type: WidgetType.Placeholder, title: '' },
    {
      type: WidgetType.AutomatedTestsGraph,
      title: 'Desktop - Regression',
      widgetSize: 2,
      extraProps: { project: 'project1_desktop' },
    },

    {
      type: WidgetType.AutomatedTestsRunning,
      title: 'Running Test',
      extraProps: { project: 'project1_running' },
    },
    { type: WidgetType.Placeholder, title: '' },
    {
      type: WidgetType.AutomatedTestsGraph,
      title: 'Mobile - Regression',
      widgetSize: 2,
      extraProps: { project: 'project1_mobile' },
    },
    { type: WidgetType.Placeholder, title: '' },
    { type: WidgetType.Placeholder, title: '' },
    {
      type: WidgetType.AutomatedTestsGraph,
      title: 'App - Regression',
      widgetSize: 2,
      extraProps: { project: 'project1_app' },
    },
  ],
};

export default dashboard;
