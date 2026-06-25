/**
 * Date range (interval) operations for Nepali dates.
 * Port of .NET NepaliDateRange.
 */
import type { NepaliDate } from './types';
import { now, fromJSDate } from './constructors';
import { addDays } from './manipulation';
import { getDayOfWeek } from './getters';
import {
  getNepaliMonthEndDay,
  toEnglishDate,
} from './internal/conversion';

function _dateToMs(d: NepaliDate): number {
  return toEnglishDate(d.year, d.month, d.day).getTime();
}

function _diffDays(a: NepaliDate, b: NepaliDate): number {
  return Math.round((_dateToMs(a) - _dateToMs(b)) / 86400000);
}

export interface NepaliDateRange {
  readonly start: NepaliDate;
  readonly end: NepaliDate;
  readonly isEmpty: boolean;
  readonly length: number;
}

function makeRange(start: NepaliDate, end: NepaliDate): NepaliDateRange {
  const empty = _cmp(start, end) > 0;
  const len = empty ? 0 : Math.abs(_diffDays(end, start)) + 1;
  return { start, end, isEmpty: empty, length: len };
}

function _isBefore(a: NepaliDate, b: NepaliDate): boolean {
  const v = a.year * 10000 + a.month * 100 + a.day;
  const w = b.year * 10000 + b.month * 100 + b.day;
  return v < w;
}

function _isAfter(a: NepaliDate, b: NepaliDate): boolean {
  const v = a.year * 10000 + a.month * 100 + a.day;
  const w = b.year * 10000 + b.month * 100 + b.day;
  return v > w;
}

