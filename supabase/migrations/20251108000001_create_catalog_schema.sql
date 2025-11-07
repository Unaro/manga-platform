-- ============================================================================
-- Catalog Module: Database Schema
-- Migration: 20251108000001_create_catalog_schema.sql
-- Description: Creates all tables for Catalog module
-- Dependencies: Requires 20251103_create_users.sql (users table)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- Table: works
-- Description: Central entity for manga/manhwa/manhua aggregation
-- ============================================================================

CREATE TABLE IF NOT EXISTS works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('manga', 'manhwa', 'manhua')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'hiatus', 'cancelled')),
    cover_url TEXT,
    alternative_titles JSONB DEFAULT '{"english": null, "romaji": null, "native": null}'::jsonb,
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for works
CREATE INDEX IF NOT EXISTS idx_works_type ON works(type);
CREATE INDEX IF NOT EXISTS idx_works_status ON works(status);
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_added_by ON works(added_by);
CREATE INDEX IF NOT EXISTS idx_works_title_trgm ON works USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_works_alternative_titles ON works USING gin(alternative_titles);

-- ============================================================================
-- Table: sources
-- Description: External sources (Shikimori, MangaDex, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    base_url VARCHAR(255) NOT NULL,
    api_url VARCHAR(255),
    type VARCHAR(20) NOT NULL CHECK (type IN ('api', 'scraper', 'manual')),
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_slug ON sources(slug);
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);

-- ============================================================================
-- Table: work_sources
-- Description: Many-to-many relation between works and sources with metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL,
    external_url TEXT NOT NULL,
    external_rating DECIMAL(3,2) CHECK (external_rating >= 0 AND external_rating <= 10),
    external_rating_count INT CHECK (external_rating_count >= 0),
    metadata JSONB DEFAULT '{}'::jsonb,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_id, source_id),
    UNIQUE(source_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_work_sources_work_id ON work_sources(work_id);
CREATE INDEX IF NOT EXISTS idx_work_sources_source_id ON work_sources(source_id);
CREATE INDEX IF NOT EXISTS idx_work_sources_external_id ON work_sources(source_id, external_id);
CREATE INDEX IF NOT EXISTS idx_work_sources_synced_at ON work_sources(synced_at);

-- ============================================================================
-- Table: translators
-- Description: Translation teams/groups linked to sources
-- ============================================================================

CREATE TABLE IF NOT EXISTS translators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    url TEXT,
    contacts JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_translators_source_id ON translators(source_id);
CREATE INDEX IF NOT EXISTS idx_translators_slug ON translators(slug);

-- ============================================================================
-- Table: chapters
-- Description: Chapters of works from different sources
-- ============================================================================

CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    translator_id UUID REFERENCES translators(id) ON DELETE SET NULL,
    title VARCHAR(255),
    number DECIMAL(6,2) NOT NULL CHECK (number >= 0),
    volume VARCHAR(50),
    external_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_id, source_id, number, translator_id)
);

CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_chapters_source_id ON chapters(source_id);
CREATE INDEX IF NOT EXISTS idx_chapters_translator_id ON chapters(translator_id);
CREATE INDEX IF NOT EXISTS idx_chapters_work_number ON chapters(work_id, number DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_published_at ON chapters(published_at DESC);

-- ============================================================================
-- Table: authors
-- Description: Authors/creators of works
-- ============================================================================

CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);
CREATE INDEX IF NOT EXISTS idx_authors_name_trgm ON authors USING gin(name gin_trgm_ops);

-- ============================================================================
-- Table: genres
-- Description: Genres for categorizing works
-- ============================================================================

CREATE TABLE IF NOT EXISTS genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_genres_slug ON genres(slug);

-- ============================================================================
-- Table: tags
-- Description: Tags for additional work metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('theme', 'content', 'format', 'demographic')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);

