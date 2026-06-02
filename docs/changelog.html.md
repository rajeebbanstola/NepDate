# NepDate Changelog

https://nepdate.rajuprasai.com.np/changelog.html

---

## v2.0.7 - May 2026 (Latest)

Corrected English transliterations of Tithi names and calendar events. Improved accuracy and consistency of Nepali calendar metadata for 2001-2089 BS.

---

## v2.0.6 - November 2025

Resolved a NuGet publish conflict from v2.0.5 and stabilized the CI release workflow. No API changes.

---

## v2.0.5 - October 2025

Major feature release:
- Calendar metadata: Tithi (lunar day), Nepal government gazetted public holidays, and festival events for 2001-2089 BS
- `NepaliDateRange` struct with `Contains`, `Overlaps`, `IsContiguousWith`, `Union`, `Intersect`, `Except`
- Fiscal year helpers: `FiscalYearStartDate`, `FiscalYearEndDate`, `FiscalYearQuarter`
- Smart parsing: 100+ month-name spellings, Nepali Unicode digits, flexible separators
- `BulkConvert` static class with auto-parallelized `ToNepaliDates` and `ToEnglishDates`
- `CalendarInfo.GetForMonth` for efficient batch calendar data retrieval
- `System.Text.Json` serialization via `[JsonConverter]` attribute (automatic)
- Newtonsoft.Json serialization via `NepDateNewtonsoftConverter`
- XML serialization via `IXmlSerializable`
- `IParsable<NepaliDate>` and `ISpanFormattable` on net8.0 target
- Significant performance overhaul: BS-to-AD at 4.55 ns/op, zero allocations

---

## v2.0.0 - 2024

Breaking release:
- Restructured `NepaliDate` into a `readonly partial struct`
- Removed mutable state
- Changed namespace from `NepDate.Core` to `NepDate`
- Dropped legacy `DateConverter` class (replaced by constructor and `NepaliDate.Now`)
- All arithmetic now returns new instances (immutable)

---

## v1.x - 2023

Initial public releases. Core BS/AD conversion, basic formatting, NuGet publish infrastructure.

---

## Links

- [Homepage](https://nepdate.rajuprasai.com.np/)
- [API Reference](https://nepdate.rajuprasai.com.np/docs.html)
- [NuGet](https://www.nuget.org/packages/NepDate/)
- [GitHub Releases](https://github.com/RajuPrasai/NepDate/releases)
