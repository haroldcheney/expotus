/**
 * Date utility functions, ported from DateService.groovy and PartialDateService.groovy
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface Duration {
  years: number;
  months: number;
  days: number;
}

/** Parse a "YYYY-MM-DD" string into a Date (in UTC to avoid timezone issues). */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Number of days between two dates. If date2 is null, uses today. */
export function durationInDays(date1: string, date2: string | null | undefined): number {
  const d1 = parseDate(date1);
  const d2 = date2 ? parseDate(date2) : new Date();
  const msPerDay = 86400000;
  return Math.floor((d2.getTime() - d1.getTime()) / msPerDay);
}

/** Duration between two dates as years, months, days. If date2 is null, uses today. */
export function durationInYearsMonthsDays(date1: string, date2: string | null | undefined): Duration {
  const d1 = parseDate(date1);
  const d2 = date2 ? parseDate(date2) : new Date();

  let years = d2.getUTCFullYear() - d1.getUTCFullYear();
  let months = d2.getUTCMonth() - d1.getUTCMonth();
  let days = d2.getUTCDate() - d1.getUTCDate();

  if (days < 0) {
    months--;
    // Days in the previous month of d2
    const prevMonth = new Date(Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/** Format a Duration as "X years, Y months, Z days". */
export function formatDuration(d: Duration, delimiter = ', '): string {
  const parts: string[] = [];
  if (d.years) parts.push(`${d.years} year${d.years !== 1 ? 's' : ''}`);
  if (d.months) parts.push(`${d.months} month${d.months !== 1 ? 's' : ''}`);
  parts.push(`${d.days} day${d.days !== 1 ? 's' : ''}`);
  return parts.join(delimiter);
}

/**
 * Format a partial date string for display.
 * Supports: "1941" → "1941", "1941-12" → "December, 1941",
 * "1941-12-07" → "December 7, 1941", null → ""
 */
export function formatPartialDate(date: string | null | undefined): string {
  if (!date) return '';
  try {
    const parts = date.split('-');
    if (parts.length === 1) return parts[0];
    const month = MONTHS[parseInt(parts[1], 10) - 1];
    if (parts.length === 2) return `${month}, ${parts[0]}`;
    const day = parseInt(parts[2], 10);
    return `${month} ${day}, ${parts[0]}`;
  } catch {
    return '';
  }
}

/** Format a full date (YYYY-MM-DD) as "Month D, YYYY". */
export function formatDate(date: string | null | undefined, defaultValue = ''): string {
  if (!date) return defaultValue;
  return formatPartialDate(date);
}

/** Format a number with comma separators. */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