-- ============================================================================
-- Table: work_authors (many-to-many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_authors (
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,
    PRIMARY KEY (work_id, author_id)
);

CREATE INDEX IF NOT EXISTS idx_work_authors_work_id ON work_authors(work_id);
CREATE INDEX IF NOT EXISTS idx_work_authors_author_id ON work_authors(author_id);

-- ============================================================================
-- Table: work_genres (many-to-many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_genres (
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, genre_id)
);

CREATE INDEX IF NOT EXISTS idx_work_genres_work_id ON work_genres(work_id);
CREATE INDEX IF NOT EXISTS idx_work_genres_genre_id ON work_genres(genre_id);

-- ============================================================================
-- Table: work_tags (many-to-many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_tags (
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_work_tags_work_id ON work_tags(work_id);
CREATE INDEX IF NOT EXISTS idx_work_tags_tag_id ON work_tags(tag_id);

-- ============================================================================
-- Table: work_ratings
-- Description: User ratings for works
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_work_ratings_work_id ON work_ratings(work_id);
CREATE INDEX IF NOT EXISTS idx_work_ratings_user_id ON work_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_work_ratings_rating ON work_ratings(rating);

-- ============================================================================
-- Table: work_views
-- Description: View tracking for works (optional, for analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS work_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_views_work_id ON work_views(work_id);
CREATE INDEX IF NOT EXISTS idx_work_views_user_id ON work_views(user_id);
CREATE INDEX IF NOT EXISTS idx_work_views_viewed_at ON work_views(viewed_at DESC);

-- ============================================================================
-- Materialized View: work_statistics
-- Description: Aggregated statistics for works (refreshed periodically)
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS work_statistics AS
SELECT 
    w.id as work_id,
    COUNT(DISTINCT wv.id) as view_count,
    COUNT(DISTINCT wr.id) as rating_count,
    COALESCE(AVG(wr.rating), 0)::decimal(3,2) as average_rating,
    COUNT(DISTINCT ws.id) as source_count,
    COUNT(DISTINCT c.id) as chapter_count
FROM works w
LEFT JOIN work_views wv ON w.id = wv.work_id
LEFT JOIN work_ratings wr ON w.id = wr.work_id
LEFT JOIN work_sources ws ON w.id = ws.work_id
LEFT JOIN chapters c ON w.id = c.work_id
GROUP BY w.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_work_statistics_work_id 
    ON work_statistics(work_id);

-- ============================================================================
-- Function: update_updated_at_column
-- Description: Automatically update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if exist (for idempotency)
DROP TRIGGER IF EXISTS update_works_updated_at ON works;
DROP TRIGGER IF EXISTS update_work_ratings_updated_at ON work_ratings;

-- Create triggers
CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON works
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_ratings_updated_at
    BEFORE UPDATE ON work_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Function: refresh_work_statistics
-- Description: Refresh materialized view
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_work_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY work_statistics;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if exist (for idempotency)
DROP POLICY IF EXISTS "Anyone can read works" ON works;
DROP POLICY IF EXISTS "Authenticated users can create works" ON works;
DROP POLICY IF EXISTS "Users can update own works" ON works;
DROP POLICY IF EXISTS "Anyone can read ratings" ON work_ratings;
DROP POLICY IF EXISTS "Authenticated users can create ratings" ON work_ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON work_ratings;
DROP POLICY IF EXISTS "Users can delete own ratings" ON work_ratings;
DROP POLICY IF EXISTS "Anyone can read views" ON work_views;
DROP POLICY IF EXISTS "Anyone can insert views" ON work_views;

-- Create policies
CREATE POLICY "Anyone can read works"
    ON works FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create works"
    ON works FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Users can update own works"
    ON works FOR UPDATE
    TO authenticated
    USING (auth.uid() = added_by);

CREATE POLICY "Anyone can read ratings"
    ON work_ratings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create ratings"
    ON work_ratings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
    ON work_ratings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
    ON work_ratings FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read views"
    ON work_views FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert views"
    ON work_views FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- Seed Data: Initial sources
-- ============================================================================

INSERT INTO sources (name, slug, base_url, api_url, type, is_active, config) 
VALUES (
    'Shikimori', 
    'shikimori', 
    'https://shikimori.one', 
    'https://shikimori.one/api/graphql', 
    'api', 
    true, 
    '{"useGraphQL": true, "preferRussianNames": true, "rateLimitRps": 4, "rateLimitRpm": 80}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE works IS 'Central entity for manga/manhwa/manhua aggregation';
COMMENT ON TABLE sources IS 'External sources like Shikimori, MangaDex, etc.';
COMMENT ON TABLE work_sources IS 'Many-to-many relation with source-specific metadata';
COMMENT ON TABLE translators IS 'Translation teams/groups';
COMMENT ON TABLE chapters IS 'Chapters from various sources';
COMMENT ON TABLE work_ratings IS 'User ratings for works';
COMMENT ON MATERIALIZED VIEW work_statistics IS 'Aggregated statistics, refreshed periodically';

