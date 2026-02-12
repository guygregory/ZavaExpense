export interface ReceiptRef {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
}

export interface Expense {
  id: string;
  category: string;
  date: string; // DD/MM/YYYY
  amount: number;
  currency: "GBP";
  paymentMethod: string;
  merchant: string;
  description: string;
  receipt?: ReceiptRef;
}

export const REPORT_STATUSES = ["Draft", "In review", "Processed", "Approved"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface Report {
  id: string;
  reportNumber: string;
  purpose: string;
  status: ReportStatus;
  expenses: Expense[];
}

export const EXPENSE_CATEGORIES: { label: string; paymentMethod: string }[] = [
  { label: "Gift | external", paymentMethod: "Cash" },
  { label: "Government Official", paymentMethod: "Cash" },
  { label: "Ground Transportation", paymentMethod: "Cash" },
  { label: "Hardware (Supplies General)", paymentMethod: "Cash" },
  { label: "Hardware Dev (Prod Dev-Other)", paymentMethod: "Cash" },
  { label: "Hotel", paymentMethod: "Cash" },
];
