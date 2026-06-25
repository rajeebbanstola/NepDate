/**
 * BS↔AD calendar conversion engine.
 * Port of the .NET NepDate DictionaryBridge.
 */
import { NEPALI_TO_ENGLISH } from '../data/nepaliToEnglish';
import { ENGLISH_TO_NEPALI } from '../data/englishToNepali';
import { MIN_YEAR, MAX_YEAR } from '../constants';
import type { NepaliDate } from '../types';

/** Get the span entry for a Nepali date: [nepMonthEndDay, engYear, engMonth, engDay] */
function getNepToEngIndex(nepYear: number, nepMonth: number): number {
  return (nepYear - MIN_YEAR) * 12 + (nepMonth - 1);
}

function checkNepIndex(index: number): void {
  if (index < 0 || index >= NEPALI_TO_ENGLISH.length) {
    throw new RangeError(`Nepali date outside supported range (${MIN_YEAR}–${MAX_YEAR} BS)`);
  }
}

/**
 * Convert a Nepali date to Gregorian Date.
 */
export function toEnglishDate(nepYear: number, nepMonth: number, nepDay: number): Date {
  const index = getNepToEngIndex(nepYear, nepMonth);
  checkNepIndex(index);
  const [nepMonthEndDay, engYear, engMonth, engDay] = NEPALI_TO_ENGLISH[index];
  const daysDiff = nepDay - nepMonthEndDay;
  return new Date(engYear, engMonth - 1, engDay + daysDiff);
}

/**
 * Get days in a Nepali month.
 */
export function getNepaliMonthEndDay(nepYear: number, nepMonth: number): number {
  const index = getNepToEngIndex(nepYear, nepMonth);
  checkNepIndex(index);
  return NEPALI_TO_ENGLISH[index][0];
}

/**
 * Safe version - returns 0 on failure instead of throwing.
 */
export function tryGetNepaliMonthEndDay(nepYear: number, nepMonth: number): number {
  const index = getNepToEngIndex(nepYear, nepMonth);
  if (index < 0 || index >= NEPALI_TO_ENGLISH.length) return 0;
  return NEPALI_TO_ENGLISH[index][0];
}

/**
 * Convert a Gregorian date to Nepali date.
 */
export function toNepaliDate(engYear: number, engMonth: number, engDay: number): NepaliDate {
  const MIN_ENG_YEAR = 1844;
  const MIN_ENG_MONTH = 4;
  const index = (engYear - MIN_ENG_YEAR) * 12 + (engMonth - MIN_ENG_MONTH);
  if (index < 0 || index >= ENGLISH_TO_NEPALI.length) {
    throw new RangeError('English date outside supported conversion range');
  }
  const [engMonthEndDay, nepYear, nepMonth, nepDay] = ENGLISH_TO_NEPALI[index];
  const daysToSubtract = engMonthEndDay - engDay;
  if (daysToSubtract === 0) {
    return { year: nepYear, month: nepMonth, day: nepDay };
  }
  return subtractNepaliDays(nepYear, nepMonth, nepDay, daysToSubtract);
}

function subtractNepaliDays(year: number, month: number, day: number, days: number): NepaliDate {
  let newDay = day - days;
  let y = year;
  let m = month;
  while (newDay <= 0) {
    if (m === 1) {
      y--;
      m = 12;
    } else {
      m--;
    }
    newDay += getNepaliMonthEndDay(y, m);
  }
  return { year: y, month: m, day: newDay };
}

/**
 * Check if a Nepali date is valid (within range and correct month day count).
 */
export function isValidNepaliDate(year: number, month: number, day: number): boolean {
  if (year < MIN_YEAR || year > MAX_YEAR) return false;
  if (month < 1 || month > 12) return false;
  const endDay = tryGetNepaliMonthEndDay(year, month);
  if (endDay === 0) return false;
  return day >= 1 && day <= endDay;
}
