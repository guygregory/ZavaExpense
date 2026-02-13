---
name: bs-expense
description: Skill for adding expense items to expense reports in the Big Systems Expenses system (BSExpense). Uses AI vision to analyze receipt images (.png), extract transaction details, categorize expenses, and attach receipts. Integrates with WorkIQ for calendar lookup to determine business purpose. Use when users ask to process receipts, add expenses, create expense reports, or manage expense claims.
---

# BS Expense Tool

This skill enables interaction with the Big Systems Expenses system (BSExpense) for processing expense receipts and managing expense reports. **This skill requires the Playwright MCP tool** for browser automation and **WorkIQ MCP tool** for calendar lookup.

## Key URLs

| Page | URL |
|------|-----|
| Expense Management | https://aka.ms/bsexpense |

## Receipt File Location

- **Local Path**: `C:\BSExpense`
- **File Format**: `.png` images only
- Only access files in this specific folder - do not access any other files or folders on the local PC
- **Important**: The Playwright browser automation environment may restrict file uploads to the current working directory. At the start of processing, **pre-copy all `.png` receipt files** from `C:\BSExpense` to the working directory (e.g., the project folder) so they are accessible during the attach receipt step. Do this before navigating to BS Expense.

## Required Tools

| Tool | Purpose |
|------|---------|
| Playwright MCP | Browser automation for MS Expense system |
| WorkIQ MCP | Calendar lookup to determine business purpose |
| Built-in Vision | Analyze receipt images to extract transaction details |

## Expense Categories

Select the appropriate category based on the receipt content:

| Category | Description | Default Payment Method |
|----------|-------------|------------------------|
| Gift \| external | Gift and Entertainment | Cash |
| Government Official | Government Official | Cash |
| Travel | Travel - Travel | Cash |
| Hardware (Supplies General) | Technology Expense - Hardware | Cash |
| Hardware Dev (Prod Dev-Other) | Technology Expense - Hardware | Cash |
| Hotel | Accommodation - Hotel | Cash |

## New Expense Form Fields

When creating a new expense item:

| Field | Description | Notes |
|-------|-------------|-------|
| Category | Expense category | Select from dropdown based on receipt type |
| Date | Transaction date | Extract from receipt (use transaction date, NOT travel date) |
| Amount | Expense amount | Extract from receipt |
| Currency | Currency code | **Always use GBP** |
| Payment method | How it was paid | Auto-populated based on category |
| Merchant | Vendor/merchant name | Extract from receipt |
| Expense Description / Business Purpose | Natural language description | Generate from receipt + WorkIQ calendar context |

## Workflow for Processing Receipts

### Step 1: Prepare Receipt Files
1. Copy all `.png` receipt files from `C:\BSExpense` to the current working directory
   - This avoids file permission issues during the Playwright file upload step, which may restrict access to paths outside the working directory
2. Verify the files were copied successfully before proceeding

### Step 2: Navigate to BS Expense
1. Use Playwright MCP to browse to https://aka.ms/bsexpense
2. Wait for the Expense Management page to load
3. The page shows a list of expense reports with columns: Expense report number, Purpose, Amount, Receipts attached, Approval status, Invoice, Payment voucher, Payment date

### Step 3: Open or Create Current Month's Expense Report
1. Look for an expense report with **Approval status = "Draft"**
2. **If a Draft report exists**: Click on the expense report number to open it
3. **If no Draft report exists**: 
   - Click "+ New expense report"
   - Enter the current month name as the title (e.g., "February 2026")
   - Enter purpose as "[Month] expenses" (e.g., "February expenses")
   - Save the new report

### Step 4: Check Receipt Files and Batch Analyze
1. Check the working directory for the `.png` files copied in Step 1
2. **If multiple receipts exist**, analyze all receipts upfront before opening the browser:
   - Run AI Vision (Step 5) on every `.png` file first to extract transaction details
   - Run WorkIQ lookups (Step 6) for each unique transaction date
   - Collect all extracted data (date, merchant, amount, category, business purpose) into a batch list
3. Then proceed to process each receipt sequentially in the browser (Steps 8-10), using the pre-collected data to minimize context switching between vision/calendar tools and browser automation
4. **If only one receipt exists**, proceed directly to Step 5

### Step 5: Analyze Receipt with AI Vision
Use built-in vision capabilities to extract the following from the receipt image:

