/**
 * Bulk conversion between collections of Nepali and Gregorian dates.
 * Port of .NET NepaliDate.BulkConvert.
 */
import type { NepaliDate } from './types';
import { toNepaliDate, toEnglishDate } from './internal/conversion';
import { parse } from './constructors';

/**
 * Convert an array of Gregorian Date objects to NepaliDate array.
 * For large collections (>500), uses chunked processing.
 */
export function bulkToNepaliDates(engDates: Date[], useParallel = true): NepaliDate[] {
  const fn = (d: Date) => toNepaliDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  if (useParallel && engDates.length > 500) {
    return chunkedProcess(engDates, 500, fn);
  }
  return engDates.map(fn);
}

/**
 * Convert an array of NepaliDate objects to Gregorian Date array.
 */
export function bulkToEnglishDates(nepDates: NepaliDate[], useParallel = true): Date[] {
  const fn = (d: NepaliDate) => toEnglishDate(d.year, d.month, d.day);
  if (useParallel && nepDates.length > 500) {
    return chunkedProcess(nepDates, 500, fn);
  }
  return nepDates.map(fn);
}

/**
 * Convert an array of Nepali date strings to Gregorian Date array.
 */
export function bulkStringsToEnglishDates(nepStrings: string[], useParallel = true): Date[] {
  const convert = (s: string) => {
    const d = parse(s);
    return toEnglishDate(d.year, d.month, d.day);
  };
  if (useParallel && nepStrings.length > 500) {
    return chunkedProcess(nepStrings, 500, convert);
  }
  return nepStrings.map(convert);
}

function chunkedProcess<T, R>(items: T[], chunkSize: number, fn: (item: T) => R): R[] {
  const result: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    for (const item of chunk) {
      result.push(fn(item));
    }
  }
  return result;
}
