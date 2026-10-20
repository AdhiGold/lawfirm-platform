# LawFirm — Legal Practice Ecosystem

Dark navy and gold multi-tenant legal practice SaaS prototype.

## Structure

- `public/` — client UI for dashboard, login, registration, styles, and browser application.
- `api/` — account, onboarding, partner, and platform-admin endpoints.
- `migrations/` — SQL schema and SaaS plan seed migrations.
- `hatchable.toml` — Hatchable application/auth configuration.

## Current scope

This repository contains the LawFirm prototype and SaaS foundation. Operational matter, client, billing, and document records still use demonstration data in the frontend and are not yet production-ready tenant-scoped CRUD workflows.

## Pricing seed plans

- Starter — IDR 499,000/month
- Professional — IDR 1,499,000/month
- Business — IDR 3,499,000/month

Do not commit production secrets or credentials.