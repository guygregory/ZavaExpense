import { useState } from "react";
import type { Expense } from "../types";
import { useLocale } from "../localization/useLocale";

interface Props {
  expense: Expense;
  onEdit: () => void;
  onAttachReceipt: () => void;
  onClose: () => void;
}

export default function ExpenseDetailsPanel({
  expense,
  onEdit,
  onAttachReceipt,
  onClose,
}: Props) {
  const { formatCurrency, formatDate } = useLocale();
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <div className="slide-panel" data-testid="expense-details-panel">
      <div className="slide-panel__header">
        <h2>Expense details</h2>
        <button className="close-btn" data-testid="details-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="details-section">
        <h3>Details</h3>
        <div className="detail-row">
          <span className="detail-label">Category</span>
          <span className="detail-value" data-testid="detail-category">{expense.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date</span>
          <span className="detail-value" data-testid="detail-date">{formatDate(expense.date)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Merchant</span>
          <span className="detail-value" data-testid="detail-merchant">{expense.merchant}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Amount</span>
          <span className="detail-value" data-testid="detail-amount">
            {formatCurrency(expense.amount)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Currency</span>
          <span className="detail-value" data-testid="detail-currency">{expense.currency}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Payment method</span>
          <span className="detail-value" data-testid="detail-payment-method">
            {expense.paymentMethod}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Business purpose</span>
          <span className="detail-value" data-testid="detail-description">
            {expense.description || "—"}
          </span>
        </div>
        <button className="link-btn" data-testid="detail-edit-link" onClick={onEdit}>
          Edit
        </button>
      </div>

      <div className="details-section">
        <h3>Receipts</h3>
        {expense.receipt ? (
          <div className="receipt-info" data-testid="detail-receipt-filename">
            {expense.receipt.filename}
          </div>
        ) : (
          <div className="receipt-info" data-testid="detail-no-receipt">
            No receipt attached
          </div>
        )}
      </div>

      <div className="details-section actions-section">
        <div className="dropdown-wrapper">
          <button
            className="btn"
            data-testid="expense-actions-btn"
            onClick={() => setActionsOpen(!actionsOpen)}
          >
            Actions ▾
          </button>
          {actionsOpen && (
            <div className="dropdown-menu" data-testid="expense-actions-menu">
              <button
                className="dropdown-item"
                data-testid="action-attach-receipt"
                onClick={() => {
                  setActionsOpen(false);
                  onAttachReceipt();
                }}
              >
                Attach receipt
              </button>
              <button
                className="dropdown-item"
                data-testid="action-edit"
                onClick={() => {
                  setActionsOpen(false);
                  onEdit();
                }}
              >
                Edit
              </button>
              <button className="dropdown-item" data-testid="action-financial-dimensions" disabled>
                Financial dimensions
              </button>
              <button className="dropdown-item" data-testid="action-split" disabled>
                Split
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
