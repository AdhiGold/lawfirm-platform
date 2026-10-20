CREATE TABLE IF NOT EXISTS lawfirm_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  account_type TEXT NOT NULL DEFAULT 'client' CHECK (account_type IN ('client','lawfirm_owner','lawfirm_staff','partner','platform_admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)