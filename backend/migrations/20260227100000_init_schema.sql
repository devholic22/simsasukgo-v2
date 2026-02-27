-- Simsasukgo v2 initial schema scaffold
-- NOTE: Structure only. Actual SQL implementation is intentionally deferred.

-- Planned entities (from PLAN.md):
-- 1) trips
-- 2) places
-- 3) user_preferences
-- 4) sync_logs

-- Planned policies:
-- - RLS by authenticated user ownership
-- - service role access for sync log write paths

-- Planned constraints:
-- - unique(trip_id, google_place_id)
-- - radius preset domain: 100/200/300/500/1000

-- TODO(implementation phase):
-- - define enum types
-- - create tables and indexes
-- - add trigger for updated_at
-- - add RLS + policy statements