1. **Transaction Date**: The date the purchase was made (NOT the travel date if different)
2. **Merchant Name**: The vendor/business name on the receipt
3. **Amount**: The total amount paid
4. **Expense Type**: Determine the appropriate category (Travel, Hotel, etc.)
5. **Receipt Details**: Any relevant details for the description

### Step 6: Determine Business Purpose via WorkIQ
1. Use WorkIQ MCP tool to check the calendar for the transaction date
2. **Use a targeted query** include context from the receipt to narrow results. For example, "What meetings are on [date]?". Avoid asking for all events across a date range
3. Identify what event, meeting, or business activity occurred on that date
4. Formulate a business justification based on the calendar context
5. Example: "Transportation to customer meeting at [Location]" or "Hotel accommodation for [Event Name]"
### Step 6: Determine Business Purpose via WorkIQ
1. Use WorkIQ MCP tool to check the calendar for the transaction date
2. **Use a targeted query** include context from the receipt to narrow results. For example, "What meetings are on [date]?". Avoid asking for all events across a date range
3. Identify what event, meeting, or business activity occurred on that date
4. **Confirm the event details**:
   - Event title
   - Date(s)
   - Location (if specified)
5. Formulate a business justification based on the calendar context
6. Example: "Transportation to customer meeting at [Location]" or "Hotel accommodation for [Event Name]"

### Step 7: Create New Expense Item
1. In the open expense report, click "+ New expense"
2. A "New expense" panel appears on the right side
3. Fill in the form fields:
   - **Category**: Select from dropdown (e.g., "Travel")
   - **Date**: The date input field uses `type="date"`, so **always use `yyyy-MM-dd` format** (e.g., `2026-01-28`). Do NOT use `DD/MM/YYYY`.
   - **Amount**: Enter the amount from receipt
   - **Currency**: Select "GBP" (always use GBP)
   - **Merchant**: Enter the merchant name from receipt
   - **Expense Description / Business Purpose**: Enter the natural language description combining receipt details and WorkIQ calendar context
4. **Form filling strategy**: Fill the date field separately first to confirm the format is accepted, then batch-fill the remaining text fields (Amount, Merchant, Business Purpose) together using `fill_form`. The Category and Currency dropdowns should also be handled individually as they require selection interactions.
5. Click "Save" button

### Step 9: Attach Receipt
1. After saving, the expense item appears in the list
2. Select the expense item row
3. On the right-hand panel, look for the "Actions" dropdown button
4. Click "Actions" and select "Attach receipt"
5. A "Receipts" panel opens with "Add new" tab
6. Click "Browse" button
7. In the file dialog, select the corresponding `.png` receipt file **from the working directory** (copied in Step 1)
8. Click "Open" to upload
9. Click "Upload" button to attach the receipt
10. Click "OK" or "Close" to complete

### Step 10: Clean Up Temporary File
1. After the receipt has been successfully uploaded and attached, delete the temporary `.png` file that was copied to the working directory in Step 1
2. This keeps the workspace clean and avoids leftover files

### Step 11: Repeat for Additional Receipts
- Repeat Steps 5-10 for each `.png` receipt file

## UI Element Reference

### Main Expense Management Page
- **Header**: Shows "Big Systems Expenses" title with "Expense management" subtitle
- **Tabs**: Reports | Receipts | Expenses
- **Actions Bar**: + New expense report | Delete | Submit | Recall | Copy | View history | Reset session
- **Report List Columns**: Expense report number | Purpose | Amount | Approval status

### Expense Report Detail Page
- **Header**: Shows report title (e.g., "December 2025 expenses") with "Edit" link and "Save and close" button
- **Summary Bar**: To be paid amount (£306.99) | Receipts count (3) | Status dropdown (Processed) | Interim approvers (—) | Final approver (—)
- **Tabs**: Expenses | Receipts
- **Actions Bar**: + New expense | + Unattached expenses | Remove | Bulk edit | Copy
- **Expense List Columns**: Date | Expense category | Merchant | Amount | Amount in GBP | Payment method | Receipts attached
- **Expense Items**: Rows showing transaction details (e.g., 03/12/2025 | Ground Transportation | Bolt | £22.00 | £22.00 | Cash | 1 receipt)
- **Right Panel**: Opens when expense row is selected - shows detailed view with edit capabilities, attached receipts section, and expandable Details
- **Actions Dropdown**: Available in right panel for selected expense - contains options like Attach receipt, Edit, Financial dimensions, Split

