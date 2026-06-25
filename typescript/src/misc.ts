/**
 * Relative date checks and miscellaneous utilities.
 */
import type { NepaliDate } from './types';
import { toEnglishDate } from './internal/conversion';
import { fromJSDate } from './constructors';

/**
 * Check if the date is a Gregorian leap year.
 */
export function isLeapYear(date: NepaliDate): boolean {
  const eng = toEnglishDate(date.year, date.month, date.day);
  const year = eng.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Check if this date is today */
export function isToday(date: NepaliDate): boolean {
  const d = fromJSDate(new Date());
  return date.year === d.year && date.month === d.month && date.day === d.day;
}

/** Check if this date is yesterday */
export function isYesterday(date: NepaliDate): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const nep = fromJSDate(d);
  return date.year === nep.year && date.month === nep.month && date.day === nep.day;
}

/** Check if this date is tomorrow */
export function isTomorrow(date: NepaliDate): boolean {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const nep = fromJSDate(d);
  return date.year === nep.year && date.month === nep.month && date.day === nep.day;
}

/** Check if this is a default/uninitialized NepaliDate (all zeros) */
export function isDefault(date: NepaliDate): boolean {
  return date.year === 0 && date.month === 0 && date.day === 0;
}

/** String representation: "YYYY/MM/DD" */
export function toString(date: NepaliDate): string {
  return `${String(date.year).padStart(4, '0')}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`;
}
