# LawFirm: Hatchable → GitHub + Vercel migration

## Current baseline

- Git repository: `AdhiGold/lawfirm-platform`, default branch `main`.
- Current implementation was authored for Hatchable.
- Login and registration call `window.hatchable.auth` for email-code authentication.
- API handlers import `db` from `hatchable` and use `export const access = "user"`.
- Operational matter, client, task, calendar, document, and billing screens still contain sample/demo data.
- The current database contains the LawFirm account, tenant, membership, partner, subscription, and audit foundations. Do not assume that its contents are already migrated to a new provider.

## Migration safety rules

1. Keep `main` as the current baseline until the replacement passes acceptance tests.
2. Perform migration work on `migration/vercel-foundation` and later through pull requests.
3. Do not point production traffic at Vercel while API handlers still import `hatchable`.
4. Never commit provider credentials, database URLs, service-role keys, or email-provider secrets.
5. Do not copy production legal/client data into preview environments without an approved migration and access policy.
6. Keep the existing Hatchable deployment available during verification and rollback.

## Compatibility findings

### Frontend
The UI is mostly plain HTML, CSS, and browser JavaScript and can be served by Vercel. The dashboard is not fully production-backed: multiple modules still use sample data or demo actions.

### Authentication
`public/login.html`, `public/register.html`, and `public/app.js` use `window.hatchable.auth`. Replace this with an explicit authentication adapter and server-side session validation before routing real users to Vercel. Preserve email verification, session persistence, sign-out, and safe redirect handling.

### API/runtime
Handlers in `api/` import `db` from `hatchable` and declare Hatchable-specific access metadata. These are not drop-in Vercel Functions. Replace them with Vercel-compatible Node.js handlers and an explicit authentication guard. Every protected endpoint must verify identity server-side.

### Database
The existing SQL migrations are PostgreSQL-shaped and provide a useful starting point. Choose a managed PostgreSQL provider and decide whether authentication is separate or provided by the same platform. Recreate schema and indexes in a new environment, then migrate data only after a tested export/import, reconciliation, and rollback plan. Do not point the new app at the old database without checking identity mappings and authorization behavior.

## Proposed target architecture

- GitHub: source of truth, feature branches, pull requests, review, and CI.
- Vercel: preview deployments for branches/PRs and production deployment from `main) only after cutover approval.
- Authentication: provider must support verified email, server-validated sessions, secure cookies, and account recovery.
- Database: managed PostgreSQL, connection pooling compatible with serverless functions, and tenant isolation enforced in server-side queries (plus row-level security where appropriate).
- Secrets: Vercel Environment Variables, separate Development/Preview/Production values; no secrets in Git.

## Required environment configuration (names are placeholders, not configured)

- `DATABASE_URL` — pooled PostgreSQL connection string.
- Authentication-provider URL/public key and server-side secret, named according to the provider selected.
- Email delivery credentials if not provided by the authentication service.

Do not create fake values. Configure secrets in the hosting dashboard only after provider selection.

## Acceptance gates before production

- [ ] Email verification, login, session persistence, logout, and recovery pass in Preview.
- [ ] Unauthenticated requests to every protected endpoint return 401.
- [ ] A client cannot access lawyer, partner, or platform-admin functions.
- [ ] Law-firm A cannot read or mutate law-firm B's records.
- [ ] Only a provisioned platform administrator can use LawFirm Core.
- [ ] Tenant creation, membership assignment, partner application, and approval are tested.
- [ ] Migration row counts and key relationships reconcile.
- [ ] Operational modules use tenant-scoped database APIs rather than demo arrays.
- [ ] Build and automated checks pass; rollback to Hatchable is rehearsed.
- [ ] Vercel production deployment is enabled only after explicit cutover approval.

## Next decision needed

Select the authentication/database provider. No provider is assumed or configured by this branch. Once selected, implement the provider adapter and replace the Hatchable-specific API runtime before creating the Vercel project.
