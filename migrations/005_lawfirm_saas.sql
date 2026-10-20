CREATE TABLE IF NOT EXISTS lawfirm_subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_price_idr BIGINT NOT NULL DEFAULT 0,
  max_users INTEGER NOT NULL DEFAULT 3,
  max_matters INTEGER NOT NULL DEFAULT 50,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
)