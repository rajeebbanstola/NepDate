/**
 * Getter functions - access components of a NepaliDate.
 */
import type { NepaliDate } from './types';
import { toEnglishDate, getNepaliMonthEndDay } from './internal/conversion';
import { NEPALI_MONTH_NAMES_EN, NEPALI_MONTH_NAMES_NP } from './types';

/** Get the Bikram Sambat year */
export function getYear(date: NepaliDate): number {
  return date.year;
}

/** Get the Nepali month (1 = Baishakh, 12 = Chaitra) */
export function getMonth(date: NepaliDate): number {
  return date.month;
}

/** Get the day of month */
export function getDay(date: NepaliDate): number {
  return date.day;
}

/** Get the Gregorian equivalent as a JS Date */
export function getEnglishDate(date: NepaliDate): Date {
  return toEnglishDate(date.year, date.month, date.day);
}

/**
 * Get the day of week (0 = Sunday, 6 = Saturday).
 * Mirrors JS Date.getDay() convention.
 */
export function getDayOfWeek(date: NepaliDate): number {
  return getEnglishDate(date).getDay();
}

/**
 * Get the Nepali day of year (1-based).
 * Baisakh 1 = day 1, last day of Chaitra = day 365 or 366.
 */
export function getDayOfYear(date: NepaliDate): number {
  let total = 0;
  for (let m = 1; m < date.month; m++) {
    total += getNepaliMonthEndDay(date.year, m);
  }
  return total + date.day;
}

/** Get the number of days in the date's month (29–32) */
export function getDaysInMonth(date: NepaliDate): number {
  return getNepaliMonthEndDay(date.year, date.month);
}

/** Get the English name of the month */
export function getMonthName(date: NepaliDate): string {
  return NEPALI_MONTH_NAMES_EN[date.month] ?? '';
}

/** Get the Nepali (Devanagari) name of the month */
export function getMonthNameNp(date: NepaliDate): string {
  return NEPALI_MONTH_NAMES_NP[date.month] ?? '';
}

/** Get the Nepali month as an ordinal number (same as getMonth) */
export function getMonthOrdinal(date: NepaliDate): number {
  return date.month;
}