### New Expense Panel (Right Side)
- **Category**: Dropdown selector (default: "")
- **Transaction date**: Date picker (`type="date"`, format: `yyyy-MM-dd`)
- **Amount**: Number input (default: 0.00)
- **Currency**: Dropdown selector (default: GBP)
- **Payment method**: Text field (default: Cash)
- **Merchant**: Text input with placeholder "Enter merchant name"
- **Business purpose**: Text area with placeholder "Describe the business purpose"
- **Buttons**: Save | Save and new | Cancel

### Receipt Upload Dialog
- **Tabs**: Add new | Select existing
- **File to upload**: File path display
- **Browse**: Button to open file picker
- **Notes**: Optional text field
- **Name**: Optional text field
- **Document Type**: Dropdown (default: File)
- **Upload**: Button to upload selected file
- **OK / Close**: Complete the dialog

## Examples

### Example 1: Process a Travel Receipt
**Receipt shows**: Uber ride, £15.00, dated 13/01/2026
**WorkIQ shows**: Customer meeting at Contoso Ltd on 13/01/2026

1. Open Draft expense report
2. Click "+ New expense"
3. Category: Travel
4. Date: 2026-01-13
5. Amount: 15.00, Currency: GBP
6. Merchant: Uber
7. Description: "Uber transportation to customer meeting at Contoso Ltd"
8. Save, then Actions > Attach receipt > Browse to receipt file (from working directory)

### Example 2: Process a Hotel Receipt
**Receipt shows**: Premier Inn, £89.00, dated 20/01/2026
**WorkIQ shows**: Tech Conference in Manchester, 20-21/01/2026

1. Open Draft expense report
2. Click "+ New expense"
3. Category: Hotel
4. Date: 2026-01-20
5. Amount: 89.00, Currency: GBP
6. Merchant: Premier Inn
7. Description: "Hotel accommodation for Tech Conference in Manchester"
8. Save, then Actions > Attach receipt > Browse to receipt file (from working directory)

## Guidelines

1. **Always use GBP** as the currency
2. **Transaction date** is the date on the receipt, not the travel date (they may differ)
3. **Date format**: Always use `yyyy-MM-dd` for the date input field (it is `type="date"`). Never use `DD/MM/YYYY`.
4. **Pre-copy receipts**: Copy receipt files from `C:\BSExpense` to the working directory before starting browser automation, to avoid file permission issues during upload
5. **Use AI vision** to analyze receipt images - no additional code required
6. **Use WorkIQ** with highly targeted queries that include context from the receipt such as location or merchant (e.g., "What is the business event in [location] on [date]?") to minimize returned data and avoid retrieving excessive calendar information
7. **Only access** the specified receipt folder - do not browse other directories
8. **Match expense category** to receipt type (transportation, hotel, hardware, etc.)
9. **Generate natural language descriptions** that combine receipt details with calendar context
10. **Attach receipts** after saving each expense item, uploading from the working directory copy
11. **Form filling strategy**: Fill the date field separately first, then batch-fill text fields (Amount, Merchant, Business Purpose). Handle dropdowns (Category, Currency) individually.
12. **No screenshot needed**: Do not take a screenshot at the end of the workflow. Simply exit when all receipts have been processed.

## Permission Model

| Action | Permission Required |
|--------|---------------------|
| Navigate to MS Expense | ✅ No permission needed |
| View expense reports | ✅ No permission needed |
| Open expense report | ✅ No permission needed |
| Create new expense report | ✅ No permission needed |
| Add new expense item | ✅ No permission needed |
| Attach receipt | ✅ No permission needed |
| Access receipt folder | ✅ No permission needed |
| Use WorkIQ calendar | ✅ No permission needed |

## Error Handling

- **No Draft report found**: Create a new expense report named with current month
- **No .png files in receipt folder**: Inform user that no receipts were found to process
- **Cannot determine expense category**: Ask user to specify the category
- **WorkIQ calendar empty**: Generate description based on receipt details only, note that business purpose could not be determined from calendar
- **Receipt image unclear**: Request user to provide a clearer receipt or manual input
- **File upload permission denied**: Receipt files must be in the working directory. If upload fails, copy the file from `C:\BSExpense` to the working directory and retry.
- **Date format rejected**: The date field uses `type="date"` and requires `yyyy-MM-dd` format. If a different format was entered, clear the field and re-enter using the correct format.