function _isEqual(a: NepaliDate, b: NepaliDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function _cmp(a: NepaliDate, b: NepaliDate): number {
  const v = a.year * 10000 + a.month * 100 + a.day;
  const w = b.year * 10000 + b.month * 100 + b.day;
  if (v < w) return -1;
  if (v > w) return 1;
  return 0;
}

// ---- Constructors / Factory Methods ----

/** Create a range from start to end (inclusive) */
export function interval(start: NepaliDate, end: NepaliDate): NepaliDateRange {
  return makeRange(start, end);
}

/** Create a single-day range */
export function singleDayRange(date: NepaliDate): NepaliDateRange {
  return makeRange(date, date);
}

/** Create a range spanning N days from a start date */
export function dayCountRange(start: NepaliDate, days: number): NepaliDateRange {
  if (days < 1) throw new RangeError('Days must be at least 1');
  return makeRange(start, addDays(start, days - 1));
}

/** Create a range for an entire Nepali month */
export function monthRange(year: number, month: number): NepaliDateRange {
  const firstDay: NepaliDate = { year, month, day: 1 };
  const endDay = getNepaliMonthEndDay(year, month);
  const lastDay: NepaliDate = { year, month, day: endDay };
  return makeRange(firstDay, lastDay);
}

/** Create a range for an entire fiscal year */
export function fiscalYearRange(fiscalYear: number): NepaliDateRange {
  const firstDay: NepaliDate = { year: fiscalYear, month: 4, day: 1 };
  const nextYear = fiscalYear + 1;
  const endDay = getNepaliMonthEndDay(nextYear, 3);
  const lastDay: NepaliDate = { year: nextYear, month: 3, day: endDay };
  return makeRange(firstDay, lastDay);
}

/** Create a range for an entire calendar year */
export function calendarYearRange(year: number): NepaliDateRange {
  const firstDay: NepaliDate = { year, month: 1, day: 1 };
  const endDay = getNepaliMonthEndDay(year, 12);
  const lastDay: NepaliDate = { year, month: 12, day: endDay };
  return makeRange(firstDay, lastDay);
}

/** Create a range for the current Nepali month */
export function currentMonthRange(): NepaliDateRange {
  const today = now();
  return monthRange(today.year, today.month);
}

/** Create a range for the current fiscal year */
export function currentFiscalYearRange(): NepaliDateRange {
  const today = now();
  const fy = today.month >= 4 ? today.year : today.year - 1;
  return fiscalYearRange(fy);
}

/** Create a range for the current calendar year */
export function currentCalendarYearRange(): NepaliDateRange {
  const today = now();
  return calendarYearRange(today.year);
}

// ---- Query Methods ----

/** Check if a date is within a range */
export function isWithinRange(date: NepaliDate, range: NepaliDateRange): boolean {
  if (range.isEmpty) return false;
  return (_isEqual(date, range.start) || _isAfter(date, range.start)) &&
         (_isEqual(date, range.end) || _isBefore(date, range.end));
}

/** Check if a range fully contains another range */
export function isRangeContaining(outer: NepaliDateRange, inner: NepaliDateRange): boolean {
  if (outer.isEmpty) return false;
  if (inner.isEmpty) return true;
  return (_isEqual(inner.start, outer.start) || _isAfter(inner.start, outer.start)) &&
         (_isEqual(inner.end, outer.end) || _isBefore(inner.end, outer.end));
}

/** Check if two ranges overlap */
export function areRangesOverlapping(a: NepaliDateRange, b: NepaliDateRange): boolean {
  if (a.isEmpty || b.isEmpty) return false;
  return (_isEqual(a.start, b.end) || _isBefore(a.start, b.end)) &&
         (_isEqual(a.end, b.start) || _isAfter(a.end, b.start));
}

/** Check if two ranges are adjacent (end + 1 = start of the other) */
export function areRangesAdjacent(a: NepaliDateRange, b: NepaliDateRange): boolean {
  if (a.isEmpty || b.isEmpty) return false;
  return _isEqual(addDays(a.end, 1), b.start) || _isEqual(addDays(b.end, 1), a.start);
}

// ---- Set Operations ----

/** Compute the intersection of two ranges */
export function intersectRanges(a: NepaliDateRange, b: NepaliDateRange): NepaliDateRange {
  if (a.isEmpty || b.isEmpty || !areRangesOverlapping(a, b)) {
    return makeRange(a.start, addDays(a.start, -1)); // empty
  }
  const start = _isAfter(a.start, b.start) ? a.start : b.start;
  const end = _isBefore(a.end, b.end) ? a.end : b.end;
  return makeRange(start, end);
}

/** Compute the union of two ranges (fills gaps between them) */
export function unionRanges(a: NepaliDateRange, b: NepaliDateRange): NepaliDateRange {
  if (a.isEmpty) return b;
  if (b.isEmpty) return a;
  const start = _isBefore(a.start, b.start) ? a.start : b.start;
  const end = _isAfter(a.end, b.end) ? a.end : b.end;
  return makeRange(start, end);
}

/** Compute a - b: range(s) from a with b removed */
export function excludeRanges(a: NepaliDateRange, b: NepaliDateRange): NepaliDateRange[] {
  if (a.isEmpty || !areRangesOverlapping(a, b)) return [a];
  if (isRangeContaining(b, a)) return [];

  const result: NepaliDateRange[] = [];
  if (_isBefore(a.start, b.start)) {
    result.push(makeRange(a.start, addDays(b.start, -1)));
  }
  if (_isAfter(a.end, b.end)) {
    result.push(makeRange(addDays(b.end, 1), a.end));
  }
  return result;
}

// ---- Split Operations ----

/** Split a range into array of month ranges */
export function splitRangeByMonth(range: NepaliDateRange): NepaliDateRange[] {
  if (range.isEmpty) return [];
  const result: NepaliDateRange[] = [];
  let current = range.start;
  while (_isEqual(current, range.end) || _isBefore(current, range.end)) {
    const monthEndDay = getNepaliMonthEndDay(current.year, current.month);
    let monthEnd: NepaliDate = { year: current.year, month: current.month, day: monthEndDay };
    if (_isAfter(monthEnd, range.end)) monthEnd = range.end;
    result.push(makeRange(current, monthEnd));
    if (current.month === 12) {
      current = { year: current.year + 1, month: 1, day: 1 };
    } else {
      current = { year: current.year, month: current.month + 1, day: 1 };
    }
  }
  return result;
}

/** Split a range into array of fiscal quarter ranges */
export function splitRangeByFiscalQuarter(range: NepaliDateRange): NepaliDateRange[] {
  if (range.isEmpty) return [];
  const result: NepaliDateRange[] = [];
  let current = range.start;
  while (_isEqual(current, range.end) || _isBefore(current, range.end)) {
    let endQuarterMonth: number;
    if (current.month >= 1 && current.month <= 3) endQuarterMonth = 3;
    else if (current.month >= 4 && current.month <= 6) endQuarterMonth = 6;
    else if (current.month >= 7 && current.month <= 9) endQuarterMonth = 9;
    else endQuarterMonth = 12;
    const qEndDay = getNepaliMonthEndDay(current.year, endQuarterMonth);
    let quarterEnd: NepaliDate = { year: current.year, month: endQuarterMonth, day: qEndDay };
    if (_isAfter(quarterEnd, range.end)) quarterEnd = range.end;
    result.push(makeRange(current, quarterEnd));
    if (endQuarterMonth === 12) {
      current = { year: current.year + 1, month: 1, day: 1 };
    } else {
      current = { year: current.year, month: endQuarterMonth + 1, day: 1 };
    }
  }
  return result;
}

// ---- Iteration Helpers ----

/** Get an array of every date in a range (step = 1 day) */
export function eachDayOfInterval(range: NepaliDateRange): NepaliDate[] {
  if (range.isEmpty) return [];
  const result: NepaliDate[] = [];
  let current = range.start;
  while (_isEqual(current, range.end) || _isBefore(current, range.end)) {
    result.push(current);
    current = addDays(current, 1);
  }
  return result;
}

/** Get dates in a range at a specified interval */
export function datesWithInterval(range: NepaliDateRange, intervalDays: number): NepaliDate[] {
  if (intervalDays < 1) throw new RangeError('Interval must be at least 1');
  if (range.isEmpty) return [];
  const result: NepaliDate[] = [];
  let current = range.start;
  while (_isEqual(current, range.end) || _isBefore(current, range.end)) {
    result.push(current);
    current = addDays(current, intervalDays);
  }
  return result;
}

/** Get working days (excludes Saturday, optionally Sunday) */
export function getWorkingDays(range: NepaliDateRange, excludeSunday = false): NepaliDate[] {
  if (range.isEmpty) return [];
  const result: NepaliDate[] = [];
  let current = range.start;
  while (_isEqual(current, range.end) || _isBefore(current, range.end)) {
    const dow = getDayOfWeek(current);
    if (dow !== 6 && (!excludeSunday || dow !== 0)) {
      result.push(current);
    }
    current = addDays(current, 1);
  }
  return result;
}

/** Get weekend days (Saturdays, optionally Sundays) */
export function getWeekendDays(range: NepaliDateRange, includeSunday = true): NepaliDate[] {
  if (range.isEmpty) return [];
  const result: NepaliDate[] = [];
  let current = range.start;
  while (_isEqual(current, range.end) || _isBefore(current, range.end)) {
    const dow = getDayOfWeek(current);
    if (dow === 6 || (includeSunday && dow === 0)) {
      result.push(current);
    }
    current = addDays(current, 1);
  }
  return result;
}
