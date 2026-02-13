import type { Report, Expense } from "../types";

const STORAGE_KEY = "bs-expense-reports";

function createSeedReports(): Report[] {
  const now = new Date();
  const monthName = (d: Date) =>
    d.toLocaleString("en-GB", { month: "long", year: "numeric" });
  const fmtDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const monthsAgo = (n: number) =>
    new Date(now.getFullYear(), now.getMonth() - n, 1);

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

  const expense = (month: Date, day: number, catIdx: number, amount: number, merchant: string, desc: string, rcpt: { id: string; filename: string; mimeType: string; size: number; dataUrl: string }): Expense => ({
    id: String(eid++),
    category: cats[catIdx % cats.length].label,
    date: fmtDate(new Date(month.getFullYear(), month.getMonth(), day)),
    amount,
    currency: "GBP",
    paymentMethod: cats[catIdx % cats.length].paymentMethod,
    merchant,
    description: desc,
    receipt: rcpt,
  });

  const m1 = monthsAgo(1);
  const m2 = monthsAgo(2);
  const m3 = monthsAgo(3);
  const m4 = monthsAgo(4);

  return [
    {
      id: "seed-1",
      reportNumber: "B2030444129",
      purpose: `${monthName(now)} expenses`,
      status: "Draft",
      expenses: [],
    },
    {
      id: "seed-2",
      reportNumber: "B2030444128",
      purpose: `${monthName(m1)} expenses`,
      status: "Processed",
      expenses: [
        expense(m1, 5, 0, 34.50, "Uber", "Taxi to client office", receipt("uber-receipt-jan.pdf")),
        expense(m1, 12, 1, 189.00, "Premier Inn", "Overnight stay – London", receipt("premier-inn-invoice.png")),
      ],
    },
    {
      id: "seed-3",
      reportNumber: "B2030444127",
      purpose: `${monthName(m2)} expenses`,
      status: "Processed",
      expenses: [
        expense(m2, 3, 0, 22.00, "Bolt", "Taxi to airport", receipt("bolt-ride-dec.png")),
        expense(m2, 10, 2, 74.99, "Amazon", "USB-C hub for dev laptop", receipt("amazon-order-dec.pdf")),
        expense(m2, 18, 1, 210.00, "Hilton", "Hotel – Manchester meeting", receipt("hilton-folio.pdf")),
      ],
    },
    {
      id: "seed-4",
      reportNumber: "B2030444126",
      purpose: `${monthName(m3)} expenses`,
      status: "Processed",
      expenses: [
        expense(m3, 2, 3, 45.00, "John Lewis", "Client gift basket", receipt("johnlewis-receipt.png")),
        expense(m3, 8, 0, 28.50, "Addison Lee", "Taxi to Reading office", receipt("addisonlee-nov.pdf")),
        expense(m3, 15, 1, 175.00, "Travelodge", "Overnight stay – Birmingham", receipt("travelodge-confirmation.pdf")),
        expense(m3, 22, 2, 59.99, "Currys", "Wireless mouse & keyboard", receipt("currys-receipt.png")),
      ],
    },
    {
      id: "seed-5",
      reportNumber: "B2030444125",
      purpose: `${monthName(m4)} expenses`,
      status: "Processed",
      expenses: [
        expense(m4, 6, 0, 41.00, "Uber", "Taxi to Heathrow", receipt("uber-heathrow-oct.pdf")),
        expense(m4, 19, 1, 199.00, "Holiday Inn", "Hotel – Edinburgh trip", receipt("holidayinn-edinburgh.png")),
      ],
    },
  ];
}

export function loadReports(): Report[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
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

const BASE_REPORT_NUMBER = 2030444124;

export function generateReportNumber(): string {
  const existing = loadReports();
  return `B${BASE_REPORT_NUMBER - existing.length}`;
}

let idCounter = Date.now();
export function generateId(): string {
  return String(idCounter++);
}
