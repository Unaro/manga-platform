# Catalog Module: Implementation Checklist

## Phase 1: Database Setup ✅ READY

- [x] Database schema designed
- [x] Supabase migration created
- [ ] Run migration on local Supabase
- [ ] Verify all tables created
- [ ] Verify all indexes created
- [ ] Test RLS policies

## Phase 2: Repository Implementation (NEXT)

### Work Repository
- [ ] Create WorkRepositorySupabase class
- [ ] Implement findById
- [ ] Implement findBySlug
- [ ] Implement findByIdWithRelations
- [ ] Implement findMany (with filters)
- [ ] Implement search (full-text)
- [ ] Implement create
- [ ] Implement update
- [ ] Implement delete
- [ ] Implement existsBySlug
- [ ] Implement incrementViewCount
- [ ] Implement getStatistics
- [ ] Write unit tests

### Source Repository
- [ ] Create SourceRepositorySupabase class
- [ ] Implement all ISourceRepository methods
- [ ] Write unit tests

### Metadata Repositories
- [ ] Create AuthorRepositorySupabase
- [ ] Create GenreRepositorySupabase
- [ ] Create TagRepositorySupabase
- [ ] Implement findOrCreate logic
- [ ] Implement linkToWork logic
- [ ] Write unit tests

### Chapter Repository
- [ ] Create TranslatorRepositorySupabase
- [ ] Create ChapterRepositorySupabase
- [ ] Implement all methods
- [ ] Write unit tests

## Phase 3: API Routes

### Public Routes
- [ ] GET /api/catalog/works
- [ ] GET /api/catalog/works/search
- [ ] GET /api/catalog/works/[id]
- [ ] GET /api/catalog/works/[id]/chapters
- [ ] GET /api/catalog/sources
- [ ] GET /api/catalog/genres
- [ ] GET /api/catalog/tags

### Protected Routes (Moderator)
- [ ] POST /api/catalog/works
- [ ] PUT /api/catalog/works/[id]
- [ ] DELETE /api/catalog/works/[id]
- [ ] POST /api/catalog/works/import
- [ ] POST /api/catalog/works/[id]/sync

### Protected Routes (User)
- [ ] POST /api/catalog/works/[id]/rate
- [ ] GET /api/catalog/works/[id]/my-rating

## Phase 4: React Hooks

- [ ] useWorks (list with filters)
- [ ] useWork (single work)
- [ ] useWorkSearch (search)
- [ ] useCreateWork (moderator)
- [ ] useUpdateWork (moderator)
- [ ] useDeleteWork (admin)
- [ ] useImportWork (admin)
- [ ] useRateWork (user)
- [ ] useChapters (work chapters)

## Phase 5: UI Components

- [ ] WorkList component
- [ ] WorkCard component
- [ ] WorkDetails component
- [ ] WorkFilters component
- [ ] WorkSearch component
- [ ] ChapterList component
- [ ] RatingWidget component
- [ ] SourceBadges component

## Phase 6: Background Jobs

- [ ] Sync all works (daily)
- [ ] Sync chapters (every 6 hours)
- [ ] Refresh work_statistics (hourly)
- [ ] Cleanup old view records (weekly)

## Phase 7: Testing

### Unit Tests
- [ ] Schema validation tests
- [ ] Mapper tests
- [ ] Service tests (with mocked repos)
- [ ] Repository tests (with test DB)

### Integration Tests
- [ ] API route tests
- [ ] Database tests
- [ ] External API tests (Shikimori)

### E2E Tests
- [ ] User can browse works
- [ ] User can search works
- [ ] User can view work details
- [ ] User can rate work
- [ ] Moderator can create work
- [ ] Admin can import from Shikimori

## Phase 8: Optimization

- [ ] Add Redis caching
- [ ] Optimize database queries
- [ ] Add query result caching
- [ ] Setup CDN for images
- [ ] Add request rate limiting
- [ ] Monitor performance

## Phase 9: Documentation

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Component documentation (Storybook)
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] User guide

---

## Current Status: Phase 1 Complete ✅

Next Step: **Run Supabase migration and start implementing repositories**

    cd your-project
    supabase db reset
    supabase db push

Then start with WorkRepositorySupabase implementation.

