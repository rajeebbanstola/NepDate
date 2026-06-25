/**
 * Comparison functions.
 */
import type { NepaliDate } from './types';

// ---- Internal ----

function toInteger(date: NepaliDate): number {
  return date.year * 10000 + date.month * 100 + date.day;
}

// ---- Comparison ----

/** Check if two NepaliDates are equal */
export function isEqual(dateLeft: NepaliDate, dateRight: NepaliDate): boolean {
  return toInteger(dateLeft) === toInteger(dateRight);
}

/** Check if the first date is before the second */
export function isBefore(dateLeft: NepaliDate, dateRight: NepaliDate): boolean {
  return toInteger(dateLeft) < toInteger(dateRight);
}

/** Check if the first date is after the second */
export function isAfter(dateLeft: NepaliDate, dateRight: NepaliDate): boolean {
  return toInteger(dateLeft) > toInteger(dateRight);
}

/** Check if two dates are the same or the first is before the second */
export function isSameOrBefore(dateLeft: NepaliDate, dateRight: NepaliDate): boolean {
  return toInteger(dateLeft) <= toInteger(dateRight);
}

/** Check if two dates are the same or the first is after the second */
export function isSameOrAfter(dateLeft: NepaliDate, dateRight: NepaliDate): boolean {
  return toInteger(dateLeft) >= toInteger(dateRight);
}

/** Compare two dates, returning -1, 0, or 1 (ascending) */
export function compareAsc(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  const diff = toInteger(dateLeft) - toInteger(dateRight);
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/** Compare two dates, returning -1, 0, or 1 (descending) */
export function compareDesc(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  return -compareAsc(dateLeft, dateRight);
}

/** Return the minimum (earliest) date from an array */
export function min(dates: NepaliDate[]): NepaliDate {
  if (dates.length === 0) throw new RangeError('Array must not be empty');
  let best = dates[0];
  for (let i = 1; i < dates.length; i++) {
    if (isBefore(dates[i], best)) best = dates[i];
  }
  return best;
}

/** Return the maximum (latest) date from an array */
export function max(dates: NepaliDate[]): NepaliDate {
  if (dates.length === 0) throw new RangeError('Array must not be empty');
  let best = dates[0];
  for (let i = 1; i < dates.length; i++) {
    if (isAfter(dates[i], best)) best = dates[i];
  }
  return best;
}
