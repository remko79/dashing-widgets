import { ICfgKatalon } from '../../src/backend/types/Katalon';

const katalon: ICfgKatalon = {
  config: {
    auth: {
      endpoint: 'https://analytics.katalon.com',
      httpAuth: {
        id: 'kit',
        secret: 'kit',
      },
    },
    apiEndpoint: 'https://analytics.katalon.com/api/v1',
  },

  jobSchedule: {
    every: 600,
    timeout: 1800,
  },

  projects: {
    project1_desktop: {
      id: 20001,
      testSuite: 'Desktop-Regression',
    },
    project1_mobile: {
      id: 20001,
      testSuite: 'Mobile-Regression',
    },
    project1_app: {
      id: 20001,
      testSuite: 'App-Regression',
    },
    project1_running: {
      id: 20001,
      status: 'RUNNING',
    },
  },
};

export default katalon;
