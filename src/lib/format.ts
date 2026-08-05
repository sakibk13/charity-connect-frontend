/** Date-only values from the API ("2026-08-15") parse as UTC midnight.
 * Displaying that in the viewer's local timezone shifts the calendar date
 * by a day for anyone west of UTC — and disagrees between the server
 * (likely UTC) and a browser in the Americas, causing a hydration
 * mismatch. Always format with timeZone: "UTC" so the displayed date is
 * exactly the calendar date that was stored, on both server and client.
 *
 * Also always pass an explicit locale — "undefined"/"default" defers to
 * the runtime's locale, which can differ between server and browser too. */
const LOCALE = "en-US";

export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(LOCALE, { ...options, timeZone: "UTC" });
}

export function splitDateBadge(date: string | Date): { day: number; month: string } {
  const d = typeof date === "string" ? new Date(date) : date;
  return {
    day: d.getUTCDate(),
    month: d.toLocaleDateString(LOCALE, { month: "short", timeZone: "UTC" }),
  };
}
