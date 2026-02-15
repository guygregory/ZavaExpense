import { useState } from "react";
import type { Expense } from "../types";
import { EXPENSE_CATEGORIES } from "../types";
import { generateId } from "../state/store";
import { useLocale } from "../localization/useLocale";
import { isIsoDate } from "../localization/localeUtils";

interface Props {
  onSave: (expense: Expense) => void;
  onSaveAndNew: (expense: Expense) => void;
  onCancel: () => void;
}

const EMPTY: () => {
  category: string;
  date: string;
  amount: string;
  merchant: string;
  description: string;
} = () => ({
  category: EXPENSE_CATEGORIES[0].label,
  date: "",
  amount: "",
  merchant: "",
  description: "",
});

function getPaymentMethod(category: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.label === category)?.paymentMethod ?? "Cash";
}

function validateDate(d: string): boolean {
  return isIsoDate(d);
}

export default function NewExpensePanel({ onSave, onSaveAndNew, onCancel }: Props) {
  const { locale } = useLocale();
  const [form, setForm] = useState(EMPTY());
  const [errors, setErrors] = useState<string[]>([]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.merchant.trim()) errs.push("Merchant is required.");
    if (!form.date.trim()) errs.push("Date is required.");
    else if (!validateDate(form.date)) errs.push("Date must be valid.");
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) errs.push("Amount must be greater than 0.");
    return errs;
  };

  const buildExpense = (): Expense => ({
    id: generateId(),
    category: form.category,
    date: form.date,
    amount: parseFloat(form.amount),
    currency: locale.currencyCode,
    paymentMethod: getPaymentMethod(form.category),
    merchant: form.merchant,
    description: form.description,
  });

  const handleSave = () => {
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }
    onSave(buildExpense());
  };

  const handleSaveAndNew = () => {
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }
    onSaveAndNew(buildExpense());
    setForm(EMPTY());
    setErrors([]);
  };

  return (
    <div className="slide-panel" data-testid="new-expense-panel">
      <div className="slide-panel__header">
        <h2>New expense</h2>
        <button className="close-btn" data-testid="new-expense-cancel" onClick={onCancel}>
          ✕
        </button>
      </div>

      {errors.length > 0 && (
        <div className="validation-errors" data-testid="validation-errors">
          {errors.map((e, i) => (
            <div key={i} className="validation-error">{e}</div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="expense-category"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Transaction date</label>
        <input
          id="date"
          type="date"
          data-testid="expense-date"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          data-testid="expense-amount"
          value={form.amount}
          onChange={(e) => set("amount", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="currency">Currency</label>
        <select id="currency" data-testid="expense-currency" value={locale.currencyCode} disabled>
          <option value={locale.currencyCode}>{locale.currencyCode}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="paymentMethod">Payment method</label>
        <input
          id="paymentMethod"
          type="text"
          data-testid="expense-payment-method"
          value={getPaymentMethod(form.category)}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="merchant">Merchant</label>
        <input
          id="merchant"
          type="text"
          placeholder="Enter merchant name"
          data-testid="expense-merchant"
          value={form.merchant}
          onChange={(e) => set("merchant", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Business purpose</label>
        <textarea
          id="description"
          rows={3}
          placeholder="Describe the business purpose"
          data-testid="expense-description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="slide-panel__actions">
        <button className="btn btn--primary" data-testid="expense-save" onClick={handleSave}>
          Save
        </button>
        <button className="btn" data-testid="expense-save-and-new" onClick={handleSaveAndNew}>
          Save and new
        </button>
        <button className="btn" data-testid="expense-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
