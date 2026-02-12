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
  { label: "Gift", paymentMethod: "Cash" },
  { label: "Hardware", paymentMethod: "Cash" },
  { label: "Hotel", paymentMethod: "Cash" },
  { label: "Marketing", paymentMethod: "Cash" },
  { label: "Meals", paymentMethod: "Cash" },
  { label: "Morale", paymentMethod: "Cash" },
  { label: "Office Supplies", paymentMethod: "Cash" },
  { label: "Software", paymentMethod: "Cash" },
  { label: "Training", paymentMethod: "Cash" },
  { label: "Travel", paymentMethod: "Cash" },
];
