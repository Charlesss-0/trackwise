# Trackwise

Take control of your financial future.

A personal finance tracking web application built with Next.js and Supabase. Track accounts, transactions, recurring bills, and debts across multiple currencies.

## Features

- **Dashboard** — Net worth, total assets, total debts, recent accounts & debts
- **Accounts** — Manage debit, credit, cash, and savings accounts with multi-currency support (USD/NIO)
- **Transactions** — Log income and expenses against accounts and categories
- **Categories** — Custom color-coded categories with icons (auto-provisioned for new users)
- **Recurring Expenses** — Track weekly, biweekly, monthly, and yearly recurring bills
- **Debts** — Track loans with creditor, balance, monthly payment, and due day (with progress bars)
- **Exchange Rates** — Auto-fetched USD→NIO rate with manual override option
- **Authentication** — Email/password auth via Supabase with SSR session handling
- **Responsive** — Desktop sidebar layout + mobile bottom tab navigation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, DaisyUI v5 |
| Icons | lucide-react |
| State | Zustand v5, TanStack React Query v5 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (SSR) |
| Testing | Jest v30, Testing Library, MSW |
| Linting | Biome |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm
- A Supabase project

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Copy the environment variables:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase project URL and anon key.

3. Push the database schema:

```bash
pnpm db:push
```

4. Generate TypeScript types:

```bash
pnpm db:gen:types
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Lint with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm db:push` | Push schema to Supabase |
| `pnpm db:gen:types` | Generate TypeScript types from Supabase |
| `pnpm db:migrate` | Push schema + generate types |

## Project Structure

```
src/
├── app/
│   ├── api/exchange-rate/   # Exchange rate API route
│   ├── auth/                # Login, signup, callback
│   └── dashboard/           # Dashboard layout and pages
├── components/
│   ├── accounts/            # Account form modal
│   ├── categories/          # Category form modal
│   ├── debts/               # Debt form modal
│   ├── layout/              # Sidebar, mobile nav
│   ├── providers/           # TanStack Query provider
│   ├── transactions/        # Transaction form modal
│   └── ui/                  # Shared UI components
├── hooks/                   # React Query hooks per entity
├── lib/                     # Supabase client/server helpers
├── stores/                  # Zustand stores (UI, exchange rate)
├── types/                   # Supabase-generated types + enums
└── utils/                   # Currency formatting, date utils
```

## Database

The app uses a PostgreSQL database on Supabase with Row-Level Security. Key tables:

- `accounts` — Bank accounts with balance, type, currency, credit limit
- `categories` — Transaction categories (color, icon, auto-seeded from templates)
- `transactions` — Income/expense entries linked to accounts and categories
- `debts` — Loans with creditor, balance, monthly payment, due day
- `exchange_rates` — USD→NIO rates (auto-fetched or manually set)

RLS policies ensure each user can only access their own data.
