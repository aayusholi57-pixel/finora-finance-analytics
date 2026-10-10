# Connect Finora to Supabase

Use a **dedicated Supabase project for Finora**. Do not reuse a project that belongs to another app unless you intentionally want to share its database.

## 1. Create the project

1. Open https://supabase.com/dashboard and create a new project named `finora-finance-analytics`.
2. Save the database password securely; it is not needed in the browser app.
3. Wait for the database to finish provisioning.

## 2. Apply the database migration

1. Open the Finora project's **SQL Editor**.
2. Open `supabase/migrations/202610100001_initial_schema.sql` in this repository.
3. Copy the entire SQL file into a new SQL Editor query and run it.
4. Confirm that `profiles`, `transactions`, `budgets`, and `recurring_transactions` exist under the `public` schema.

The migration enables Row Level Security and adds ownership policies to each user-owned table. Do not disable these policies.

## 3. Configure the frontend

1. In Supabase, open **Project Settings → API** (or the project's API keys page).
2. Copy the Project URL and the public anon/publishable key.
3. In the repository root, create a local `.env` file by copying `.env.example`.
4. Fill in the values:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

Only use the public anon/publishable key in the browser. **Never** use a `service_role` or secret key in a `VITE_*` variable or commit real credentials.

## 4. Start the app

```bash
npm install
npm run dev
```

Restart the Vite dev server after changing `.env`.

## Important current limitation

The SQL schema and optional browser client are committed, but the existing dashboard still uses demo data. Authentication, live transaction CRUD, and database-backed analytics are not wired into the UI yet. Do not treat the dashboard as a real finance tracker until those steps are implemented and tested.
