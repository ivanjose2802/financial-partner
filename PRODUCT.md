# Product Definition — My Financial Partner

> Personal finance app built around a cash flow-based system.
> Goal: help users anticipate financial situations before they happen.

---

## Core Financial Model

The application revolves around **transactions**. Every transaction belongs to a user and contributes to their monthly cash flow.

### Transaction Type
- `income` — money received (salary, freelance, bonus, refund)
- `expense` — money spent or owed (rent, utilities, subscriptions, groceries)

### Recurrence
- `one_time` — single occurrence
- `recurring` — repeats automatically each month without manual re-entry

### Status
- `completed` — already happened
- `scheduled` — expected in the future (upcoming)

Scheduled transactions are critical — they allow users to see projected balance before money actually moves.

---

## Transaction Fields (MVP)

| Field | Type | Notes |
|---|---|---|
| `type` | `income` \| `expense` | Required |
| `recurrence` | `one_time` \| `recurring` | Required |
| `status` | `completed` \| `scheduled` | Required |
| `amount` | decimal | Always positive; type determines sign |
| `description` | string | User-facing label |
| `category` | enum | Expenses only; see list below |
| `date` | date | When it happened or is expected |

---

## Expense Categories (predefined, not user-customizable in MVP)

`housing` | `utilities` | `internet` | `transportation` | `food_groceries` | `restaurants` | `entertainment` | `health` | `insurance` | `family_support` | `education` | `debt_payments` | `subscriptions` | `savings` | `other`

Income categories are out of scope for MVP.

---

## Monthly Scope System

The app operates around a **monthly financial scope**. The current month is the default active context.

Each month calculates:
- Total completed income
- Total completed expenses
- Upcoming scheduled income
- Upcoming scheduled expenses
- Current available balance (completed income − completed expenses)
- Projected end-of-month balance (includes scheduled transactions)

Recurring transactions auto-appear in every relevant month — no manual re-entry required.

---

## Dashboard Goals

The dashboard communicates financial health at a glance:
- Is the user currently in a positive or negative balance?
- Are they at risk of going negative before the month ends?
- Where is most money going (by category)?
- What upcoming transactions are coming?

The app should feel **proactive**, not just historical.

---

## MVP Scope

### In scope
- Auth (register/login, JWT)
- Transactions: create / edit / delete, with all fields above
- Recurring transactions with auto-propagation
- Scheduled (upcoming) transactions
- Predefined expense categories
- Dashboard: current balance, projected balance, recent transactions, basic charts, monthly overview

### Explicitly out of scope for MVP
- Custom user-defined categories
- Income categories
- AI-generated recommendations
- Advanced analytics / spending reports
- Multi-currency
- File attachments on transactions
- Budget system (post-MVP)

---

## Subscription Model (post-MVP)

- Free plan: core transaction management
- Premium plan (Stripe): advanced reporting, AI insights, category analytics, monthly trends

---

## Long-Term Vision

Evolve into an intelligent personal finance assistant:
- Forecast financial risk before it happens
- Identify spending patterns and suggest improvements
- Visualize long-term financial health
- Provide actionable AI-powered recommendations
