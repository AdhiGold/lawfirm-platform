import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function(req, res) {
  const user = req.user;
  const fullName = String(req.body?.full_name || "").trim().slice(0, 120);
  const accountType = String(req.body?.account_type || "client");
  if (!fullName) return res.status(400).json({ error: "Enter your full name." });
  if (!["client", "lawfirm_owner", "partner"].includes(accountType)) return res.status(400).json({ error: "Unsupported account type." });
  await db.query("INSERT INTO lawfirm_users (id, email, full_name, account_type) VALUES ($1, lower($2), $3, $4) ON CONFLICT (id) DO UPDATE SET email = lower(EXCLUDED.email), full_name = EXCLUDED.full_name, account_type = CASE WHEN lawfirm_users.account_type = 'platform_admin' THEN 'platform_admin' ELSE EXCLUDED.account_type END, updated_at = NOW()", [user.id, user.email, fullName, accountType]);
  await db.query("INSERT INTO lawfirm_audit_events (actor_user_id, event_type, entity_type, entity_id) VALUES ($1, 'account.profile_created', 'user', $1)", [user.id]);
  return res.json({ ok: true, account_type: accountType });
}