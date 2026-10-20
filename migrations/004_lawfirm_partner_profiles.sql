CREATE TABLE IF NOT EXISTS lawfirm_partner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE REFERENCES lawfirm_users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  organization_name TEXT NOT NULL DEFAULT '',
  partner_type TEXT NOT NULL DEFAULT 'referral',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','active','rejected','suspended')),
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)