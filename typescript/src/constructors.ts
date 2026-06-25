/**
 * Constructor functions - create NepaliDate instances.
 */
import type { NepaliDate } from './types';
import { toEnglishDate, toNepaliDate, isValidNepaliDate } from './internal/conversion';

// ---- Internal helpers ----

function isValidDate(year: number, month: number, day: number): year is number {
  return isValidNepaliDate(year, month, day);
}

// ---- Constructors ----

/**
 * Create a NepaliDate from Bikram Sambat year, month, and day.
 * @throws RangeError if the date is invalid
 */
export function nepaliDate(year: number, month: number, day: number): NepaliDate {
  if (!isValidDate(year, month, day)) {
    throw new RangeError(
      `Invalid Nepali date: ${year}/${month}/${day}. Must be within 1901–2199 BS with valid month/day.`
    );
  }
  return { year, month, day };
}

/**
 * Get the current Nepali date (local time).
 */
export function now(): NepaliDate {
  const d = new Date();
  return toNepaliDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Get today's Nepali date (local time, midnight).
 */
export function today(): NepaliDate {
  return now();
}

/**
 * Create a NepaliDate from a Gregorian Date object.
 */
export function fromJSDate(date: Date): NepaliDate {
  return toNepaliDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * Create a NepaliDate from a Gregorian year, month, day.
 */
export function fromGregorian(year: number, month: number, day: number): NepaliDate {
  const jsDate = new Date(year, month - 1, day);
  return toNepaliDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}

/**
 * Parse a Nepali date string in strict YYYY/MM/DD format (or any common separator).
 * @param str - Date string like "2080/04/15", "2080-04-15", "2080.04.15"
 * @param autoAdjust - Apply heuristics for ambiguous input
 * @param monthInMiddle - For autoAdjust: if true, month is the middle component
 * @throws RangeError if parsing fails
 */
export function parse(
  str: string,
  autoAdjust?: boolean,
  monthInMiddle?: boolean
): NepaliDate {
  if (autoAdjust) {
    return parseAuto(str, monthInMiddle ?? true);
  }
  const parts = splitNumeric(str);
  if (!parts || parts.length !== 3) {
    throw new RangeError(`Cannot parse "${str}" as a Nepali date`);
  }
  const [year, month, day] = parts;
  if (!isValidDate(year, month, day)) {
    throw new RangeError(`Invalid Nepali date values: ${year}/${month}/${day}`);
  }
  return { year, month, day };
}

function parseAuto(str: string, monthInMiddle: boolean): NepaliDate {
  const parts = splitNumeric(str);
  if (!parts || parts.length !== 3) {
    throw new RangeError(`Cannot parse "${str}" as a Nepali date`);
  }
  let [year, month, day] = parts;

  if (day > 32) {
    [year, day] = [day, year];
  }
  if (!monthInMiddle) {
    [month, day] = [day, month];
  }
  if (month > 12 && day < 13) {
    [month, day] = [day, month];
  }
  if (year < 1000) {
    year = 2000 + year;
  }
  if (!isValidDate(year, month, day)) {
    throw new RangeError(`Invalid Nepali date (even after auto-adjust): ${year}/${month}/${day}`);
  }
  return { year, month, day };
}

/**
 * Try to parse a Nepali date string without throwing.
 * Returns null on failure.
 */
export function tryParse(str: string): NepaliDate | null {
  try {
    return parse(str);
  } catch {
    return null;
  }
}

// ---- Internal helpers ----

const SEPARATORS = /[-/._\\ |।]/;

function splitNumeric(str: string): number[] | null {
  const trimmed = str.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(SEPARATORS).filter(p => p.length > 0);
  if (parts.length !== 3) return null;
  const nums = parts.map(p => {
    const n = Number(p);
    return Number.isInteger(n) ? n : NaN;
  });
  if (nums.some(n => isNaN(n))) return null;
  return nums;
}
