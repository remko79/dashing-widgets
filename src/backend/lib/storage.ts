import Redis from 'ioredis';

export type StorageJobResult = {
  key: string;
  value: object;
};

export default class Storage {
  private readonly keyPrefix: string;

  private storage: Redis.Redis;

  constructor() {
    this.keyPrefix = 'dashing:';
    this.storage = new Redis();
  }

  storeJobResult = (key: string, value: any): void => {
    this.storage.set(`${this.keyPrefix}job:${key}`, JSON.stringify(value));
  };

  getLastJobResults = async (): Promise<StorageJobResult[]> => {
    const keys = await this.storage.keys(`${this.keyPrefix}job:*`);
    return this.storage.mget(...keys).then((values: (string | null)[]) => {
      const jobResult: StorageJobResult[] = [];
      values.forEach((value, idx) => {
        if (value !== null) {
          jobResult.push({
            key: keys[idx].replace(`${this.keyPrefix}job:`, ''),
            value: JSON.parse(value),
          });
        }
      });
      return jobResult;
    });
  };
}
