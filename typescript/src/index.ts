/**
 * NepDate - Nepali Date (Bikram Sambat) library with date-fns compatible API.
 */

// Types - use export type for isolatedModules
export type { NepaliDate, CalendarInfo, NepaliDateRange } from './types';
export { DateFormats, Separators, NepaliMonths, FiscalYearQuarters } from './types';

// Constants (non-type exports)
export {
  NEPALI_MONTH_NAMES_EN,
  NEPALI_MONTH_NAMES_NP,
  WEEKDAY_NAMES_NP,
  SEPARATOR_CHARS,
} from './types';

export {
  MIN_YEAR,
  MAX_YEAR,
  APPROX_DAYS_PER_MONTH,
  MIN_VALUE,
  getMaxValue,
} from './constants';

// Constructors
export {
  nepaliDate,
  now,
  today,
  fromJSDate,
  fromGregorian,
  parse,
  tryParse,
} from './constructors';

// Getters
export {
  getYear,
  getMonth,
  getDay,
  getEnglishDate,
  getDayOfWeek,
  getDayOfYear,
  getDaysInMonth,
  getMonthName,
  getMonthNameNp,
} from './getters';

// Manipulation
export {
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  set,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from './manipulation';

// Comparison
export {
  isEqual,
  isBefore,
  isAfter,
  isSameOrBefore,
  isSameOrAfter,
  compareAsc,
  compareDesc,
  min,
  max,
} from './comparison';

// Difference
export {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  differenceInWeeks,
} from './difference';

// Formatting
export {
  formatDefault,
  format,
  toLongDateString,
  toUnicodeString,
  toLongDateUnicodeString,
  formatCustom,
} from './formatting';

// Smart Parse
export {
  smartParse,
  trySmartParse,
  stringToNepaliDate,
  tryStringToNepaliDate,
} from './smartParse';

// Calendar
export {
  getCalendarInfo,
  getTithiNp,
  getTithiEn,
  getIsPublicHoliday,
  getEventsNp,
  getEventsEn,
} from './calendar';

// Fiscal Year
export {
  getFiscalYear,
  getFiscalYearStartDate,
  getFiscalYearEndDate,
  getFiscalYearStartAndEndDate,
  getFiscalYearQuarter,
  getFiscalYearQuarterStartDate,
  getFiscalYearQuarterEndDate,
  getFiscalYearQuarterStartAndEndDate,
  getFiscalYearStartDateByYear,
  getFiscalYearEndDateByYear,
  getFiscalYearStartAndEndDateByYear,
  getFiscalYearQuarterStartDateByYear,
  getFiscalYearQuarterEndDateByYear,
} from './fiscalYear';

// Range / Interval
export {
  interval,
  singleDayRange,
  dayCountRange,
  monthRange,
  fiscalYearRange,
  calendarYearRange,
  currentMonthRange,
  currentFiscalYearRange,
  currentCalendarYearRange,
  isWithinRange,
  areRangesOverlapping,
  areRangesAdjacent,
  intersectRanges,
  unionRanges,
  excludeRanges,
  splitRangeByMonth,
  splitRangeByFiscalQuarter,
  eachDayOfInterval,
  datesWithInterval,
  getWorkingDays,
  getWeekendDays,
} from './range';

// Misc
export {
  isLeapYear,
  isToday,
  isYesterday,
  isTomorrow,
  isDefault,
  toString,
} from './misc';

// Bulk
export {
  bulkToNepaliDates,
  bulkToEnglishDates,
  bulkStringsToEnglishDates,
} from './bulk';

// Internal (for advanced use)
export {
  toEnglishDate,
  toNepaliDate,
  isValidNepaliDate,
  getNepaliMonthEndDay,
} from './internal/conversion';
