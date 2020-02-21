import { Express } from 'express';

// eslint-disable-next-line import/no-extraneous-dependencies
const { createProxyMiddleware } = require('http-proxy-middleware');

export default (app: Express) => {
  // Forward the requests to webpack-dev-server.
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:8080',
    logLevel: 'debug',
  }));
};
