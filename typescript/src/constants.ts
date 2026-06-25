import type { NepaliDate } from './types';
import { getNepaliMonthEndDay } from './internal/conversion';

/** Minimum supported Nepali year */
export const MIN_YEAR = 1901;

/** Maximum supported Nepali year */
export const MAX_YEAR = 2199;

/** Approximate days per Nepali month (365.25 / 12) */
export const APPROX_DAYS_PER_MONTH = 30.436875;

/** Minimum supported Nepali date: 1 Baishakh 1901 BS */
export const MIN_VALUE: Readonly<NepaliDate> = Object.freeze({ year: MIN_YEAR, month: 1, day: 1 });

let _maxValue: NepaliDate | null = null;

/** Maximum supported Nepali date: last day of Chaitra 2199 BS */
export function getMaxValue(): NepaliDate {
  if (!_maxValue) {
    const endDay = getNepaliMonthEndDay(MAX_YEAR, 12);
    _maxValue = Object.freeze({ year: MAX_YEAR, month: 12, day: endDay });
  }
  return _maxValue;
}

/** Devanagari digit characters ०-९ */
export const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
