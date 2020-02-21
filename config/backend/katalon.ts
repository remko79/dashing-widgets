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
    // examples in test.ts
  },
};

export default katalon;
