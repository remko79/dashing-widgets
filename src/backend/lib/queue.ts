import Queue, { EveryRepeatOptions, Job } from 'bull';
import * as SocketIO from 'socket.io';
import { Logger } from './logger';
import BaseJob from '../BaseJob';
import Storage from './storage';

let queue : Queue.Queue;
const initQueue = (io: SocketIO.Server) => {
  queue = new Queue('dashboard');
  queue.on('error', (error: Error) => {
    // An error occured.
    Logger.error('Queue error', error);
  });
  queue.on('stalled', (job: Job) => {
    // A job has been marked as stalled. This is useful for debugging job
    // workers that crash or pause the event loop.
    Logger.warning('stalled', `${job.name} - ${job.id}`);
  });
  queue.on('completed', (job: Job, result: any) => {
    io.emit(`widget:update:${job.name}`, result);
  });
};

const savedRepeatableJobs = {};

const cleanUpQueue = async () => {
  const repeatableJobInfos = await queue.getRepeatableJobs();
  await repeatableJobInfos.forEach((info) => {
    if (savedRepeatableJobs[info.name]) {
      queue.removeRepeatable(info.name, savedRepeatableJobs[info.name]).then(() => {
        Logger.info(`Repeatable job removed from queue: ${info.name}`);
      });
    } else if (info.every) {
      queue.removeRepeatable(info.name, { every: info.every }).then(() => {
        Logger.warning(`Repeatable job removed from queue by "every": ${info.name}`);
      });
    } else {
      Logger.error(`Unable to remove repeatable job from queue: ${info.name}`);
    }
  });
};

export default async (jobs: {[key: string]: BaseJob}, io: SocketIO.Server, storage: Storage): Promise<void> => {
  initQueue(io);
  await cleanUpQueue();

  Object.values(jobs).forEach((job: BaseJob) => {
    if (job.isEnabled() && job.getSchedule() !== null) {
      const schedule = job.getSchedule();
      if (schedule !== null) {
        job.setResultStorage(storage);
        queue.process(job.name, job.processCallback);
        const repeat: EveryRepeatOptions = { every: (schedule.every * 1000) };
        queue.add(job.name, {}, {
          repeat,
          removeOnComplete: true,
        });
        savedRepeatableJobs[job.name] = repeat;
      } else {
        Logger.warning('Job enabled, but no schedule:', job.name);
      }
    } else {
      Logger.info('Job disabled, not added to queue:', job.name);
    }
  });
};

// Shutdown all processes.
async function shutdown() {
  try {
    await cleanUpQueue();
    Logger.info('closing...');
    await queue.close();
    Logger.info('closed');
  } catch (error) {
    Logger.error('shutdown process failed', error);
    process.exit(1);
  }
  process.exit();
}

Logger.info('register shutdown');
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
