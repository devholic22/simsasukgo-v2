# Architecture (Initial)

## Frontend

- Path: `frontend`
- Framework: Next.js (App Router)
- Language: TypeScript
- UI: Tailwind CSS
- PWA baseline: `next-pwa` configured in `next.config.ts` (service worker generated on production build)
- Purpose: mobile-first PWA shell with tabs for map/marker/settings

## Backend

- Path: `backend`
- Runtime stack: PostgreSQL + RLS + Edge Functions (Supabase-compatible layout)
- Functions:
  - `search-places`: Google Places proxy
  - `sync-open-status`: open status sync + logging
  - `optimize-route`: route ordering via Google Routes

## Shared Contracts

- Source: `packages/shared/src/index.ts`
- Covers: `Trip`, `Place`, `UserPreference`, `SyncLog`, and interface I/O contracts

## Security Baseline

- User data isolation via RLS
- Server-side API key usage in Edge Functions
- Client only uses public env values

## Current Scope Note

- SQL migration (`backend/migrations/20260227100000_init_schema.sql`) is intentionally scaffold-only at this stage.
- Executable DDL and policy SQL are deferred to implementation phase.
