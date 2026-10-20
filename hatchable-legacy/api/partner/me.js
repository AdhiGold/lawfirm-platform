import { db } from "hatchable";
export const access = "user";
export const methods = ["GET"];
export default async function(req, res) {
  const user = req.user;
  const profile = await db.query("SELECT display_name, organization_name, partner_type, status, onboarding_complete, created_at FROM lawfirm_partner_profiles WHERE user_id = $1", [user.id]);
  if (!profile.rows.length) return res.status(404).json({ error: "No partner application found for this account." });
  return res.json({ partner: profile.rows[0] });
}