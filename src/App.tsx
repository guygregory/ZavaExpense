import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExpenseManagement from "./pages/ExpenseManagement";
import ReportDetail from "./pages/ReportDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell" data-testid="app-shell">
        <header className="top-banner" data-testid="top-banner">
          <span className="top-banner__title">Big Systems Expenses</span>
        </header>
        <Routes>
          <Route path="/" element={<ExpenseManagement />} />
          <Route path="/reports/:reportId" element={<ReportDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
