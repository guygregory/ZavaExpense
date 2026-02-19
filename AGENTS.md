# Zava Expense — Agent Instructions

## Project Overview

Zava Expense is a demonstration project showcasing the GitHub Copilot SDK for automating expense management workflows. It consists of two main components:

1. **Web Application** — A React SPA for viewing and managing expense reports
2. **Automation Backend** — A Python script that uses GitHub Copilot SDK with Playwright MCP and WorkIQ MCP to automate receipt processing

## Zava Brand Colors

| Name               | Hex       | Usage                                  |
|--------------------|-----------|----------------------------------------|
| White              | `#FFFFFF` | Surface backgrounds, text on dark      |
| Black              | `#0A0C0C` | Primary text, high-contrast elements   |
| Data Mesh Drk Blue | `#002140` | Top banner, dark brand backgrounds     |
| Data Stream Lt Blue| `#9EC9D9` | Accent highlights, secondary elements  |
| Data Sensor Slate  | `#183D4C` | Supporting dark UI elements            |

When creating or modifying UI components, use these brand colors. The CSS custom property `--color-primary` (`#0078d4`) is used as the interactive accent (buttons, links, active tabs) and should remain distinct from the brand palette.

## Technology Stack

### Backend (Python)
- **Python 3.x** — Core automation scripting
- **GitHub Copilot SDK** (`github-copilot-sdk`) — AI agent orchestration
- **pypdf** — PDF text extraction for receipt processing

### Frontend (Web)
- **React 19.2** with **TypeScript 5.9**
- **Vite 7.3** — Build tool and dev server
- **React Router 7.13** — Client-side routing
- **YAML 2.8** — Locale configuration parsing
- **ESLint** — Linting with TypeScript ESLint

### Integration
- **Playwright MCP** — Browser automation (default: Microsoft Edge)
- **WorkIQ MCP** — Calendar lookup for business context
- **GitHub Copilot Agent Skills** — Custom skills in `.github/skills/`

## Project Structure

```
ZavaExpense/
├── zava-expense-ghcp-sdk.py      # Main automation script
├── requirements.txt              # Python dependencies (github-copilot-sdk, pypdf)
├── web/                          # React SPA
│   ├── src/
│   │   ├── components/           # UI components (panels, modals, menus)
│   │   ├── localization/         # Locale context, provider, and utilities
│   │   ├── pages/                # ExpenseManagement, ReportDetail
│   │   ├── state/store.ts        # Client-side state with localStorage persistence
│   │   ├── types/index.ts        # TypeScript type definitions
│   │   ├── App.tsx               # Root component with routing
│   │   └── App.css               # All application styles (CSS custom properties)
│   └── public/locales/           # Locale YAML files (us.yaml, uk.yaml, eu.yaml)
├── receipts/                     # Receipt files organized by locale
│   ├── us/ | uk/ | eu/
│   └── prompts/                  # Training prompts for receipt generation
├── .github/
│   ├── skills/zava-expense/      # Copilot agent skill definition (SKILL.md)
│   └── prompts/                  # Prompt templates
└── deck/                         # Presentation materials
```

## Coding Conventions

### Python
- Use `asyncio` for async operations (the main script is fully async)
- Use the `CopilotClient` class from the GitHub Copilot SDK
- Keep the event handler pattern for processing SDK events
- Follow PEP 8 style guidelines

### TypeScript / React
- Use **functional components** exclusively (no class components)
- Use **TypeScript interfaces** for all data types (defined in `types/index.ts`)
- State management uses a custom store pattern in `state/store.ts` with `localStorage` persistence
- Use **CSS custom properties** defined in `:root` of `App.css` — do not introduce CSS modules or styled-components
- All styles live in `App.css` — use BEM-like naming (e.g., `.top-banner__logo`, `.btn--primary`)
- Font family: `"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif` (and `"Inter"` for the banner title)
- Use `react-router-dom` for routing with `<Link>` and `<Routes>`

### Localization
- Locale files are YAML in `web/public/locales/` (us, uk, eu)
- Locale is accessed via a React context (`LocaleProvider` / `useLocale`)
- Locale utilities live in `localization/localeUtils.ts`
- Currency is always **GBP**
- Date format for inputs: always `yyyy-MM-dd` (HTML `type="date"`)

## Key Data Types

```typescript
interface Expense {
  id: string;
  category: string;       // One of: Gift, Hardware, Hotel, Marketing, Meals, Morale, Office Supplies, Software, Training, Travel
  date: string;            // ISO: YYYY-MM-DD
  amount: number;
  currency: CurrencyCode;  // Always "GBP"
  paymentMethod: string;   // Default: "Cash"
  merchant: string;
  description: string;
  receipt?: ReceiptRef;
}

interface Report {
  id: string;
  reportNumber: string;
  purpose: string;
  status: ReportStatus;    // "Draft" | "In review" | "Processed" | "Approved"
  expenses: Expense[];
}
```

## Development Commands

### Web Application
```bash
cd web
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript compile + Vite production build → web/dist/
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Python Automation
```bash
pip install -r requirements.txt    # Install github-copilot-sdk, pypdf
python zava-expense-ghcp-sdk.py    # Run the automation
```

## Important Guidelines

1. **Do not modify the SKILL.md workflow steps** without understanding the full automation chain — the Python script, Playwright MCP, and WorkIQ MCP all depend on the documented workflow
2. **Receipt files** must only be accessed from `receipts/us/`, `receipts/uk/`, or `receipts/eu/` — never access other directories
3. **Always use GBP** as the expense currency
4. **Date fields** use `type="date"` and require `yyyy-MM-dd` format — never use `DD/MM/YYYY`
5. **State persistence** uses `localStorage` with the key `bs-expense-reports` — avoid changing this key
6. **The web app is deployed as an Azure Static Web App** — see `staticwebapp.config.json` for routing rules
7. **The Copilot SDK model** is `claude-haiku-4.5` — this is configured in `zava-expense-ghcp-sdk.py`
8. **Browser automation** defaults to Microsoft Edge via `--browser=msedge` flag in the Playwright MCP config

## License

MIT — Copyright (c) Microsoft Corporation
