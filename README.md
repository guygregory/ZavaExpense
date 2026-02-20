# Zava Expense

[![Demo Video](https://img.shields.io/badge/🎥_Watch_Demo-YouTube-red)](https://www.youtube.com/watch?v=QK3LyOAmDvw)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.x-blue.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-19.2-61dafb.svg)](https://react.dev/)

An intelligent expense management system demonstrating GitHub Copilot SDK capabilities with automated receipt processing, browser automation, and AI-powered expense categorization.

| 🎥 Zava Expense - GitHub Copilot SDK Demo |
|---|
| [![Watch the demo](https://github.com/user-attachments/assets/d9e91128-8eb5-40e6-947b-df7fabfe84b2)](https://www.youtube.com/watch?v=QK3LyOAmDvw) |
| [Watch on YouTube ↗](https://www.youtube.com/watch?v=QK3LyOAmDvw) |

## 📋 Table of Contents

- [Overview](#-overview)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

Zava Expense is a demonstration project showcasing the power of GitHub Copilot SDK for automating complex business workflows. The system automates the tedious process of expense report management by:

- **Analyzing receipts** using AI vision capabilities (for images) and text extraction (for PDFs)
- **Automating browser interactions** through Playwright MCP to fill expense forms
- **Contextualizing expenses** using WorkIQ calendar integration to determine business purpose
- **Supporting multi-locale** operations with localized interfaces (US, UK, EU)

This project serves as a practical example of how AI can streamline line-of-business applications and reduce manual data entry.

## 🛠 Technology Stack

### Backend
- **Python 3.x** - Core automation scripting
- **[GitHub Copilot SDK](https://github.com/microsoft/copilot-python-sdk)** - AI agent orchestration
- **pypdf** - PDF text extraction for receipt processing

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type-safe development
- **Vite 7.3** - Build tool and dev server
- **React Router 7.13** - Client-side routing
- **YAML 2.8** - Locale configuration management

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite Plugin React** - Fast refresh and JSX transform

### Integration & Automation
- **Playwright MCP** - Browser automation for web interaction
- **WorkIQ MCP** - Calendar lookup and business context integration
- **GitHub Copilot Agent Skills** - Custom skills for expense operations

## 🏗 Architecture

The system follows a dual-component architecture:

### Web Application
A single-page application (SPA) built with React that provides:
- **Expense Management Dashboard** - View and manage expense reports
- **Report Detail View** - Detailed expense item management
- **Multi-locale Support** - Dynamically loads locale-specific content
- **Responsive UI** - Modern, accessible interface

### Automation Backend
A Python-based automation system that:
1. **Connects to GitHub Copilot SDK** using Claude Haiku 4.5 model
2. **Loads custom skills** from `.github/skills` directory
3. **Integrates MCP servers** for Playwright and WorkIQ
4. **Processes natural language commands** to automate expense report tasks

<img width="741" height="585" alt="image" src="https://github.com/user-attachments/assets/d0f13655-59ab-48e5-9692-a9d112051c3e" />

<!--
```
┌──────────────────────────────────────────────────────────────────┐
│  User Command (e.g. "Add the receipt(s) to my expense report.")  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
         ┌──────────────────────────────┐
         │  GitHub Copilot SDK Client   │
         │  (Claude Haiku 4.5)          │
         └──────────┬───────────────────┘
                    │
        ┏━━━━━━━━━━━┻━━━━━━━━━━━━┓
        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│  Playwright MCP  │    │   WorkIQ MCP     │
│  (Browser Auto)  │    │ (Calendar Data)  │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│      Zava Expense Web Application       │
│  (React SPA - Expense Management UI)    │
└─────────────────────────────────────────┘
```
-->
## ✨ Key Features

### 🤖 Automated Receipt Processing
- **Multi-format support**: Processes `.png`, `.jpg`, and `.pdf` receipt files
- **AI-powered extraction**: Automatically extracts merchant, date, amount, and category
- **Batch processing**: Handles multiple receipts in a single automation run

### 🧠 Intelligent Context Integration
- **Calendar lookup**: Uses WorkIQ to fetch calendar events matching receipt dates
- **Business purpose generation**: Automatically generates descriptive business justifications
- **Smart categorization**: Assigns appropriate expense categories based on receipt content

### 🌍 Multi-Locale Support
- **Regional configurations**: Separate locale files for US, UK, and EU regions
- **Dynamic content**: Locale-specific labels, formats, and currencies
- **Localized receipts**: Region-specific receipt examples for testing

### 🎨 Modern Web Interface
- Clean, intuitive expense management dashboard
- Real-time expense report updates
- Receipt attachment and viewing
- Expense approval workflow support

### 🔧 Extensible Skills System
- **Custom GitHub Copilot Skills**: Modular skills defined in `.github/skills`
- **Documented workflows**: Comprehensive skill documentation for expense operations
- **Reusable components**: Skills can be leveraged across different automation scenarios

## 🚀 Getting Started

### Prerequisites

- **Python 3.x** installed
- **Node.js 18+** and npm/npx
- **Microsoft Edge** browser (or modify the Playwright configuration for a different browser)
- **GitHub Copilot SDK** access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ZavaExpense.git
   cd ZavaExpense
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install web application dependencies**
   ```bash
   cd web
   npm install
   ```

### Configuration

1. **Receipt Setup**: Place receipt files (`.png`, `.jpg`, or `.pdf`) in the appropriate locale folder:
   - US receipts: `receipts/us/`
   - UK receipts: `receipts/uk/`
   - EU receipts: `receipts/eu/`

2. **MCP Server Configuration**: The automation script is pre-configured to use:
   - **Playwright MCP**: Browser automation with Microsoft Edge
   - **WorkIQ MCP**: Calendar data integration

   To use a different browser, modify `zava-expense-ghcp-sdk.py`:
   ```python
   "playwright": {
       "command": "npx",
       "args": ["@playwright/mcp@latest"],  # Remove --browser=msedge
   }
   ```

### Running the Application

#### Start the Web Application (Development Mode)
```bash
cd web
npm run dev
```
The application will be available at `http://localhost:5173` (or the port Vite assigns).

#### Run the Automation Script
```bash
python zava-expense-ghcp-sdk.py
```

The script will:
1. Connect to GitHub Copilot SDK
2. Load the Zava Expense skill
3. Process receipts from the configured directory
4. Automate the expense report creation process

### Building for Production

```bash
cd web
npm run build
```

Built files will be output to `web/dist/` and can be deployed to any static hosting service or Azure Static Web Apps.

## 📁 Project Structure

```
ZavaExpense/
├── web/                          # React web application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── AboutPanel.tsx
│   │   │   ├── ExpenseDetailsPanel.tsx
│   │   │   ├── NewExpensePanel.tsx
│   │   │   ├── OptionsPanel.tsx
│   │   │   ├── ReceiptUploadModal.tsx
│   │   │   └── SettingsMenu.tsx
│   │   ├── localization/         # Locale management
│   │   │   ├── LocaleContext.ts
│   │   │   ├── LocaleProvider.tsx
│   │   │   ├── localeUtils.ts
│   │   │   └── useLocale.ts
│   │   ├── pages/                # Page components
│   │   │   ├── ExpenseManagement.tsx
│   │   │   └── ReportDetail.tsx
│   │   ├── state/                # State management
│   │   │   └── store.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── public/
│   │   └── locales/              # Locale configuration files
│   │       ├── eu.yaml
│   │       ├── uk.yaml
│   │       └── us.yaml
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── staticwebapp.config.json  # Azure Static Web Apps config
├── receipts/                     # Receipt storage (by locale)
│   ├── us/
│   ├── uk/
│   ├── eu/
│   └── prompts/                  # Training prompts
│       ├── train-us.md
│       ├── train-uk.md
│       ├── train-eu.md
│       └── train.md
├── .github/
│   ├── skills/                   # GitHub Copilot Agent Skills
│   │   └── zava-expense/
│   │       └── SKILL.md          # Expense processing skill definition
│   ├── prompts/                  # Prompt templates
│   │   └── readme-blueprint-generator.prompt.md
│   └── workflows/                # CI/CD workflows
├── zava-expense-ghcp-sdk.py     # Main automation script
├── requirements.txt              # Python dependencies
├── package.json                  # Root package metadata
├── README.md                     # This file
├── CONTRIBUTING.md               # Contribution guidelines
├── LICENSE                       # MIT License
├── SECURITY.md                   # Security policy
└── SUPPORT.md                    # Support information
```

## 💡 Usage

### Basic Workflow

1. **Add Receipts**: Place receipt files in the appropriate receipts directory (`receipts/us/`, `receipts/uk/`, or `receipts/eu/`)

2. **Run Automation**: Execute the Python script:
   ```bash
   python zava-expense-ghcp-sdk.py
   ```

3. **Natural Language Command**: The script sends the command:
   ```
   "Add the receipt(s) to my expense report."
   ```

4. **Automated Processing**:
   - Opens the Zava Expense web application
   - Creates or opens the current month's expense report
   - Analyzes each receipt to extract details
   - Looks up calendar events for business context
   - Creates expense items with all required fields
   - Attaches receipt files
   - Saves and closes the report
<!--
### Manual Web Interface

Navigate to the web application URL and:
- **View Reports**: See all expense reports with status
- **Create Reports**: Click "+ New expense report"
- **Add Expenses**: Within a report, click "+ New expense"
- **Attach Receipts**: Use the Actions dropdown to attach receipts
- **Submit Reports**: Submit reports for approval when complete

### Supported Expense Categories

- Gift
- Hardware
- Hotel
- Marketing
- Meals
- Morale
- Office Supplies
- Software
- Training
- Travel

## 🔧 Development

### Web Application Development

#### Run Development Server
```bash
cd web
npm run dev
```

#### Linting
```bash
npm run lint
```

#### Type Checking
TypeScript compilation is integrated into the build process. For standalone type checking, run:
```bash
npx tsc --noEmit
```

#### Build for Production
```bash
npm run build
```

### Python Automation Script Development

The main automation logic resides in `zava-expense-ghcp-sdk.py`. Key components:

- **CopilotClient**: Manages the connection to GitHub Copilot SDK
- **Session Configuration**: Defines model, skills path, and MCP servers
- **Event Handler**: Processes assistant messages and session state
- **Async Execution**: Uses asyncio for non-blocking operations

#### Modifying the Skill

Edit `.github/skills/zava-expense/SKILL.md` to:
- Adjust receipt processing workflow
- Add new expense categories
- Customize business purpose generation logic
- Modify form filling strategies

### Locale Management

Locales are defined in `web/public/locales/` as YAML files. To add a new locale:

1. Create a new YAML file (e.g., `de.yaml`)
2. Define all required locale keys
3. Update the `LocaleProvider` component to support the new locale

## 🧪 Testing

### Web Application Testing

Currently, the project uses ESLint for static analysis. To add testing:

**Install testing dependencies:**
```bash
cd web
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Add test scripts to `web/package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Run tests:**
```bash
npm test
```

### Automation Script Testing

Test the Python automation script by:
1. Placing sample receipts in the receipts directory
2. Running the script in a controlled environment
3. Verifying the expense report creation and receipt attachment
-->
## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Start for Contributors

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the coding standards
4. **Test your changes** thoroughly
5. **Commit with clear messages**: `git commit -m "Add feature: description"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Submit a Pull Request** with a detailed description

### Code of Conduct

This project follows the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). Please be respectful and inclusive in all interactions.

### Reporting Issues

Found a bug or have a feature request? Please check if it's already been reported, then [open a new issue](https://github.com/your-org/ZavaExpense/issues/new) with:
- Clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Environment details (OS, browser, Python version)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) Microsoft Corporation.

## 📞 Support

For support and questions, please check [SUPPORT.md](SUPPORT.md).

## 🔒 Security

Security issues should be reported to the Microsoft Security Response Center (MSRC). See [SECURITY.md](SECURITY.md) for details.

## 🙏 Acknowledgments

- Built with [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- Powered by [Claude Haiku 4.5](https://www.anthropic.com/claude)
- Browser automation by [Playwright MCP](https://github.com/microsoft/playwright)
- Calendar lookup via [WorkIQ MCP](https://github.com/microsoft/work-iq-mcp)

---

Made with ❤️ and GitHub Copilot
