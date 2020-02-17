import config from 'config';
import { IDWConfig } from '../../typed_config';

// Register new method with config.
declare module 'config' {
  interface IConfig {
    // This method accepts only first-level keys of our IDWConfig interface.
    // TypeScript compiler is going to fail for anything else.
    getTyped: <T extends keyof IDWConfig>(key: T) => IDWConfig[T]
  }
}

const prototype: config.IConfig = Object.getPrototypeOf(config);
// We still call 'get', but returning the typed definition for our config.
prototype.getTyped = config.get;

export default config;
