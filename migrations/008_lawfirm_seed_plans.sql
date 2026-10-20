INSERT INTO lawfirm_subscription_plans (id, name, monthly_price_idr, max_users, max_matters, features)
VALUES ('starter', 'Starter', 499000, 3, 50, '{"client_portal":true,"reports":"basic"}'::jsonb)
ON CONFLICT (id) DO NOTHING