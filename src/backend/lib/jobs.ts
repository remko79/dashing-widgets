import RequireAll from 'require-all';
import * as SocketIO from 'socket.io';

import { Logger } from './logger';
import queue from './queue';
import Storage from './storage';

const jobs = RequireAll({
  dirname: `${__dirname}/../jobs`,
  filter: /^(.*)\.(ts|tsx|js|jsx)?$/,

  // eslint-disable-next-line new-cap
  resolve: (Job) => new Job.default(),
});

const scheduleJobs = (io: SocketIO.Server, storage: Storage) => {
  if (Object.keys(jobs).length === 0) {
    Logger.warning(`No jobs found in "${__dirname}/../jobs"...`);
    return;
  }
  queue(jobs, io, storage).then(() => {
    Logger.info('Jobs queued');
  });
};

export default scheduleJobs;
