import type { Report, Expense } from "../types";
import { isIsoDate, legacyDateToIso, normalizeCurrencyCode } from "../localization/localeUtils";

const STORAGE_KEY = "bs-expense-reports";

function createSeedReports(): Report[] {
  const cats = [
    { label: "Travel", paymentMethod: "Cash" },
    { label: "Hotel", paymentMethod: "Cash" },
    { label: "Hardware", paymentMethod: "Cash" },
    { label: "Gift", paymentMethod: "Cash" },
  ];

  let eid = 1000;
  let rid = 5000;
  const receipt = (filename: string) => ({
    id: String(rid++),
    filename,
    mimeType: filename.endsWith(".pdf") ? "application/pdf" : "image/png",
    size: 0,
    dataUrl: "",
  });

  const expense = (date: string, catIdx: number, amount: number, merchant: string, desc: string, rcpt: { id: string; filename: string; mimeType: string; size: number; dataUrl: string }): Expense => ({
    id: String(eid++),
    category: cats[catIdx % cats.length].label,
    date,
    amount,
    currency: "GBP",
    paymentMethod: cats[catIdx % cats.length].paymentMethod,
    merchant,
    description: desc,
    receipt: rcpt,
  });

  return [
    {
      id: "seed-1",
      reportNumber: "B2030444129",
      purpose: "February 2026 expenses",
      status: "Draft",
      expenses: [],
    },
    {
      id: "seed-2",
      reportNumber: "B2030444128",
      purpose: "January 2026 expenses",
      status: "Processed",
      expenses: [
        expense("2026-01-05", 0, 34.50, "Uber", "Taxi to client office", receipt("uber-receipt-jan.pdf")),
        expense("2026-01-12", 1, 189.00, "Premier Inn", "Overnight stay – London", receipt("premier-inn-invoice.png")),
      ],
    },
    {
      id: "seed-3",
      reportNumber: "B2030444127",
      purpose: "December 2025 expenses",
      status: "Processed",
      expenses: [
        expense("2025-12-03", 0, 22.00, "Bolt", "Taxi to airport", receipt("bolt-ride-dec.png")),
        expense("2025-12-10", 2, 74.99, "Amazon", "USB-C hub for dev laptop", receipt("amazon-order-dec.pdf")),
        expense("2025-12-18", 1, 210.00, "Hilton", "Hotel – Manchester meeting", receipt("hilton-folio.pdf")),
      ],
    },
    {
      id: "seed-4",
      reportNumber: "B2030444126",
      purpose: "November 2025 expenses",
      status: "Processed",
      expenses: [
        expense("2025-11-02", 3, 45.00, "John Lewis", "Client gift basket", receipt("johnlewis-receipt.png")),
        expense("2025-11-08", 0, 28.50, "Addison Lee", "Taxi to Reading office", receipt("addisonlee-nov.pdf")),
        expense("2025-11-15", 1, 175.00, "Travelodge", "Overnight stay – Birmingham", receipt("travelodge-confirmation.pdf")),
        expense("2025-11-22", 2, 59.99, "Currys", "Wireless mouse & keyboard", receipt("currys-receipt.png")),
      ],
    },
    {
      id: "seed-5",
      reportNumber: "B2030444125",
      purpose: "October 2025 expenses",
      status: "Processed",
      expenses: [
        expense("2025-10-06", 0, 41.00, "Uber", "Taxi to Heathrow", receipt("uber-heathrow-oct.pdf")),
        expense("2025-10-19", 1, 199.00, "Holiday Inn", "Hotel – Edinburgh trip", receipt("holidayinn-edinburgh.png")),
      ],
    },
  ];
}

function normalizeExpense(expense: Expense): { expense: Expense; changed: boolean } {
  let changed = false;

  let date = expense.date;
  if (!isIsoDate(date)) {
    const migratedDate = legacyDateToIso(date);
    if (migratedDate) {
      date = migratedDate;
      changed = true;
    }
  }

  const rawCurrency = typeof expense.currency === "string" ? expense.currency : "GBP";
  let currency = normalizeCurrencyCode(rawCurrency);
  if (currency === "£") currency = "GBP";
  if (currency === "$") currency = "USD";
  if (currency === "€") currency = "EUR";
  if (currency !== rawCurrency) changed = true;

  return {
    expense: {
      ...expense,
      date,
      currency,
    },
    changed,
  };
}

function normalizeReports(reports: Report[]): { reports: Report[]; changed: boolean } {
  let changed = false;

  const normalized = reports.map((report) => {
    let reportChanged = false;
    const normalizedExpenses = report.expenses.map((expense) => {
      const normalizedExpense = normalizeExpense(expense);
      if (normalizedExpense.changed) {
        changed = true;
        reportChanged = true;
      }
      return normalizedExpense.expense;
    });

    return reportChanged
      ? {
          ...report,
          expenses: normalizedExpenses,
        }
      : report;
  });

  return { reports: normalized, changed };
}

export function loadReports(): Report[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Report[];
      const normalized = normalizeReports(parsed);
      if (normalized.changed) saveReports(normalized.reports);
      return normalized.reports;
    }
    const seed = createSeedReports();
    saveReports(seed);
    return seed;
  } catch {
    return [];
  }
}

export function saveReports(reports: Report[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function resetSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  // Reload seed data immediately so the UI shows prepopulated reports
  loadReports();
}

export function generateReportNumber(): string {
  const existing = loadReports();
  // Find the highest existing report number and increment
  let maxNum = 0;
  for (const r of existing) {
    const match = r.reportNumber.match(/^B(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `B${maxNum + 1}`;
}

let idCounter = Date.now();
export function generateId(): string {
  return String(idCounter++);
}
