/* eslint-disable import/prefer-default-export */

import dayjs from 'dayjs';
import relative from 'dayjs/plugin/relativeTime';

dayjs.extend(relative);

export function formatDate(date: number | string, format:string): string {
  return (date ? dayjs(date) : dayjs()).format(format);
}

export function getTimeSince(date: number | string) {
  return dayjs(dayjs(date)).fromNow(true);
}
