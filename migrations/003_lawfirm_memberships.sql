CREATE TABLE IF NOT EXISTS lawfirm_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES lawfirm_tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES lawfirm_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','managing_partner','partner','lawyer','associate','admin','finance','client')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
)