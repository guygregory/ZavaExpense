import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import YAML from "yaml";
import { LocaleContext, type LocaleContextValue } from "./LocaleContext";
import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_ID,
  LOCALE_PARAM,
  SESSION_LOCALE_KEY,
  formatCurrencyForLocale,
  formatDateForLocale,
  normalizeCurrencyCode,
  normalizeLocaleId,
  type DateFormat,
  type LocaleConfig,
} from "./localeUtils";

interface LocaleProviderProps {
  children: ReactNode;
}

interface RawLocaleConfig {
  id?: string;
  currencyCode?: string;
  currencySymbol?: string;
  dateFormat?: string;
}

function parseDateFormat(value: string | undefined): DateFormat | null {
  if (!value) return null;
  return value === "dd/mm/yyyy" || value === "mm/dd/yyyy" ? value : null;
}

function parseLocaleConfig(raw: RawLocaleConfig, fallbackLocaleId: string): LocaleConfig | null {
  const id = normalizeLocaleId(raw.id ?? fallbackLocaleId);
  const currencyCode = raw.currencyCode ? normalizeCurrencyCode(raw.currencyCode) : "";
  const currencySymbol = (raw.currencySymbol ?? "").trim();
  const dateFormat = parseDateFormat(raw.dateFormat);

  if (!id || !currencyCode || !currencySymbol || !dateFormat) {
    return null;
  }

  return {
    id,
    currencyCode,
    currencySymbol,
    dateFormat,
  };
}

async function loadLocaleById(localeId: string): Promise<LocaleConfig | null> {
  try {
    const response = await fetch(`/locales/${localeId}.yaml`, { cache: "no-store" });
    if (!response.ok) return null;
    const yamlText = await response.text();
    const parsed = YAML.parse(yamlText) as RawLocaleConfig;
    return parseLocaleConfig(parsed ?? {}, localeId);
  } catch {
    return null;
  }
}

async function resolveLocaleConfig(): Promise<LocaleConfig> {
  const query = new URLSearchParams(window.location.search);
  const queryLocale = normalizeLocaleId(query.get(LOCALE_PARAM));
  const sessionLocale = normalizeLocaleId(sessionStorage.getItem(SESSION_LOCALE_KEY));

  const candidates = [queryLocale, sessionLocale, DEFAULT_LOCALE_ID].filter(Boolean);
  const uniqueCandidates = [...new Set(candidates)];

  for (const localeId of uniqueCandidates) {
    const locale = await loadLocaleById(localeId);
    if (locale) {
      sessionStorage.setItem(SESSION_LOCALE_KEY, locale.id);
      return locale;
    }
  }

  sessionStorage.setItem(SESSION_LOCALE_KEY, DEFAULT_LOCALE.id);
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocale] = useState<LocaleConfig>(DEFAULT_LOCALE);

  useEffect(() => {
    let active = true;
    resolveLocaleConfig().then((resolved) => {
      if (active) setLocale(resolved);
    });

    return () => {
      active = false;
    };
  }, []);

  const changeLocale = useCallback((localeId: string) => {
    const normalized = normalizeLocaleId(localeId);
    if (!normalized) return;
    loadLocaleById(normalized).then((loaded) => {
      if (loaded) {
        sessionStorage.setItem(SESSION_LOCALE_KEY, loaded.id);
        setLocale(loaded);
      }
    });
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      formatCurrency: (amount) => formatCurrencyForLocale(amount, locale),
      formatDate: (dateValue) => formatDateForLocale(dateValue, locale.dateFormat),
      setLocale: changeLocale,
    }),
    [locale, changeLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
