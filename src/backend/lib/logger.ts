/* eslint-disable no-inner-declarations */

import dayjs from 'dayjs';

export namespace Logger {
  const log = (level: string, msg?: string, data?: any) => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const prefix = `${timestamp} [${level}] =>`;

    // eslint-disable-next-line no-console
    console.log(prefix, msg || '', data ? '-' : '', data || '');
  };

  export function error(msg?: string, data?: any) {
    log('ERROR', msg, data);
  }

  export function warning(msg?: string, data?: any) {
    log('WARNING', msg, data);
  }

  export function debug(msg?: string, data?: any) {
    log('DEBUG', msg, data);
  }

  export function info(msg?: string, data?: any) {
    log('INFO', msg, data);
  }
}
