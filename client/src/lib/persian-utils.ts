// Persian number and text utilities

// Persian number conversion
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Convert English numbers to Persian numbers
 */
export function toPersianNumber(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (match) => {
    const index = englishDigits.indexOf(match);
    return persianDigits[index];
  });
}

/**
 * Convert Persian numbers to English numbers
 */
export function toEnglishNumber(input: string): string {
  return input.replace(/[۰-۹]/g, (match) => {
    const index = persianDigits.indexOf(match);
    return englishDigits[index];
  });
}

/**
 * Format Persian date
 */
export function formatPersianDate(date: string | Date): string {
  const d = new Date(date);
  const persianDate = d.toLocaleDateString('fa-IR');
  return toPersianNumber(persianDate);
}

/**
 * Format Persian time
 */
export function formatPersianTime(time: string): string {
  return toPersianNumber(time);
}

/**
 * Format Persian percentage
 */
export function formatPersianPercentage(value: number): string {
  return `${toPersianNumber(value.toString())}%`;
}

/**
 * Format Persian duration in minutes
 */
export function formatPersianDuration(minutes: number): string {
  return `${toPersianNumber(minutes.toString())} دقیقه`;
}

/**
 * Format Persian count with label
 */
export function formatPersianCount(count: number, label: string): string {
  return `${toPersianNumber(count.toString())} ${label}`;
}