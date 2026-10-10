-- Run in Supabase SQL Editor to verify Finora's migration.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'transactions', 'budgets', 'recurring_transactions')
order by table_name;

-- Expected: row_security = true for all four tables.
select c.relname as table_name, c.relrowsecurity as row_level_security_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('profiles', 'transactions', 'budgets', 'recurring_transactions')
order by c.relname;

-- Inspect user ownership policies.
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'transactions', 'budgets', 'recurring_transactions')
order by tablename, policyname;

-- Expected: on_auth_user_created trigger exists on auth.users.
select trigger_name, event_object_schema, event_object_table, action_timing, event_manipulation
from information_schema.triggers
where trigger_schema = 'auth'
  and event_object_table = 'users'
  and trigger_name = 'on_auth_user_created';
