/**
 * Smart date parser - handles month names, Nepali unicode, and flexible formats.
 * Port of .NET SmartDateParser.
 */
import type { NepaliDate } from './types';
import { isValidNepaliDate } from './internal/conversion';

// ---- Month name mappings (150+ spellings) ----

const MONTH_NAMES: Record<string, number> = {
  // Baishakh (month 1)
  baisakh: 1, baishakh: 1, baisak: 1, vaisakh: 1, vaisakha: 1,
  vaishak: 1, vaisakhi: 1, beshak: 1, baishak: 1,
  baisaga: 1, baishaga: 1, vesak: 1,
  // Jestha (month 2)
  jestha: 2, jeth: 2, jeshtha: 2, jyeshtha: 2, jyestha: 2,
  jesth: 2, jeshth: 2, jetha: 2, jeshta: 2, jayshtha: 2,
  jayestha: 2, jesta: 2, jyesth: 2, jyaistha: 2, jaistha: 2,
  // Ashad (month 3)
  asar: 3, asadh: 3, ashar: 3, ashad: 3, asad: 3,
  aasad: 3, asada: 3, ashadh: 3, asadha: 3, ashadha: 3,
  ashara: 3, asara: 3, ashada: 3, asaad: 3, aashar: 3,
  // Shrawan (month 4)
  shrawan: 4, sawan: 4, saun: 4, srawan: 4, shraawan: 4,
  shravan: 4, shravana: 4, sawun: 4, savan: 4, shrawana: 4,
  sravana: 4, sawon: 4, sravan: 4, saawan: 4, sharwan: 4,
  sarwan: 4, sraawan: 4, shaun: 4, shawan: 4,
  // Bhadra (month 5)
  bhadra: 5, bhadau: 5, bhado: 5, bhaadra: 5,
  bhadow: 5, bhadava: 5, bhadaw: 5, bhada: 5,
  bhadoo: 5, bhadon: 5, bhadrapad: 5, bhadrapada: 5, bhaado: 5,
  // Ashwin (month 6)
  ashwin: 6, asoj: 6, ashoj: 6, aswin: 6, ashvin: 6,
  aaswin: 6, ashwini: 6, aswini: 6, ashvini: 6, aasoj: 6,
  aashoj: 6, asoja: 6, asojh: 6, ashoja: 6,
  asvin: 6, aashwin: 6, ashvina: 6, ashwina: 6, asvaayuja: 6,
  // Kartik (month 7)
  kartik: 7, kattik: 7, kaartik: 7, kartika: 7, katik: 7,
  kartike: 7, karttik: 7, kartiki: 7, karthik: 7, karthika: 7,
  kathik: 7, kaatik: 7, katak: 7, karttic: 7, kartic: 7,
  // Mangsir (month 8)
  mangsir: 8, mangshir: 8, manshir: 8, marg: 8, margashirsha: 8,
  mangasir: 8, mangsheer: 8, mangseer: 8, margshirsha: 8,
  mansheer: 8, margsir: 8, managsir: 8, mangaseer: 8, mangsheersh: 8,
  mangsira: 8, mansir: 8, magshir: 8, mangir: 8, magsir: 8,
  // Poush (month 9)
  poush: 9, push: 9, pus: 9, paush: 9,
  pausha: 9, pousha: 9, pos: 9, pausa: 9, pousa: 9,
  posh: 9, posma: 9, paus: 9, poos: 9,
  // Magh (month 10)
  magh: 10, mag: 10, maagh: 10, magha: 10, maagha: 10,
  maga: 10, magah: 10, maag: 10, maaha: 10, maghu: 10,
  maghaa: 10, magg: 10, mahi: 10, mahag: 10,
  // Falgun (month 11)
  falgun: 11, phagun: 11, phalgun: 11, fagan: 11, fagun: 11,
  phalguna: 11, falguna: 11, phalgoon: 11, falgunn: 11, phalguni: 11,
  phalagan: 11, phalagun: 11, phalag: 11,
  fagoon: 11, phaguna: 11, falgoona: 11, phagoon: 11,
  // Chaitra (month 12)
  chaitra: 12, chait: 12, chaita: 12, chet: 12, chetra: 12,
  chaitr: 12, chaity: 12, cheta: 12, chaitya: 12,
  chaitri: 12, chaito: 12, chythro: 12, chaithra: 12,

  // Nepali unicode month names
  'बैशाख': 1, 'वैशाख': 1, 'बैसाख': 1, 'बैशाक': 1, 'वैसाख': 1, 'वैशाक': 1,
  'जेष्ठ': 2, 'जेठ': 2, 'जेस्थ': 2, 'ज्येष्ठ': 2, 'जेस्ठ': 2, 'जेष्ट': 2,
  'आषाढ': 3, 'असार': 3, 'अषाढ': 3, 'आशाढ': 3, 'आषाढ़': 3, 'असाढ': 3, 'अषाड': 3,
  'श्रावण': 4, 'सावन': 4, 'साउन': 4, 'श्रावन': 4, 'सावण': 4, 'श्रवण': 4,
  'भाद्र': 5, 'भदौ': 5, 'भादौ': 5, 'भाद्रपद': 5, 'भदो': 5, 'भादोै': 5, 'भाद्रा': 5,
  'आश्विन': 6, 'असोज': 6, 'अश्विन': 6, 'आसोज': 6, 'अस्विन': 6, 'अश्वीन': 6, 'अश्वीना': 6,
  'कार्तिक': 7, 'कात्तिक': 7, 'कार्तीक': 7, 'कार्तिका': 7, 'कातिक': 7, 'कर्तिक': 7, 'कार्तिक्': 7,
  'मंसिर': 8, 'मङ्सिर': 8, 'मार्ग': 8, 'मंग्सिर': 8, 'मंशिर': 8, 'मागशिर': 8, 'मार्गशीर्ष': 8,
  'पौष': 9, 'पुष': 9, 'पुस': 9, 'पौश': 9, 'पौष्य': 9, 'पौस': 9,
  'माघ': 10, 'माग': 10, 'माह': 10, 'माघा': 10, 'माग्ह': 10, 'मा्घ': 10,
  'फाल्गुन': 11, 'फागुन': 11, 'फाल्गुण': 11, 'फल्गुन': 11, 'फाल्गुना': 11,
  'चैत्र': 12, 'चैत': 12, 'चैता': 12, 'चॆत्र': 12, 'चेत्र': 12, 'चैत्रा': 12,
};

