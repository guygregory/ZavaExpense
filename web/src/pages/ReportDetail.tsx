import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Report, Expense, ReceiptRef, ReportStatus } from "../types";
import { REPORT_STATUSES } from "../types";
import { loadReports, saveReports } from "../state/store";
import NewExpensePanel from "../components/NewExpensePanel";
import ExpenseDetailsPanel from "../components/ExpenseDetailsPanel";
import ReceiptUploadModal from "../components/ReceiptUploadModal";
import { useLocale } from "../localization/useLocale";

export default function ReportDetail() {
  const { locale, formatCurrency, formatDate } = useLocale();
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>(loadReports);
  const [activeTab, setActiveTab] = useState<"Expenses" | "Receipts">("Expenses");
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [editingPurpose, setEditingPurpose] = useState(false);
  const [purposeDraft, setPurposeDraft] = useState("");

  const report = useMemo(
    () => reports.find((r) => r.id === reportId),
    [reports, reportId]
  );

  const persist = useCallback(
    (updated: Report[]) => {
      saveReports(updated);
      setReports(updated);
    },
    []
  );

  const updateReport = useCallback(
    (updater: (r: Report) => Report) => {
      const updated = reports.map((r) => (r.id === reportId ? updater(r) : r));
      persist(updated);
    },
    [reports, reportId, persist]
  );

  const addExpense = useCallback(
    (expense: Expense) => {
      updateReport((r) => ({
        ...r,
        expenses: [...r.expenses, expense],
      }));
    },
    [updateReport]
  );

  const attachReceipt = useCallback(
    (receipt: ReceiptRef) => {
      if (!selectedExpenseId) return;
      updateReport((r) => ({
        ...r,
        expenses: r.expenses.map((e) =>
          e.id === selectedExpenseId ? { ...e, receipt } : e
        ),
      }));
      setShowReceiptModal(false);
    },
    [selectedExpenseId, updateReport]
  );

  const allReceipts = useMemo(() => {
    if (!report) return [];
    return report.expenses
      .filter((e) => e.receipt)
      .map((e) => e.receipt!);
  }, [report]);

  if (!report) {
    return (
      <div className="page" data-testid="report-not-found">
        <h1>Report not found</h1>
        <button className="btn" onClick={() => navigate("/")}>
          Back to Expense management
        </button>
      </div>
    );
  }

  const totalAmount = report.expenses.reduce((s, e) => s + e.amount, 0);
  const receiptsCount = report.expenses.filter((e) => e.receipt).length;
  const selectedExpense = report.expenses.find((e) => e.id === selectedExpenseId) || null;

  return (
    <div className="page report-detail-page" data-testid="report-detail-page">
      <div className="report-header" data-testid="report-header">
        {editingPurpose ? (
          <div className="purpose-edit">
            <input
              type="text"
              data-testid="report-purpose-input"
              value={purposeDraft}
              autoFocus
              onChange={(e) => setPurposeDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateReport((r) => ({ ...r, purpose: purposeDraft }));
                  setEditingPurpose(false);
                } else if (e.key === "Escape") {
                  setEditingPurpose(false);
                }
              }}
            />
            <button
              className="btn btn--primary btn--small"
              data-testid="report-purpose-save"
              onClick={() => {
                updateReport((r) => ({ ...r, purpose: purposeDraft }));
                setEditingPurpose(false);
              }}
            >
              Save
            </button>
            <button
              className="btn btn--small"
              data-testid="report-purpose-cancel"
              onClick={() => setEditingPurpose(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="report-purpose-heading">
            <h1 data-testid="report-purpose">{report.purpose}</h1>
            <button
              className="link-btn purpose-edit-link"
              data-testid="report-purpose-edit"
              onClick={() => {
                setPurposeDraft(report.purpose);
                setEditingPurpose(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn--primary save-and-close-btn"
              data-testid="save-and-close"
              onClick={() => navigate("/")}
            >
              Save and close
            </button>
          </div>
        )}
      </div>

      <div className="summary-bar" data-testid="summary-bar">
        <div className="summary-item">
          <span className="summary-label">To be paid</span>
          <span className="summary-value" data-testid="summary-amount">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Receipts</span>
          <span className="summary-value" data-testid="summary-receipts">
            {receiptsCount}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Status</span>
          <select
            className="summary-select"
            data-testid="report-status-select"
            value={report.status}
            onChange={(e) =>
              updateReport((r) => ({ ...r, status: e.target.value as ReportStatus }))
            }
          >
            {REPORT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="summary-item">
          <span className="summary-label">Interim approvers</span>
          <span className="summary-value" data-testid="summary-interim-approvers">
            —
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Final approver</span>
          <span className="summary-value" data-testid="summary-final-approver">
            —
          </span>
        </div>
      </div>

      <div className="tabs" data-testid="report-tabs">
        <button
          className={`tab ${activeTab === "Expenses" ? "tab--active" : ""}`}
          data-testid="tab-expenses"
          onClick={() => setActiveTab("Expenses")}
        >
          Expenses
        </button>
        <button
          className={`tab ${activeTab === "Receipts" ? "tab--active" : ""}`}
          data-testid="tab-receipts"
          onClick={() => setActiveTab("Receipts")}
        >
          Receipts
        </button>
      </div>

      <div className="actions-bar" data-testid="report-actions-bar">
        <button
          className="btn btn--primary"
          data-testid="new-expense"
          disabled={report.status !== "Draft"}
          onClick={() => {
            setShowNewExpense(true);
            setSelectedExpenseId(null);
          }}
        >
          + New expense
        </button>
        <button className="btn" data-testid="unattached-expenses" disabled>
          + Unattached expenses
        </button>
        <button className="btn" data-testid="remove-expense" disabled>
          Remove
        </button>
        <button className="btn" data-testid="bulk-edit" disabled>
          Bulk edit
        </button>
        <button className="btn" data-testid="copy-expense" disabled>
          Copy
        </button>
      </div>

      <div className="report-content-area">
        <div className="report-main">
          {activeTab === "Expenses" && (
            <table className="data-table" data-testid="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Expense category</th>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>{`Amount in ${locale.currencyCode}`}</th>
                  <th>Payment method</th>
                  <th>Receipts attached</th>
                </tr>
              </thead>
              <tbody>
                {report.expenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-row">
                      No expenses. Click "+ New expense" to add one.
                    </td>
                  </tr>
                )}
                {report.expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className={selectedExpenseId === exp.id ? "row--selected" : ""}
                    data-testid={`expense-row-${exp.id}`}
                    onClick={() => {
                      setSelectedExpenseId(exp.id);
                      setShowNewExpense(false);
                    }}
                  >
                    <td data-testid={`expense-date-${exp.id}`}>{formatDate(exp.date)}</td>
                    <td data-testid={`expense-category-${exp.id}`}>{exp.category}</td>
                    <td data-testid={`expense-merchant-${exp.id}`}>{exp.merchant}</td>
                    <td data-testid={`expense-amount-${exp.id}`}>{formatCurrency(exp.amount)}</td>
                    <td data-testid={`expense-gbp-${exp.id}`}>{formatCurrency(exp.amount)}</td>
                    <td data-testid={`expense-payment-${exp.id}`}>{exp.paymentMethod}</td>
                    <td data-testid={`expense-receipts-${exp.id}`}>
                      {exp.receipt ? 1 : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "Receipts" && (
            <div data-testid="report-receipts-tab">
              {allReceipts.length === 0 ? (
                <p>No receipts attached to expenses in this report.</p>
              ) : (
                <ul className="receipt-list">
                  {allReceipts.map((r) => (
                    <li key={r.id} className="receipt-list-item">
                      <span>{r.filename}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {showNewExpense && (
          <NewExpensePanel
            onSave={(exp) => {
              addExpense(exp);
              setShowNewExpense(false);
            }}
            onSaveAndNew={(exp) => {
              addExpense(exp);
            }}
            onCancel={() => setShowNewExpense(false)}
          />
        )}

        {selectedExpense && !showNewExpense && (
          <ExpenseDetailsPanel
            expense={selectedExpense}
            onEdit={() => {
              // placeholder — edit not implemented in prototype
            }}
            onAttachReceipt={() => setShowReceiptModal(true)}
            onClose={() => setSelectedExpenseId(null)}
          />
        )}
      </div>

      {showReceiptModal && (
        <ReceiptUploadModal
          existingReceipts={allReceipts}
          onUpload={attachReceipt}
          onSelectExisting={attachReceipt}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}
