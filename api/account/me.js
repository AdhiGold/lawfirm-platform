import { db } from "hatchable";
export const access = "user";
export const methods = ["GET"];
export default async function(req, res) {
  const user = req.user;
  const result = await db.query("SELECT id, email, full_name, account_type, status FROM lawfirm_users WHERE id = $1", [user.id]);
  const memberships = await db.query("SELECT m.tenant_id, m.role, m.status, t.name AS tenant_name, t.slug AS tenant_slug, t.status AS tenant_status, s.plan_id, s.status AS subscription_status, s.trial_ends_at FROM lawfirm_memberships m JOIN lawfirm_tenants t ON t.id = m.tenant_id LEFT JOIN lawfirm_subscriptions s ON s.tenant_id = t.id WHERE m.user_id = $1 ORDER BY m.created_at ASC", [user.id]);
  const partner = await db.query("SELECT display_name, organization_name, partner_type, status, onboarding_complete FROM lawfirm_partner_profiles WHERE user_id = $1", [user.id]);
  return res.json({ user: result.rows[0] || null, memberships: memberships.rows, partner: partner.rows[0] || null });
}