import { ICfgOpsGenie } from '../../src/backend/types/OpsGenie';

const opsgenie: ICfgOpsGenie = {
  alerts: {
    queries: {
      all_p1: {
        priorities: ['P1'],
      },
      all_p2: {
        priorities: ['P2'],
      },
      all_p12_unacked: {
        priorities: ['P1', 'P2'],
        acked: false,
      },
      all_p345: {
        priorities: ['P3', 'P4', 'P5'],
      },
      project1: {
        teams: ['PROJECT1'],
        priorities: ['P1', 'P2', 'P3'],
      },
      project1_all: {
        teams: ['PROJECT1'],
        priorities: [],
      },
    },
    jobSchedule: {
      every: 15,
      timeout: 60,
    },
  },
  onCalls: {
    queries: {
      project1: {
        scheduleId: '9cca44b8-5154-11ea-8d77-2e728ce88125',
      },
    },
    jobSchedule: {
      every: 600,
      timeout: 3600,
    },
  },
};

export default opsgenie;
