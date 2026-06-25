/**
 * Difference functions - compute intervals between dates.
 */
import type { NepaliDate } from './types';
import { toEnglishDate } from './internal/conversion';

/** Get the Gregorian Date at midnight */
function toMidnight(date: NepaliDate): Date {
  return toEnglishDate(date.year, date.month, date.day);
}

/** Difference in whole days between two NepaliDates */
export function differenceInDays(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  const ms = toMidnight(dateLeft).getTime() - toMidnight(dateRight).getTime();
  return Math.round(ms / 86400000);
}

/** 
 * Difference in calendar months between two NepaliDates.
 * Returns the number of whole months the left date is after the right date.
 * Partial months are truncated.
 */
export function differenceInMonths(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  let months = (dateLeft.year - dateRight.year) * 12 + (dateLeft.month - dateRight.month);
  // Adjust if day is earlier in the month
  if (dateLeft.day < dateRight.day) {
    months--;
  }
  return months;
}

/**
 * Difference in calendar years between two NepaliDates.
 */
export function differenceInYears(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  let years = dateLeft.year - dateRight.year;
  if (dateLeft.month < dateRight.month || (dateLeft.month === dateRight.month && dateLeft.day < dateRight.day)) {
    years--;
  }
  return years;
}

/**
 * Difference in weeks between two NepaliDates.
 */
export function differenceInWeeks(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  return Math.floor(differenceInDays(dateLeft, dateRight) / 7);
}

/**
 * Clamp a duration to whole units from the perspective of the Nepali calendar.
 * Returns { years, months, days } representing the approximate gap.
 */
export function differenceInCalendarMonths(dateLeft: NepaliDate, dateRight: NepaliDate): number {
  return (dateLeft.year - dateRight.year) * 12 + (dateLeft.month - dateRight.month);
}
