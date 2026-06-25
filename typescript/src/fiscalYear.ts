/**
 * Fiscal year operations for the Nepali calendar.
 * Nepal's fiscal year: 1 Shrawan (month 4) to last day of Ashadh (month 3) of the next year.
 */
import type { NepaliDate } from './types';
import { FiscalYearQuarters } from './types';
import { getNepaliMonthEndDay } from './internal/conversion';
import { addMonths } from './manipulation';

// ---- Instance methods (given a date, find its containing FY info) ----

/** Get the fiscal year for a given date */
export function getFiscalYear(date: NepaliDate): number {
  return date.month >= 4 ? date.year : date.year - 1;
}

/** Get the start date (1 Shrawan) of the fiscal year containing this date */
export function getFiscalYearStartDate(date: NepaliDate, yearOffset = 0): NepaliDate {
  let baseFY = getFiscalYear(date) + yearOffset;
  return { year: baseFY, month: 4, day: 1 };
}

/** Get the end date (last day of Ashadh) of the fiscal year containing this date */
export function getFiscalYearEndDate(date: NepaliDate, yearOffset = 0): NepaliDate {
  let baseFY = getFiscalYear(date) + yearOffset;
  const endDay = getNepaliMonthEndDay(baseFY + 1, 3);
  return { year: baseFY + 1, month: 3, day: endDay };
}

/** Get both start and end of the fiscal year containing this date */
export function getFiscalYearStartAndEndDate(date: NepaliDate, yearOffset = 0): { start: NepaliDate; end: NepaliDate } {
  return {
    start: getFiscalYearStartDate(date, yearOffset),
    end: getFiscalYearEndDate(date, yearOffset),
  };
}

/** Get which fiscal quarter a date falls in */
export function getFiscalYearQuarter(date: NepaliDate): FiscalYearQuarters {
  if (date.month >= 4 && date.month <= 6) return FiscalYearQuarters.First;
  if (date.month >= 7 && date.month <= 9) return FiscalYearQuarters.Second;
  if (date.month >= 10 && date.month <= 12) return FiscalYearQuarters.Third;
  return FiscalYearQuarters.Fourth; // months 1-3
}

/** Get the start of the fiscal year quarter containing this date */
export function getFiscalYearQuarterStartDate(
  date: NepaliDate,
  quarter: FiscalYearQuarters = FiscalYearQuarters.Current,
  yearOffset = 0
): NepaliDate {
  if (quarter === FiscalYearQuarters.Current) quarter = getFiscalYearQuarter(date);
  let baseYear = date.month <= 3 ? date.year - 1 : date.year;
  if (quarter === FiscalYearQuarters.Fourth) baseYear++;
  return { year: baseYear + yearOffset, month: quarter as number, day: 1 };
}

/** Get the end of the fiscal year quarter containing this date */
export function getFiscalYearQuarterEndDate(
  date: NepaliDate,
  quarter: FiscalYearQuarters = FiscalYearQuarters.Current,
  yearOffset = 0
): NepaliDate {
  if (quarter === FiscalYearQuarters.Current) quarter = getFiscalYearQuarter(date);
  let baseYear = date.month <= 3 ? date.year - 1 : date.year;
  if (quarter === FiscalYearQuarters.Fourth) baseYear++;
  const endMonth = (quarter as number) + 2;
  const endDay = getNepaliMonthEndDay(baseYear + yearOffset, endMonth);
  return { year: baseYear + yearOffset, month: endMonth, day: endDay };
}

/** Get both start and end of the fiscal year quarter containing this date */
export function getFiscalYearQuarterStartAndEndDate(
  date: NepaliDate,
  quarter: FiscalYearQuarters = FiscalYearQuarters.Current,
  yearOffset = 0
): { start: NepaliDate; end: NepaliDate } {
  return {
    start: getFiscalYearQuarterStartDate(date, quarter, yearOffset),
    end: getFiscalYearQuarterEndDate(date, quarter, yearOffset),
  };
}

// ---- Static methods (given a fiscal year number directly) ----

/** Get start of a specific fiscal year */
export function getFiscalYearStartDateByYear(fiscalYear: number): NepaliDate {
  return { year: fiscalYear, month: 4, day: 1 };
}

/** Get end of a specific fiscal year */
export function getFiscalYearEndDateByYear(fiscalYear: number): NepaliDate {
  const endDay = getNepaliMonthEndDay(fiscalYear + 1, 3);
  return { year: fiscalYear + 1, month: 3, day: endDay };
}

/** Get both start and end of a specific fiscal year */
export function getFiscalYearStartAndEndDateByYear(fiscalYear: number): { start: NepaliDate; end: NepaliDate } {
  return {
    start: getFiscalYearStartDateByYear(fiscalYear),
    end: getFiscalYearEndDateByYear(fiscalYear),
  };
}

/** Get quarter start for a specific fiscal year + month */
export function getFiscalYearQuarterStartDateByYear(fiscalYear: number, month: number): NepaliDate {
  const temp: NepaliDate = { year: fiscalYear, month, day: 1 };
  return getFiscalYearQuarterStartDate(temp);
}

/** Get quarter end for a specific fiscal year + month */
export function getFiscalYearQuarterEndDateByYear(fiscalYear: number, month: number): NepaliDate {
  const temp: NepaliDate = { year: fiscalYear, month, day: 1 };
  return getFiscalYearQuarterEndDate(temp);
}
