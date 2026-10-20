import { db } from "hatchable";
export const access = "user";
export const methods = ["GET"];
export default async function(req, res) {
  const user = req.user;
  const profile = await db.query("SELECT account_type FROM lawfirm_users WHERE id = $1", [user.id]);
  if (!profile.rows.length || profile.rows[0].account_type !== "platform_admin") return res.status(403).json({ error: "LawFirm Core is restricted to authorized platform administrators." });
  const tenants = await db.query("SELECT t.id, t.name, t.slug, t.status, t.created_at, s.plan_id, s.status AS subscription_status FROM lawfirm_tenants t LEFT JOIN lawfirm_subscriptions s ON s.tenant_id = t.id ORDER BY t.created_at DESC LIMIT 100");
  const partners = await db.query("SELECT p.user_id, p.display_name, p.organization_name, p.partner_type, p.status, p.created_at, u.email FROM lawfirm_partner_profiles p JOIN lawfirm_users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 100");
  const plans = await db.query("SELECT id, name, monthly_price_idr, max_users, max_matters, is_active FROM lawfirm_subscription_plans ORDER BY monthly_price_idr ASC");
  return res.json({ tenants: tenants.rows, partners: partners.rows, plans: plans.rows });
}