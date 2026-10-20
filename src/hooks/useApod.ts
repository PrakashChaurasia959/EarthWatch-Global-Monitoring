import { useAsyncData } from './useAsyncData';
import { getApodRandom, getApodRange, getApod } from '@/services/nasa';
import type { ApodItem } from '@/types/nasa';

/** APOD gallery: a randomized set of astronomy images (clearly NOT Earth imagery). */
export function useApodGallery(count = 9) {
  return useAsyncData<ApodItem[]>((signal) => getApodRandom(count, signal), [count], {
    autoRefreshMs: 0,
  });
}

/** APOD for a date range — for browsing the archive by date. */
export function useApodByRange(start: string, end: string) {
  return useAsyncData<ApodItem[]>((signal) => getApodRange(start, end, signal), [start, end], {});
}

/** Today's (or a given date's) APOD. */
export function useApod(date?: string) {
  return useAsyncData<ApodItem>((signal) => getApod(date, signal), [date], {});
}
