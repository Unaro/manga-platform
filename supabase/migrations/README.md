# Supabase Migrations - Catalog Module

## Migration Files

### 20251108000001_create_catalog_schema.sql
Creates complete database schema for Catalog module.

Includes:
- 12 tables (works, sources, work_sources, translators, chapters, authors, genres, tags, many-to-many, ratings, views)
- 30+ indexes (including GIN indexes for full-text search)
- 1 materialized view (work_statistics)
- 2 functions (update_updated_at, refresh_work_statistics)
- 4 triggers (auto-update timestamps)
- RLS policies (row-level security)
- Seed data (Shikimori source)

## Running Migrations

### Local Development

    supabase db reset
    supabase db push

### Production

    supabase db push --linked

## Checking Migration Status

    supabase migration list

## Creating New Migration

    supabase migration new migration_name

## Rollback (if needed)

Supabase doesn't support automatic rollback. Create a new migration to undo changes.

Example:

    supabase migration new rollback_feature_x

