import { ICfgOpsGenie } from '../../src/backend/types/OpsGenie';

const opsgenie: ICfgOpsGenie = {
  alerts: {
    queries: {
      // examples in test.ts
    },
    jobSchedule: {
      every: 15,
      timeout: 60,
    },
  },
  onCalls: {
    queries: {
      // examples in test.ts
    },
    jobSchedule: {
      every: 600,
      timeout: 3600,
    },
  },
};

export default opsgenie;
