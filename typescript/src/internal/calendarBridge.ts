/**
 * Calendar data bridge - Tithi, holidays, events.
 * Port of the .NET CalendarBridge.
 */
import {
  CALENDAR_OFFSETS_BASE_YEAR,
  CALENDAR_OFFSETS_YEAR_COUNT,
  CALENDAR_MONTH_START,
} from '../data/calendarOffsets';
import { CALENDAR_STRINGS_POOL } from '../data/calendarStrings';
import { TITHI_DAY_OFFSETS, TITHI_POOL_IDS } from '../data/tithiData';
import { HOLIDAY_DAY_OFFSETS } from '../data/holidayData';
import { EVENT_DAY_OFFSETS, EVENT_SLICE_START, EVENT_ENTRIES } from '../data/eventData';
import type { CalendarInfo } from '../types';

/** Compute the absolute day offset within the calendar data range (2001–2089 BS). */
function getDayOffset(year: number, month: number, day: number): number {
  const y = year - CALENDAR_OFFSETS_BASE_YEAR;
  if (y < 0 || y >= CALENDAR_OFFSETS_YEAR_COUNT) return -1;
  return CALENDAR_MONTH_START[y * 12 + (month - 1)] + (day - 1);
}

/** Binary search helper (sorted arrays). */
function binarySearch(arr: readonly number[], val: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const midVal = arr[mid];
    if (midVal < val) lo = mid + 1;
    else if (midVal > val) hi = mid - 1;
    else return mid;
  }
  return ~lo; // not found, bitwise complement
}

function findIndex(sortedArr: readonly number[], val: number): number {
  const idx = binarySearch(sortedArr, val);
  return idx >= 0 ? idx : -1;
}

function hasValue(sortedArr: readonly number[], val: number): boolean {
  return binarySearch(sortedArr, val) >= 0;
}

/** Convert array of pool indices to Nepali event strings. */
function poolNp(indices: number[]): string[] {
  return indices.map(i => CALENDAR_STRINGS_POOL[i][0]);
}

/** Convert array of pool indices to English event strings. */
function poolEn(indices: number[]): string[] {
  return indices.map(i => CALENDAR_STRINGS_POOL[i][1]);
}

export function getCalendarInfo(year: number, month: number, day: number): CalendarInfo {
  const offset = getDayOffset(year, month, day);
  if (offset < 0) {
    return { tithiNp: '', tithiEn: '', isPublicHoliday: false, eventsNp: [], eventsEn: [] };
  }

  // Tithi
  let tithiNp = '', tithiEn = '';
  const ti = findIndex(TITHI_DAY_OFFSETS, offset);
  if (ti >= 0) {
    const poolIdx = TITHI_POOL_IDS[ti];
    tithiNp = CALENDAR_STRINGS_POOL[poolIdx][0];
    tithiEn = CALENDAR_STRINGS_POOL[poolIdx][1];
  }

  // Holiday
  const isPublicHoliday = hasValue(HOLIDAY_DAY_OFFSETS, offset);

  // Events
  let eventsNp: string[] = [];
  let eventsEn: string[] = [];
  const ei = findIndex(EVENT_DAY_OFFSETS, offset);
  if (ei >= 0) {
    const start = EVENT_SLICE_START[ei];
    const end = EVENT_SLICE_START[ei + 1];
    const poolIndices: number[] = [];
    for (let i = start; i < end; i++) {
      poolIndices.push(EVENT_ENTRIES[i]);
    }
    eventsNp = poolNp(poolIndices);
    eventsEn = poolEn(poolIndices);
  }

  return { tithiNp, tithiEn, isPublicHoliday, eventsNp, eventsEn };
}

export function getTithiNp(year: number, month: number, day: number): string {
  const offset = getDayOffset(year, month, day);
  if (offset < 0) return '';
  const ti = findIndex(TITHI_DAY_OFFSETS, offset);
  if (ti < 0) return '';
  return CALENDAR_STRINGS_POOL[TITHI_POOL_IDS[ti]][0];
}

export function getTithiEn(year: number, month: number, day: number): string {
  const offset = getDayOffset(year, month, day);
  if (offset < 0) return '';
  const ti = findIndex(TITHI_DAY_OFFSETS, offset);
  if (ti < 0) return '';
  return CALENDAR_STRINGS_POOL[TITHI_POOL_IDS[ti]][1];
}

export function isHoliday(year: number, month: number, day: number): boolean {
  const offset = getDayOffset(year, month, day);
  if (offset < 0) return false;
  return hasValue(HOLIDAY_DAY_OFFSETS, offset);
}

export function getEventsNp(year: number, month: number, day: number): string[] {
  const offset = getDayOffset(year, month, day);
  if (offset < 0) return [];
  const ei = findIndex(EVENT_DAY_OFFSETS, offset);
  if (ei < 0) return [];
  const start = EVENT_SLICE_START[ei];
  const end = EVENT_SLICE_START[ei + 1];
  const indices: number[] = [];
  for (let i = start; i < end; i++) indices.push(EVENT_ENTRIES[i]);
  return poolNp(indices);
}

export function getEventsEn(year: number, month: number, day: number): string[] {
  const offset = getDayOffset(year, month, day);
  if (offset < 0) return [];
  const ei = findIndex(EVENT_DAY_OFFSETS, offset);
  if (ei < 0) return [];
  const start = EVENT_SLICE_START[ei];
  const end = EVENT_SLICE_START[ei + 1];
  const indices: number[] = [];
  for (let i = start; i < end; i++) indices.push(EVENT_ENTRIES[i]);
  return poolEn(indices);
}
