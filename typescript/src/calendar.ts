/**
 * Calendar metadata - Tithi, holidays, events.
 */
import type { NepaliDate, CalendarInfo } from './types';
import {
  getCalendarInfo as _getCalendarInfo,
  getTithiNp as _getTithiNp,
  getTithiEn as _getTithiEn,
  isHoliday,
  getEventsNp as _getEventsNp,
  getEventsEn as _getEventsEn,
} from './internal/calendarBridge';

/** Get all calendar metadata for a Nepali date */
export function getCalendarInfo(date: NepaliDate): CalendarInfo {
  return _getCalendarInfo(date.year, date.month, date.day);
}

/** Get Tithi (lunar day) in Nepali */
export function getTithiNp(date: NepaliDate): string {
  return _getTithiNp(date.year, date.month, date.day);
}

/** Get Tithi (lunar day) in English */
export function getTithiEn(date: NepaliDate): string {
  return _getTithiEn(date.year, date.month, date.day);
}

/** Check if date is a public holiday in Nepal */
export function getIsPublicHoliday(date: NepaliDate): boolean {
  return isHoliday(date.year, date.month, date.day);
}

/** Get events in Nepali for a date */
export function getEventsNp(date: NepaliDate): string[] {
  return _getEventsNp(date.year, date.month, date.day);
}

/** Get events in English for a date */
export function getEventsEn(date: NepaliDate): string[] {
  return _getEventsEn(date.year, date.month, date.day);
}
