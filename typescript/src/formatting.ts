/**
 * Formatting functions - format Nepali dates as strings.
 */
import type { NepaliDate } from './types';
import { DateFormats, Separators, SEPARATOR_CHARS, NEPALI_MONTH_NAMES_EN, WEEKDAY_NAMES_NP } from './types';
import { getDayOfWeek, getMonthName } from './getters';
import { UNICODE_MAP } from './data/unicode';
import { toEnglishDate } from './internal/conversion';

// ---- Internal helpers ----

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

function sepChar(s: Separators): string {
  return SEPARATOR_CHARS[s] ?? '/';
}

function formatComponents(
  year: number, month: number, day: number,
  fmt: DateFormats, sep: string, leading: boolean
): string {
  const y = leading ? pad(year, 4) : String(year);
  const m = leading ? pad(month, 2) : String(month);
  const d = leading ? pad(day, 2) : String(day);
  switch (fmt) {
    case DateFormats.YearMonthDay: return `${y}${sep}${m}${sep}${d}`;
    case DateFormats.YearDayMonth: return `${y}${sep}${d}${sep}${m}`;
    case DateFormats.MonthYearDay: return `${m}${sep}${y}${sep}${d}`;
    case DateFormats.MonthDayYear: return `${m}${sep}${d}${sep}${y}`;
    case DateFormats.DayYearMonth: return `${d}${sep}${y}${sep}${m}`;
    case DateFormats.DayMonthYear: return `${d}${sep}${m}${sep}${y}`;
    default: return `${y}/${m}/${d}`;
  }
}

function digitsToNepali(str: string): string {
  return str.replace(/[0-9]/g, c => String.fromCharCode(0x0966 + (c.charCodeAt(0) - 48)));
}

function weekdayNp(dayIndex: number): string {
  const names = ['आइतवार', 'सोमवार', 'मङ्गलवार', 'बुधवार', 'बिहिवार', 'शुक्रवार', 'शनिवार'];
  return names[dayIndex] ?? '';
}

function weekdayEn(dayIndex: number): string {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[dayIndex] ?? '';
}

// ---- Main formatting ----

/**
 * Default string representation "YYYY/MM/DD".
 */
export function formatDefault(date: NepaliDate): string {
  return `${pad(date.year, 4)}/${pad(date.month, 2)}/${pad(date.day, 2)}`;
}

/**
 * Format with custom component order, separator, and leading zeros.
 */
export function format(
  date: NepaliDate,
  dateFormat: DateFormats = DateFormats.YearMonthDay,
  separator: Separators = Separators.ForwardSlash,
  leadingZeros = true
): string {
  return formatComponents(date.year, date.month, date.day, dateFormat, sepChar(separator), leadingZeros);
}

/**
 * Long date format: "Baishakh 01, 2080" or "Monday, Baishakh 01, 2080".
 */
export function toLongDateString(
  date: NepaliDate,
  leadingZeros = true,
  displayDayName = false,
  displayYear = true
): string {
  const monthName = getMonthName(date);
  const m = leadingZeros ? pad(date.month, 2) : String(date.month);
  const d = leadingZeros ? pad(date.day, 2) : String(date.day);
  let result = `${monthName} ${d}`;
  if (displayYear) result += `, ${date.year}`;
  if (displayDayName) {
    const dow = weekdayEn(getDayOfWeek(date));
    result = `${dow}, ${result}`;
  }
  return result;
}

/**
 * Format with Nepali Unicode digits: "२०८०/०१/१५".
 */
export function toUnicodeString(
  date: NepaliDate,
  dateFormat: DateFormats = DateFormats.YearMonthDay,
  separator: Separators = Separators.ForwardSlash,
  leadingZeros = true
): string {
  const ascii = format(date, dateFormat, separator, leadingZeros);
  return digitsToNepali(ascii);
}

/**
 * Long date in Nepali: "बैशाख ०१, २०८०" or "शुक्रवार, बैशाख ०१, २०८०".
 */
export function toLongDateUnicodeString(
  date: NepaliDate,
  leadingZeros = true,
  displayDayName = false,
  displayYear = true
): string {
  const { year, month, day } = date;
  const monthNp = UNICODE_MAP[NEPALI_MONTH_NAMES_EN[month]] ?? '';
  const m = leadingZeros ? pad(month, 2) : String(month);
  const d = leadingZeros ? pad(day, 2) : String(day);
  let result = `${monthNp} ${digitsToNepali(d)}`;
  if (displayYear) result += `, ${digitsToNepali(String(year))}`;
  if (displayDayName) {
    const dow = weekdayNp(getDayOfWeek(date));
    result = `${dow}, ${result}`;
  }
  return result;
}

/**
 * Format with custom pattern tokens (similar to date-fns format).
 * Tokens: yyyy, yy, MMMM, MMM, MM, M, dd, d
 * Literal text wrapped in 'quotes' or escaped with backslash.
 */
export function formatCustom(date: NepaliDate, pattern: string): string {
  const { year, month, day } = date;
  let result = '';
  let i = 0;

  while (i < pattern.length) {
    const c = pattern[i];

    // Escaped char
    if (c === '\\' && i + 1 < pattern.length) {
      result += pattern[i + 1];
      i += 2;
      continue;
    }

    // Literal text in quotes
    if (c === "'") {
      i++;
      while (i < pattern.length && pattern[i] !== "'") {
        result += pattern[i];
        i++;
      }
      if (i < pattern.length) i++;
      continue;
    }

    // Year
    if (c === 'y') {
      const run = countRepeat(pattern, i, 'y');
      result += run >= 4 ? pad(year, 4) : pad(year % 100, 2);
      i += run;
      continue;
    }

    // Month
    if (c === 'M') {
      const run = countRepeat(pattern, i, 'M');
      if (run >= 4) result += getMonthName(date);
      else if (run === 3) result += getMonthName(date).substring(0, 3);
      else if (run === 2) result += pad(month, 2);
      else result += String(month);
      i += run;
      continue;
    }

    // Day
    if (c === 'd') {
      const run = countRepeat(pattern, i, 'd');
      result += run >= 2 ? pad(day, 2) : String(day);
      i += run;
      continue;
    }

    result += c;
    i++;
  }

  return result;
}

function countRepeat(s: string, start: number, char: string): number {
  let count = 0;
  while (start + count < s.length && s[start + count] === char) count++;
  return count;
}
