import { differenceInDays, parseISO, startOfDay } from "date-fns";
/**
 * Return a human-readable relative date label.
 *
 * @param date - An ISO-8601 date string.
 * @returns "Today", "Yesterday", "X days ago", etc.
 *
 * @example
 * getRelativeDate("2026-07-15T12:00:00Z") // "Today"  (if today is Jul 15)
 * getRelativeDate("2026-07-14T12:00:00Z") // "Yesterday"
 * getRelativeDate("2026-07-10T12:00:00Z") // "5 days ago"
 */
export function getRelativeDate(date: string): string {
  const target = startOfDay(parseISO(date));
  const today = startOfDay(new Date());
  const days = differenceInDays(today, target);

  if (days < 0) {
    const absDays = Math.abs(days);
    if (absDays === 1) return "Tomorrow";
    return `In ${absDays} days`;
  }

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  if (days < 730) return "1 year ago";
  return `${Math.floor(days / 365)} years ago`;
}
