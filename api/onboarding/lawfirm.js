import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function(req, res) {
  const user = req.user;
  const name = String(req.body?.name || "").trim().slice(0, 140);
  const legalName = String(req.body?.legal_name || "").trim().slice(0, 180);
  const rawSlug = String(req.body?.slug || name).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  if (name.length < 2 || rawSlug.length < 3) return res.status(400).json({ error: "Enter a firm name with at least 2 characters." });
  const existing = await db.query("SELECT id FROM lawfirm_memberships WHERE user_id = $1 AND role IN ('owner','managing_partner') AND status = 'active' LIMIT 1", [user.id]);
  if (existing.rows.length) return res.status(409).json({ error: "This account already owns a law firm tenant." });
  const taken = await db.query("SELECT id FROM lawfirm_tenants WHERE slug = $1 LIMIT 1", [rawSlug]);
  if (taken.rows.length) return res.status(409).json({ error: "That workspace address is already in use. Try a different name." });
  await db.query("INSERT INTO lawfirm_users (id, email, full_name, account_type) VALUES ($1, lower($2), $3, 'lawfirm_owner') ON CONFLICT (id) DO UPDATE SET account_type = CASE WHEN lawfirm_users.account_type = 'platform_admin' THEN 'platform_admin' ELSE 'lawfirm_owner' END, updated_at = NOW()", [user.id, user.email, String(req.body?.full_name || user.name || "").trim().slice(0, 120)]);
  const created = await db.query("INSERT INTO lawfirm_tenants (name, slug, legal_name, created_by) VALUES ($1, $2, $3, $4) RETURNING id, name, slug, status", [name, rawSlug, legalName, user.id]);
  const tenant = created.rows[0];
  await db.query("INSERT INTO lawfirm_memberships (tenant_id, user_id, role) VALUES ($1, $2, 'owner')", [tenant.id, user.id]);
  await db.query("INSERT INTO lawfirm_subscriptions (tenant_id, plan_id, status) VALUES ($1, 'starter', 'trial')", [tenant.id]);
  await db.query("INSERT INTO lawfirm_audit_events (tenant_id, actor_user_id, event_type, entity_type, entity_id) VALUES ($1, $2, 'tenant.created', 'tenant', $1)", [tenant.id, user.id]);
  return res.status(201).json({ ok: true, tenant, plan: "starter", trial_days: 14 });
}