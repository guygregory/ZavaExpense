import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Report } from "../types";
import {
  loadReports,
  saveReports,
  resetSession,
  generateReportNumber,
  generateId,
} from "../state/store";

export default function ExpenseManagement() {
  const [reports, setReports] = useState<Report[]>(loadReports);
  const [activeTab, setActiveTab] = useState<"Reports" | "Receipts" | "Expenses">("Reports");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    setReports(loadReports());
  }, []);

  const handleNewReport = () => {
    const now = new Date();
    const monthsBack = reports.length;
    const target = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const report: Report = {
      id: generateId(),
      reportNumber: generateReportNumber(),
      purpose: `${monthNames[target.getMonth()]} ${target.getFullYear()} expenses`,
      status: "Draft",
      expenses: [],
    };
    const updated = [...reports, report];
    saveReports(updated);
    setReports(updated);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const updated = reports.filter((r) => r.id !== selectedId);
    saveReports(updated);
    setReports(updated);
    setSelectedId(null);
  };

  const handleReset = () => {
    resetSession();
    refresh();
    setSelectedId(null);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    const selected = reports.find((r) => r.id === selectedId);
    if (!selected || selected.status !== "Draft" || selected.expenses.length === 0) return;
    const updated = reports.map((r) =>
      r.id === selectedId ? { ...r, status: "In review" as const } : r
    );
    saveReports(updated);
    setReports(updated);
  };

  const totalAmount = (r: Report) =>
    r.expenses.reduce((sum, e) => sum + e.amount, 0);

  const selectedReport = reports.find((r) => r.id === selectedId) ?? null;
  const canSubmit =
    selectedReport !== null &&
    selectedReport.status === "Draft" &&
    selectedReport.expenses.length > 0;

  return (
    <div className="page" data-testid="expense-management-page">
      <h1 className="page-title" data-testid="page-title">Expense management</h1>

      <div className="tabs" data-testid="main-tabs">
        {(["Reports", "Receipts", "Expenses"] as const).map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "tab--active" : ""}`}
            data-testid={`tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="actions-bar" data-testid="actions-bar">
        <button
          className="btn btn--primary"
          data-testid="new-expense-report"
          onClick={handleNewReport}
        >
          + New expense report
        </button>
        <button
          className="btn"
          data-testid="delete-report"
          disabled={!selectedId}
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="btn"
          data-testid="submit-report"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button className="btn" data-testid="recall-report" disabled>
          Recall
        </button>
        <button className="btn" data-testid="copy-report" disabled>
          Copy
        </button>
        <button className="btn" data-testid="view-history" disabled>
          View history
        </button>
        <button
          className="btn btn--danger"
          data-testid="reset-session"
          onClick={handleReset}
        >
          Reset session
        </button>
      </div>

      {activeTab === "Reports" && (
        <table className="data-table" data-testid="reports-table">
          <thead>
            <tr>
              <th></th>
              <th>Expense report number</th>
              <th>Purpose</th>
              <th>Amount</th>
              <th>Approval status</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-row">
                  No expense reports. Click "+ New expense report" to create one.
                </td>
              </tr>
            )}
            {reports.map((r) => (
              <tr
                key={r.id}
                className={selectedId === r.id ? "row--selected" : ""}
                data-testid={`report-row-${r.reportNumber}`}
                onClick={() => setSelectedId(r.id)}
              >
                <td>
                  <input
                    type="radio"
                    checked={selectedId === r.id}
                    onChange={() => setSelectedId(r.id)}
                    data-testid={`report-select-${r.reportNumber}`}
                  />
                </td>
                <td>
                  <button
                    className="link-btn"
                    data-testid={`report-link-${r.reportNumber}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/reports/${r.id}`);
                    }}
                  >
                    {r.reportNumber}
                  </button>
                </td>
                <td data-testid={`report-purpose-${r.reportNumber}`}>{r.purpose}</td>
                <td data-testid={`report-amount-${r.reportNumber}`}>
                  £{totalAmount(r).toFixed(2)}
                </td>
                <td data-testid={`report-status-${r.reportNumber}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "Receipts" && (
        <div className="placeholder-tab" data-testid="receipts-tab-content">
          <p>Receipts view — placeholder</p>
        </div>
      )}

      {activeTab === "Expenses" && (
        <div className="placeholder-tab" data-testid="expenses-tab-content">
          <p>Expenses view — placeholder</p>
        </div>
      )}
    </div>
  );
}
