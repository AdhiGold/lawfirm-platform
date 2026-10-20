import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function(req, res) {
  const user = req.user;
  const displayName = String(req.body?.display_name || "").trim().slice(0, 120);
  const organizationName = String(req.body?.organization_name || "").trim().slice(0, 160);
  const partnerType = String(req.body?.partner_type || "referral");
  if (!displayName) return res.status(400).json({ error: "Enter your name." });
  if (!["referral","independent_lawyer","law_firm","legal_consultant","business_partner"].includes(partnerType)) return res.status(400).json({ error: "Unsupported partner type." });
  const prior = await db.query("SELECT status FROM lawfirm_partner_profiles WHERE user_id = $1", [user.id]);
  if (prior.rows.length) return res.status(409).json({ error: "A partner application already exists for this account." });
  await db.query("INSERT INTO lawfirm_users (id, email, full_name, account_type) VALUES ($1, lower($2), $3, 'partner') ON CONFLICT (id) DO UPDATE SET account_type = CASE WHEN lawfirm_users.account_type = 'platform_admin' THEN 'platform_admin' ELSE 'partner' END, full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE lawfirm_users.full_name END, updated_at = NOW()", [user.id, user.email, displayName]);
  const result = await db.query("INSERT INTO lawfirm_partner_profiles (user_id, display_name, organization_name, partner_type, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING status, partner_type, display_name, organization_name", [user.id, displayName, organizationName, partnerType]);
  await db.query("INSERT INTO lawfirm_audit_events (actor_user_id, event_type, entity_type, entity_id) VALUES ($1, 'partner.application_submitted', 'partner_profile', $1)", [user.id]);
  return res.status(201).json({ ok: true, partner: result.rows[0], message: "Application received. LawFirm Core must review and approve the partner account before partner benefits are activated." });
}