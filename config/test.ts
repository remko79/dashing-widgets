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
    },
    opsgenie: {
      ...defaultConfig.backend.opsgenie,
      config: {
        endpoint: 'https://api.eu.opsgenie.com/v2',
        token: '7c4e94bb-706f-4a32-8450-6e590abd6c00',
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
    },
  },
};

module.exports = config;
