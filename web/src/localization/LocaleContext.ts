import { createContext } from "react";
import {
  DEFAULT_LOCALE,
  formatCurrencyForLocale,
  formatDateForLocale,
  type LocaleConfig,
} from "./localeUtils";

export interface LocaleContextValue {
  locale: LocaleConfig;
  formatCurrency: (amount: number) => string;
  formatDate: (value: string) => string;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  formatCurrency: (amount) => formatCurrencyForLocale(amount, DEFAULT_LOCALE),
  formatDate: (value) => formatDateForLocale(value, DEFAULT_LOCALE.dateFormat),
});