import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function(req, res) {
  const user = req.user;
  const profile = await db.query("SELECT account_type FROM lawfirm_users WHERE id = $1", [user.id]);
  if (!profile.rows.length || profile.rows[0].account_type !== "platform_admin") return res.status(403).json({ error: "Only LawFirm Core administrators can review partner applications." });
  const partnerUserId = String(req.body?.user_id || "");
  const status = String(req.body?.status || "");
  if (!partnerUserId || !["approved","rejected","suspended"].includes(status)) return res.status(400).json({ error: "Provide a partner user ID and valid review status." });
  const result = await db.query("UPDATE lawfirm_partner_profiles SET status = $1, updated_at = NOW() WHERE user_id = $2 RETURNING user_id, display_name, status", [status, partnerUserId]);
  if (!result.rows.length) return res.status(404).json({ error: "Partner application not found." });
  await db.query("INSERT INTO lawfirm_audit_events (actor_user_id, event_type, entity_type, entity_id, metadata) VALUES ($1, 'partner.status_changed', 'partner_profile', $2, jsonb_build_object('status', $3))", [user.id, partnerUserId, status]);
  return res.json({ ok: true, partner: result.rows[0] });
}