import { DoneCallback, Job } from 'bull';
import { Logger } from './lib/logger';
import { ICfgJobSchedule } from './types/JobSchedule';
import Storage from './lib/storage';

export default abstract class BaseJob {
  protected resultStorage?: Storage;

  abstract name: string;

  isEnabled = (): boolean => false;

  abstract getSchedule(): ICfgJobSchedule | null;

  abstract doWork(): Promise<any>;

  setResultStorage = (storage: Storage): void => {
    this.resultStorage = storage;
  };

  processCallback = (job: Job, done: DoneCallback): void => {
    if (!this.isEnabled()) {
      done();
      return;
    }
    Logger.info('job', `${job.name} - ${job.id}`);

    this.doWork()
      .then((res) => {
        const result = {
          date: Date.now(),
          schedule: this.getSchedule(),
          error: false,
          ...res,
        };
        if (this.resultStorage) {
          this.resultStorage.storeJobResult(this.name, result);
        }
        done(null, result);
      })
      .catch((err) => {
        Logger.error(`Job: ${this.name}`, err);
        done(null, { error: err });
      });
  };
}
