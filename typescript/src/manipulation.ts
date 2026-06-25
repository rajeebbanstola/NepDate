/**
 * Manipulation functions - add/subtract/set dates.
 */
import type { NepaliDate } from './types';
import { toEnglishDate, toNepaliDate, getNepaliMonthEndDay } from './internal/conversion';
import { APPROX_DAYS_PER_MONTH } from './constants';

function clone(date: NepaliDate): NepaliDate {
  return { year: date.year, month: date.month, day: date.day };
}

// ---- Add / Subtract (returns days as-is since NepaliDate is date-only) ---- 

/**
 * Add a specified number of days to a NepaliDate.
 * Negative values subtract days.
 */
export function addDays(date: NepaliDate, amount: number): NepaliDate {
  const eng = toEnglishDate(date.year, date.month, date.day);
  eng.setDate(eng.getDate() + Math.round(amount));
  return toNepaliDate(eng.getFullYear(), eng.getMonth() + 1, eng.getDate());
}

/**
 * Subtract days from a NepaliDate.
 */
export function subDays(date: NepaliDate, amount: number): NepaliDate {
  return addDays(date, -amount);
}

/**
 * Add months to a NepaliDate.
 * @param awayFromMonthEnd - When true, overflow days carry into next month instead of clamping
 */
export function addMonths(
  date: NepaliDate,
  amount: number,
  awayFromMonthEnd = false
): NepaliDate {
  if (amount < 0) return subMonths(date, -amount, awayFromMonthEnd);

  // Handle fractional months
  if (!Number.isInteger(amount)) {
    return addDays(date, Math.round(amount * APPROX_DAYS_PER_MONTH));
  }

  let year = date.year;
  let month = date.month + amount;
  while (month > 12) { year++; month -= 12; }

  const ref = { year, month, day: 1 };
  const endDay = getNepaliMonthEndDay(year, month);

  let day: number;
  if (awayFromMonthEnd && date.day > endDay) {
    day = date.day - endDay;
    month++;
    if (month > 12) { year++; month = 1; }
  } else {
    day = Math.min(endDay, date.day);
  }

  return { year, month, day };
}

/**
 * Subtract months from a NepaliDate.
 */
export function subMonths(
  date: NepaliDate,
  amount: number,
  awayFromMonthEnd = false
): NepaliDate {
  if (amount < 0) return addMonths(date, -amount, awayFromMonthEnd);

  if (!Number.isInteger(amount)) {
    return addDays(date, -Math.round(amount * APPROX_DAYS_PER_MONTH));
  }

  let year = date.year;
  let month = date.month - amount;
  while (month < 1) { year--; month += 12; }

  const endDay = getNepaliMonthEndDay(year, month);

  let day: number;
  if (awayFromMonthEnd && date.day > endDay) {
    day = date.day - endDay;
    month++;
    if (month > 12) { year++; month = 1; }
  } else {
    day = Math.min(endDay, date.day);
  }

  return { year, month, day };
}

/**
 * Add years to a NepaliDate.
 */
export function addYears(date: NepaliDate, amount: number): NepaliDate {
  return addMonths(date, amount * 12);
}

/**
 * Subtract years from a NepaliDate.
 */
export function subYears(date: NepaliDate, amount: number): NepaliDate {
  return addMonths(date, -amount * 12);
}

// ---- Set ----

/**
 * Set year, month, and/or day on a NepaliDate.
 * Only provided fields are changed. Unchanged fields retain their values.
 */
export function set(
  date: NepaliDate,
  values: { year?: number; month?: number; day?: number }
): NepaliDate {
  const year = values.year ?? date.year;
  const month = values.month ?? date.month;
  let day = values.day ?? date.day;

  // Clamp day to month length
  const endDay = getNepaliMonthEndDay(year, month);
  if (day > endDay) day = endDay;

  return { year, month, day };
}

// ---- Start / End of units ----

/**
 * Get the first day of the month.
 */
export function startOfMonth(date: NepaliDate): NepaliDate {
  return { year: date.year, month: date.month, day: 1 };
}

/**
 * Get the last day of the month.
 */
export function endOfMonth(date: NepaliDate): NepaliDate {
  const endDay = getNepaliMonthEndDay(date.year, date.month);
  return { year: date.year, month: date.month, day: endDay };
}

/**
 * Get the first day of the year (1 Baishakh).
 */
export function startOfYear(date: NepaliDate): NepaliDate {
  return { year: date.year, month: 1, day: 1 };
}

/**
 * Get the last day of the year (last day of Chaitra).
 */
export function endOfYear(date: NepaliDate): NepaliDate {
  const endDay = getNepaliMonthEndDay(date.year, 12);
  return { year: date.year, month: 12, day: endDay };
}
