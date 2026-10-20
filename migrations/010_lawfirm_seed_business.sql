INSERT INTO lawfirm_subscription_plans (id, name, monthly_price_idr, max_users, max_matters, features)
VALUES ('business', 'Business', 3499000, 25, 1000, '{"client_portal":true,"reports":"advanced","automation":true,"partner_portal":true}'::jsonb)
ON CONFLICT (id) DO NOTHING