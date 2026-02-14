import type { Report, Expense } from "../types";

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
        expense("05/01/2026", 0, 34.50, "Uber", "Taxi to client office", receipt("uber-receipt-jan.pdf")),
        expense("12/01/2026", 1, 189.00, "Premier Inn", "Overnight stay – London", receipt("premier-inn-invoice.png")),
      ],
    },
    {
      id: "seed-3",
      reportNumber: "B2030444127",
      purpose: "December 2025 expenses",
      status: "Processed",
      expenses: [
        expense("03/12/2025", 0, 22.00, "Bolt", "Taxi to airport", receipt("bolt-ride-dec.png")),
        expense("10/12/2025", 2, 74.99, "Amazon", "USB-C hub for dev laptop", receipt("amazon-order-dec.pdf")),
        expense("18/12/2025", 1, 210.00, "Hilton", "Hotel – Manchester meeting", receipt("hilton-folio.pdf")),
      ],
    },
    {
      id: "seed-4",
      reportNumber: "B2030444126",
      purpose: "November 2025 expenses",
      status: "Processed",
      expenses: [
        expense("02/11/2025", 3, 45.00, "John Lewis", "Client gift basket", receipt("johnlewis-receipt.png")),
        expense("08/11/2025", 0, 28.50, "Addison Lee", "Taxi to Reading office", receipt("addisonlee-nov.pdf")),
        expense("15/11/2025", 1, 175.00, "Travelodge", "Overnight stay – Birmingham", receipt("travelodge-confirmation.pdf")),
        expense("22/11/2025", 2, 59.99, "Currys", "Wireless mouse & keyboard", receipt("currys-receipt.png")),
      ],
    },
    {
      id: "seed-5",
      reportNumber: "B2030444125",
      purpose: "October 2025 expenses",
      status: "Processed",
      expenses: [
        expense("06/10/2025", 0, 41.00, "Uber", "Taxi to Heathrow", receipt("uber-heathrow-oct.pdf")),
        expense("19/10/2025", 1, 199.00, "Holiday Inn", "Hotel – Edinburgh trip", receipt("holidayinn-edinburgh.png")),
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
