# Finora — Personal Finance & Analytics

**Understand your money. Own your future.**

Finora is a personal finance dashboard for recording income and expenses, planning budgets, reviewing spending patterns, and tracking recurring payments. This repository is being built incrementally with a focus on maintainability, accessibility, security, and responsive design.

## Product goals

- Transaction CRUD with categories, dates, payment methods, and notes
- Monthly income/expense summaries and balance overview
- Interactive category and cash-flow charts
- Monthly budgets with progress and overspending indicators
- Recurring payment tracking
- Search, filters, CSV export, and downloadable reports
- Authentication and private, user-scoped financial records

## Planned stack

- React + TypeScript + Vite
- Tailwind CSS (planned)
- Chart.js / react-chartjs-2 (planned)
- Supabase Auth + PostgreSQL + Row Level Security (planned)
- Vitest and React Testing Library (planned)
- Playwright end-to-end tests (planned)

## Current status

**Scaffold stage.** The first milestone establishes the frontend shell and design direction. Database integration, authentication, transactions, and analytics will be implemented in subsequent milestones. Do not enter real financial information until authentication and database access policies are implemented and reviewed.

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Roadmap

1. Responsive dashboard shell and reusable UI primitives
2. Transaction CRUD and category management
3. Supabase schema, authentication, and Row Level Security
4. Budgets, recurring payments, and analytics
5. CSV import/export and monthly reports
6. Unit, integration, and end-to-end tests
7. CI checks and production deployment

## Security principles

- Never commit secrets or local environment files.
- Use environment variables for public configuration.
- Enforce ownership in database policies; frontend filtering is not authorization.
- Validate and normalize user input on trusted boundaries.
- Avoid presenting demo values as real account data.

## License

License to be selected before public distribution.