// ---- Helpers ----

const DATE_SEPARATORS = /[-/., _|\\।]/;
const NEPALI_DIGIT_RE = /[०-९]/;

function toEnglishDigits(s: string): string {
  return s.replace(/[०-९]/g, c => String.fromCharCode(48 + (c.charCodeAt(0) - 0x0966)));
}

function extractNumbers(s: string): number[] {
  const nums: number[] = [];
  let current = 0;
  let inNum = false;
  for (const c of s) {
    if (c >= '0' && c <= '9') {
      current = current * 10 + (c.charCodeAt(0) - 48);
      inNum = true;
    } else {
      if (inNum) { nums.push(current); current = 0; inNum = false; }
    }
  }
  if (inNum) nums.push(current);
  return nums;
}

// ---- Parser ----

/**
 * Smart parse a Nepali date string in any supported format.
 * Accepts:
 *   - "15 Shrawan 2080", "Shrawan 15, 2080"
 *   - "२०८०/०८/१५" (Nepali digits)
 *   - "15 Saun 2080" (alternate spellings)
 *   - "2080/04/15" (numeric)
 * @throws Error if parsing fails
 */
export function smartParse(input: string): NepaliDate {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Input string is empty');

  // Try standard numeric parse
  const standard = tryParseNumeric(trimmed);
  if (standard) return standard;

  // Normalize
  let normalized = removeIndicators(trimmed);
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Try Nepali unicode
  if (NEPALI_DIGIT_RE.test(normalized)) {
    const converted = toEnglishDigits(normalized);
    const unicodeResult = tryParseFlexible(converted);
    if (unicodeResult) return unicodeResult;
  }

  // Try month name format
  const monthResult = tryParseMonthName(normalized);
  if (monthResult) return monthResult;

  // Try ambiguous (all permutations)
  const ambiguous = tryParseAmbiguous(normalized);
  if (ambiguous) return ambiguous;

  throw new Error(`Could not smart-parse "${input}" as a Nepali date`);
}

