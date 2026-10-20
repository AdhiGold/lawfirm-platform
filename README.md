# LawFirm — Interactive Demo

This branch is the **demo-only** version of LawFirm, prepared for a static Vercel deployment similar to the MAKNA demo workflow.

## Demo behavior

- Static HTML, CSS, and browser JavaScript.
- Demo login and registration with role selection.
- Dashboard, matters, clients, calendar, tasks, documents, billing, reports, partner and LawFirm Core screens use sample data.
- Demo profile and small changes may be kept in the current browser via `localStorage`.
- No production database, real email verification, payment processing, or production authentication is configured.
- Do not enter real client, matter, or privileged legal data.

## Vercel setup

- Framework preset: Other
- Root directory: repository root (`./`)
- Build command: leave empty
- Output directory: `public`
- Install command: leave empty; there are no runtime dependencies
- Validate this branch as the demo deployment. Do not point production to `main` unless explicitly intended.

`vercel.json` enables clean URLs so `/login` and `/register` map to their static HTML pages.

## Important

The original Hatchable implementation remains on `main`. This branch is intentionally a separate demo path and is not a production-ready legal SaaS backend.
