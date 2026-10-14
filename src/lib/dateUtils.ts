/**
 * Date and Time Utility Functions for Events
 */

/**
 * Converts any time string ('1:00 PM', '13:00', '01:00 PM', etc.) to 24-hour 'HH:mm'
 * format required by HTML <input type="time">.
 */
export function to24HourTime(timeStr?: string | null): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  
  // Check if 12-hour format e.g. "1:00 PM", "01:00 PM", "1 PM"
  const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = match12[2] || '00';
    const period = match12[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
  }

  // Check if already 24-hour format e.g. "13:00" or "13:00:00"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    return `${match24[1].padStart(2, '0')}:${match24[2]}`;
  }

  return '';
}

/**
 * Converts any time string ('13:00', '16:00', '1:00 PM') to user-friendly 12-hour format ('1:00 PM').
 */
export function to12HourTime(timeStr?: string | null): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  
  // Already in 12-hour format
  if (/AM|PM/i.test(trimmed)) {
    return trimmed;
  }

  // 24-hour format e.g. "13:00"
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${period}`;
  }

  return trimmed;
}

/**
 * Formats a Date object from a datepicker into 'YYYY-MM-DD' without timezone drift.
 */
export function formatDateToInput(date?: Date | null): string {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parses 'YYYY-MM-DD' or ISO string to a local Date object suitable for DatePicker.
 */
export function parseInitialDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Converts a date string ('YYYY-MM-DD' or ISO string) to UTC Noon Date (12:00:00 UTC)
 * to ensure that across all world timezones (from UTC-10 to UTC+12), the date
 * never shifts to the previous or next day.
 */
export function parseInputDateToUtcNoon(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00.000Z`);
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return new Date(`${y}-${m}-${d}T12:00:00.000Z`);
  }
  return null;
}
