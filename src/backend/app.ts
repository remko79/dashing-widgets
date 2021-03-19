import express, { Request, Response } from 'express';
import http from 'http';
import * as SocketIO from 'socket.io';
import config from 'config';
import hash from 'object-hash';

import { Logger } from './lib/logger';
import devExpress from './dev-express';

import Storage, { StorageJobResult } from './lib/storage';
import scheduleJobs from './lib/jobs';

const dev = process.env.NODE_ENV !== 'production';

const app = express();
app.disable('x-powered-by');

if (dev) {
  devExpress(app);
} else {
  app.use('/', express.static(`${__dirname}/../frontend`));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', { root: `${__dirname}/../frontend/` });
  });
}

const port = 3000;

const server = http.createServer(app);
const io = new SocketIO.Server(server);
const storage = new Storage();

io.on('connect', (socket: SocketIO.Socket) => {
  Logger.info(`sockets: client connected: ${socket.id}`);
  storage.getLastJobResults().then((results: StorageJobResult[]) => {
    results.forEach((res) => {
      socket.emit(`widget:update:${res.key}`, res.value);
    });
  });

  socket.on('disconnect', () => {
    Logger.info(`sockets: client disconnected: ${socket.id}`);
  });
});

// Send the hash of the config every hour, so clients can reload when it's changed.
const cfgHash = hash(config);
setInterval(() => {
  io.emit('CFG_HASH', cfgHash);
}, 60 * 60 * 1000);

server.listen(port, () => {
  Logger.info(`running on port: ${port}`);
  scheduleJobs(io, storage);
});