/**
 * Try to smart parse without throwing. Returns null on failure.
 */
export function trySmartParse(input: string): NepaliDate | null {
  try {
    return smartParse(input);
  } catch {
    return null;
  }
}

// ---- Internal parse strategies ----

function tryParseNumeric(s: string): NepaliDate | null {
  const parts = s.split(DATE_SEPARATORS).filter(p => p.length > 0);
  if (parts.length !== 3) return null;
  const nums = parts.map(p => {
    const n = Number(p);
    return Number.isInteger(n) ? n : NaN;
  });
  if (nums.some(n => isNaN(n))) return null;
  const [a, b, c] = nums;
  // Try YMD, DMY, MDY
  for (const [y, m, d] of [[a, b, c], [c, b, a], [c, a, b]]) {
    if (isValidNepaliDate(y, m, d)) return { year: y, month: m, day: d };
  }
  return null;
}

function tryParseFlexible(s: string): NepaliDate | null {
  return tryParseNumeric(s);
}

function tryParseMonthName(s: string): NepaliDate | null {
  // Find the longest matching month name
  let bestKey = '';
  let bestLen = 0;
  const lower = s.toLowerCase();
  for (const key of Object.keys(MONTH_NAMES)) {
    if (key.length > bestLen && lower.includes(key.toLowerCase())) {
      bestKey = key;
      bestLen = key.length;
    }
  }
  if (!bestKey) return null;

  const month = MONTH_NAMES[bestKey];
  // Remove month name from string
  const remaining = s.replace(new RegExp(bestKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), ' ').trim();
  const nums = extractNumbers(remaining);

  if (nums.length >= 2) {
    let year: number, day: number;
    if (nums[0] > 1900) { year = nums[0]; day = nums[1]; }
    else if (nums[1] > 1900) { year = nums[1]; day = nums[0]; }
    else {
      year = Math.max(nums[0], nums[1]);
      day = Math.min(nums[0], nums[1]);
    }
    if (year < 100) year += 2000;
    else if (year < 1000) year += 1000;
    if (day < 1 || day > 32) return null;
    if (isValidNepaliDate(year, month, day)) return { year, month, day };
  }
  return null;
}

function tryParseAmbiguous(s: string): NepaliDate | null {
  const nums = extractNumbers(s);
  if (nums.length < 3) return null;

  const permutations = [
    [0, 1, 2], [2, 1, 0], [2, 0, 1], [1, 0, 2], [0, 2, 1], [1, 2, 0],
  ];

  for (const perm of permutations) {
    let year = nums[perm[0]];
    const month = nums[perm[1]];
    const day = nums[perm[2]];
    if (year < 100) year += 2000;
    else if (year > 100 && year < 1000) year += 1000;
    if (month < 1 || month > 12 || day < 1 || day > 32) continue;
    if (isValidNepaliDate(year, month, day)) return { year, month, day };
  }
  return null;
}

function removeIndicators(s: string): string {
  // Remove BS, B.S., VS, V.S., गते, मिति
  return s
    .replace(/\b[Bb][.\s]*[Ss][.\s]*\b/g, ' ')
    .replace(/\b[Vv][.\s]*[Ss][.\s]*\b/g, ' ')
    .replace(/गते/g, ' ')
    .replace(/मिति/g, ' ')
    .trim();
}

// ---- String extension-style functions ----

/**
 * Smart parse via string extension: "15 Shrawan 2080".toNepaliDate()
 */
export function stringToNepaliDate(s: string): NepaliDate {
  return smartParse(s);
}

/**
 * Try parse via string extension.
 */
export function tryStringToNepaliDate(s: string): NepaliDate | null {
  return trySmartParse(s);
}
