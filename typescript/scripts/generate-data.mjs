#!/usr/bin/env node
/**
 * Converts NepDate .NET C# data files to TypeScript.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const SRC_DIR = '/Users/rara/Desktop/hq/NepDate/src/NepDate/Core/Dictionaries';
const OUT_DIR = '/Users/rara/Desktop/hq/nep-date-ts/src/data';

function extractCsharpArray(text, prefix) {
  const idx = text.indexOf(prefix);
  if (idx === -1) throw new Error(`Prefix not found: ${prefix.substring(0, 60)}`);
  const startBrace = text.indexOf('{', idx + prefix.length);
  if (startBrace === -1) throw new Error('No opening brace found');
  // Count braces to find matching closing brace
  let depth = 0;
  let pos = startBrace;
  while (pos < text.length) {
    if (text[pos] === '{') depth++;
    else if (text[pos] === '}') {
      depth--;
      if (depth === 0) break;
    }
    pos++;
  }
  if (depth !== 0) throw new Error('Unmatched braces');
  return text.substring(startBrace + 1, pos);
}

function cleanArray(text) {
  return text
    .split('\n')
    .map(l => l.replace(/\/\/.*$/, '').trim())
    .filter(l => l.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/,\s*]/g, ']')
    .trim();
}

function convertNepaliToEnglish() {
  const content = readFileSync(resolve(SRC_DIR, 'NepaliToEnglish.cs'), 'utf-8');
  const raw = extractCsharpArray(content, '= new (int, int, int, int)[]');
  let body = cleanArray(raw);
  body = body.replace(/\(\s*/g, '[').replace(/\s*\)/g, ']');
  return `// AUTO-GENERATED from NepaliToEnglish.cs\n// [nepMonthEndDay, engYear, engMonth, engDay]\nexport const NEPALI_TO_ENGLISH: [number, number, number, number][] = [${body}];\n`;
}

function convertEnglishToNepali() {
  const content = readFileSync(resolve(SRC_DIR, 'EnglishToNepali.cs'), 'utf-8');
  const raw = extractCsharpArray(content, '= new (int, int, int, int)[]');
  let body = cleanArray(raw);
  body = body.replace(/\(\s*/g, '[').replace(/\s*\)/g, ']');
  return `// AUTO-GENERATED from EnglishToNepali.cs\n// [engMonthEndDay, nepYear, nepMonth, nepDay]\nexport const ENGLISH_TO_NEPALI: [number, number, number, number][] = [${body}];\n`;
}

function convertCalendarOffsets() {
  const content = readFileSync(resolve(SRC_DIR, 'CalendarOffsets.cs'), 'utf-8');
  const raw = extractCsharpArray(content, '= new ushort[]');
  const body = cleanArray(raw);
  const baseYear = content.match(/BaseYear\s*=\s*(\d+)/)?.[1] ?? '2001';
  const yearCount = content.match(/YearCount\s*=\s*(\d+)/)?.[1] ?? '89';
  const totalDays = content.match(/TotalDays\s*=\s*(\d+)/)?.[1] ?? '32509';
  return `// AUTO-GENERATED from CalendarOffsets.cs\nexport const CALENDAR_OFFSETS_BASE_YEAR = ${baseYear};\nexport const CALENDAR_OFFSETS_YEAR_COUNT = ${yearCount};\nexport const CALENDAR_OFFSETS_TOTAL_DAYS = ${totalDays};\nexport const CALENDAR_MONTH_START: number[] = [${body}];\n`;
}

function convertCalendarStrings() {
  const content = readFileSync(resolve(SRC_DIR, 'CalendarStrings.cs'), 'utf-8');
  const raw = extractCsharpArray(content, '= new (string, string)[]');
  let body = cleanArray(raw);
  // Convert C# tuple format (\"...\", \"...\") to JS array ["...", "..."]
  body = body.replace(/\(\s*"/g, '["').replace(/",\s*"/g, '","').replace(/"\s*\)/g, '"]');
  return `// AUTO-GENERATED from CalendarStrings.cs\nexport const CALENDAR_STRINGS_POOL: [string, string][] = [${body}];\n`;
}

function convertTithiData() {
  const content = readFileSync(resolve(SRC_DIR, 'TithiData.cs'), 'utf-8');
  const dayOff = cleanArray(extractCsharpArray(content, 'DayOffsets = new ushort[]'));
  const pool = cleanArray(extractCsharpArray(content, 'PoolIds = new byte[]'));
  return `// AUTO-GENERATED from TithiData.cs\nexport const TITHI_DAY_OFFSETS: number[] = [${dayOff}];\nexport const TITHI_POOL_IDS: number[] = [${pool}];\n`;
}

function convertHolidayData() {
  const content = readFileSync(resolve(SRC_DIR, 'HolidayData.cs'), 'utf-8');
  const raw = cleanArray(extractCsharpArray(content, 'DayOffsets = new ushort[]'));
  return `// AUTO-GENERATED from HolidayData.cs\nexport const HOLIDAY_DAY_OFFSETS: number[] = [${raw}];\n`;
}

function convertEventData() {
  const content = readFileSync(resolve(SRC_DIR, 'EventData.cs'), 'utf-8');
  const d = cleanArray(extractCsharpArray(content, 'DayOffsets = new ushort[]'));
  const s = cleanArray(extractCsharpArray(content, 'SliceStart = new ushort[]'));
  const e = cleanArray(extractCsharpArray(content, 'Entries = new ushort[]'));
  return `// AUTO-GENERATED from EventData.cs\nexport const EVENT_DAY_OFFSETS: number[] = [${d}];\nexport const EVENT_SLICE_START: number[] = [${s}];\nexport const EVENT_ENTRIES: number[] = [${e}];\n`;
}

function convertUnicode() {
  const content = readFileSync(resolve(SRC_DIR, 'Unicodes.cs'), 'utf-8');
  const lines = content.split('\n');
  const entries = [];
  for (const line of lines) {
    const m = line.match(/\{nameof\((\w+)\)\s*,\s*"([^"]+)"\s*\}/);
    if (m) entries.push(`"${m[1]}":"${m[2]}"`);
  }
  return `// AUTO-GENERATED from Unicodes.cs\nexport const UNICODE_MAP: Record<string, string> = {${entries.join(',')}};\n`;
}

const files = {
  'nepaliToEnglish.ts': convertNepaliToEnglish(),
  'englishToNepali.ts': convertEnglishToNepali(),
  'calendarOffsets.ts': convertCalendarOffsets(),
  'calendarStrings.ts': convertCalendarStrings(),
  'tithiData.ts': convertTithiData(),
  'holidayData.ts': convertHolidayData(),
  'eventData.ts': convertEventData(),
  'unicode.ts': convertUnicode(),
};

for (const [name, content] of Object.entries(files)) {
  const outPath = resolve(OUT_DIR, name);
  writeFileSync(outPath, content, 'utf-8');
  console.log(`Wrote ${outPath} (${(content.length / 1024).toFixed(1)} KB)`);
}
