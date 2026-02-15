export type DateFormat = "dd/mm/yyyy" | "mm/dd/yyyy";

export interface LocaleConfig {
  id: string;
  currencyCode: string;
  currencySymbol: string;
  dateFormat: DateFormat;
}

export const LOCALE_PARAM = "locale";
export const SESSION_LOCALE_KEY = "bs-locale";
export const DEFAULT_LOCALE_ID = "us";

export const DEFAULT_LOCALE: LocaleConfig = {
  id: "us",
  currencyCode: "USD",
  currencySymbol: "$",
  dateFormat: "mm/dd/yyyy",
};

export function normalizeLocaleId(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function normalizeCurrencyCode(value: string): string {
  return value.trim().toUpperCase();
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

export function legacyDateToIso(value: string): string | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const [day, month, year] = value.split("/");
  const iso = `${year}-${month}-${day}`;
  return isIsoDate(iso) ? iso : null;
}

function toIsoDate(value: string): string {
  if (isIsoDate(value)) return value;
  return legacyDateToIso(value) ?? value;
}

export function formatDateForLocale(value: string, format: DateFormat): string {
  const iso = toIsoDate(value);
  if (!isIsoDate(iso)) return value;
  const [year, month, day] = iso.split("-");
  return format === "dd/mm/yyyy" ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
}

export function formatCurrencyForLocale(amount: number, locale: LocaleConfig): string {
  return `${locale.currencySymbol}${amount.toFixed(2)}`;
}