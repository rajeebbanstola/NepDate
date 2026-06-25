/**
 * Represents a date in the Nepali calendar system (Bikram Sambat).
 * Immutable value type with year, month, and day components.
 */
export interface NepaliDate {
  /** Bikram Sambat year (1901–2199) */
  readonly year: number;
  /** Nepali month (1 = Baishakh, 12 = Chaitra) */
  readonly month: number;
  /** Day of month (1–32 depending on month/year) */
  readonly day: number;
}

/**
 * Calendar metadata snapshot for a specific Nepali date.
 */
export interface CalendarInfo {
  /** Tithi (lunar day) name in Nepali Devanagari */
  readonly tithiNp: string;
  /** Tithi (lunar day) name transliterated to English */
  readonly tithiEn: string;
  /** Whether this date is a gazetted public holiday in Nepal */
  readonly isPublicHoliday: boolean;
  /** Event/observance names in Nepali Devanagari */
  readonly eventsNp: string[];
  /** Event/observance names transliterated to English */
  readonly eventsEn: string[];
}

/**
 * Defines the order of date components in formatted output.
 */
export enum DateFormats {
  /** Year-Month-Day: 2081/01/15 */
  YearMonthDay = 0,
  /** Year-Day-Month: 2081/15/01 */
  YearDayMonth = 1,
  /** Month-Year-Day: 01/2081/15 */
  MonthYearDay = 2,
  /** Month-Day-Year: 01/15/2081 */
  MonthDayYear = 3,
  /** Day-Year-Month: 15/2081/01 */
  DayYearMonth = 4,
  /** Day-Month-Year: 15/01/2081 */
  DayMonthYear = 5,
}

/**
 * Separator character between date components.
 */
export enum Separators {
  ForwardSlash = 0,   // "/"
  BackwardSlash = 1,  // "\"
  Dot = 2,            // "."
  Underscore = 3,     // "_"
  Dash = 4,           // "-"
  Space = 5,          // " "
}

/**
 * Twelve months of the Bikram Sambat calendar.
 */
export enum NepaliMonths {
  Baishakh = 1,
  Jestha = 2,
  Ashad = 3,
  Shrawan = 4,
  Bhadra = 5,
  Ashoj = 6,
  Kartik = 7,
  Mangsir = 8,
  Poush = 9,
  Magh = 10,
  Falgun = 11,
  Chaitra = 12,
}

/** Nepali month names in English */
export const NEPALI_MONTH_NAMES_EN: Record<number, string> = {
  1: 'Baishakh', 2: 'Jestha', 3: 'Ashad', 4: 'Shrawan',
  5: 'Bhadra', 6: 'Ashoj', 7: 'Kartik', 8: 'Mangsir',
  9: 'Poush', 10: 'Magh', 11: 'Falgun', 12: 'Chaitra',
};

/** Nepali month names in Devanagari Unicode */
export const NEPALI_MONTH_NAMES_NP: Record<number, string> = {
  1: 'बैशाख', 2: 'जेठ', 3: 'असार', 4: 'साउन',
  5: 'भदौ', 6: 'असोज', 7: 'कार्तिक', 8: 'मंसिर',
  9: 'पुष', 10: 'माघ', 11: 'फागुन', 12: 'चैत',
};

/** English weekday names in Devanagari Unicode */
export const WEEKDAY_NAMES_NP: Record<string, string> = {
  Sunday: 'आइतवार', Monday: 'सोमवार', Tuesday: 'मङ्गलवार',
  Wednesday: 'बुधवार', Thursday: 'बिहिवार', Friday: 'शुक्रवार',
  Saturday: 'शनिवार',
};

/**
 * Fiscal year quarters in the Nepali calendar.
 */
export enum FiscalYearQuarters {
  Current = 0,
  First = 4,     // Shrawan–Ashoj (months 4–6)
  Second = 7,    // Kartik–Poush (months 7–9)
  Third = 10,    // Magh–Chaitra (months 10–12)
  Fourth = 1,    // Baishakh–Ashad (months 1–3)
}

/** Internal: the separator character for each Separators enum value */
export const SEPARATOR_CHARS: Record<Separators, string> = {
  [Separators.ForwardSlash]: '/',
  [Separators.BackwardSlash]: '\\',
  [Separators.Dot]: '.',
  [Separators.Underscore]: '_',
  [Separators.Dash]: '-',
  [Separators.Space]: ' ',
};

/** Range (interval) of Nepali dates */
export interface NepaliDateRange {
  readonly start: NepaliDate;
  readonly end: NepaliDate;
  readonly isEmpty: boolean;
  readonly length: number;
}
