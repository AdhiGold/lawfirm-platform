INSERT INTO lawfirm_subscription_plans (id, name, monthly_price_idr, max_users, max_matters, features)
VALUES ('professional', 'Professional', 1499000, 10, 250, '{"client_portal":true,"reports":"advanced","automation":true}'::jsonb)
ON CONFLICT (id) DO NOTHING