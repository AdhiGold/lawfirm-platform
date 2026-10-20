CREATE TABLE IF NOT EXISTS lawfirm_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  legal_name TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT 'ID',
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','past_due','suspended','cancelled')),
  created_by TEXT NOT NULL REFERENCES lawfirm_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)