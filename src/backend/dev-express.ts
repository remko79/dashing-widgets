import { Express } from 'express';

// eslint-disable-next-line import/no-extraneous-dependencies
const proxy = require('http-proxy-middleware');

export default (app: Express) => {
  // Forward the requests to webpack-dev-server.
  app.use(proxy('/', {
    target: 'http://localhost:8080',
    logLevel: 'debug',
  }));
};
