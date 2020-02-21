import { DeepPartial, IDWConfig } from '../typed_config';
import defaultConfig from './default';

const config: DeepPartial<IDWConfig> = {
  backend: {
    gitlab: {
      ...defaultConfig.backend.gitlab,
      config: {
        endpoint: 'https://gitlab.com/api/graphql',
        api: 'https://gitlab.com/api/v4',
        token: 'TfJ7XuRkW9yDOw6g5g2Y',
      },
      projects: {
        proj1: {
          name: 'Project 1', fullPath: 'test/project1',
        },
        proj2: {
          name: 'Project 2', fullPath: 'project2',
        },
        proj3: {
          name: 'Project 3',
          fullPath: 'test/project3',
          environments: [20, 22],
        },
      },
    },
    opsgenie: {
      ...defaultConfig.backend.opsgenie,
      config: {
        endpoint: 'https://api.eu.opsgenie.com/v2',
        token: '7c4e94bb-706f-4a32-8450-6e590abd6c00',
      },
      alerts: {
        ...defaultConfig.backend.opsgenie?.alerts,
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
      },
      onCalls: {
        ...defaultConfig.backend.opsgenie?.onCalls,
        queries: {
          project1: {
            scheduleId: '9cca44b8-5154-11ea-8d77-2e728ce88125',
          },
        },
      },
    },
    katalon: {
      ...defaultConfig.backend.katalon,
      config: {
        auth: {
          endpoint: 'https://analytics.katalon.com',
          httpAuth: {
            id: 'kit',
            secret: 'kit',
          },
          username: 'santa@claus.com',
          password: 'myinvalidpassword',
        },
        apiEndpoint: 'https://analytics.katalon.com/api/v1',
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
    },
  },
};

module.exports = config;
