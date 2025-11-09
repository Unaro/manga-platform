# Catalog Module

Модуль управления каталогом произведений (манга, манхва, манхуа) с агрегацией данных из внешних источников (Shikimori, MangaDex и др.).

## Версия

- Version: 1.0.0
- Status: Design Phase
- Created: 2025-11-08

---

## Полная структура модуля

    src/modules/catalog/
    |
    |-- schemas/                         # Zod схемы и TypeScript типы
    |   |-- work.schema.ts               # Work, WorkType, WorkStatus
    |   |-- source.schema.ts             # Source, WorkSource
    |   |-- translator.schema.ts         # Translator
    |   |-- chapter.schema.ts            # Chapter
    |   |-- metadata.schema.ts           # Author, Genre, Tag
    |   |-- dto.schema.ts                # API Input/Output DTOs
    |   |-- external.schema.ts           # External API data types
    |   |-- mappers.ts                   # Data transformation utils
    |   |-- index.ts                     # Exports
    |   └-- README.md
    |
    |-- repositories/                    # Data access layer
    |   |-- work.repository.interface.ts
    |   |-- source.repository.interface.ts
    |   |-- metadata.repository.interface.ts
    |   |-- chapter.repository.interface.ts
    |   |-- index.ts
    |   └-- README.md
    |
    |-- services/                        # Business logic
    |   |-- work.service.ts              # Core work operations
    |   |-- aggregator.service.ts        # External source aggregation
    |   |-- shikimori.adapter.ts         # Shikimori API adapter
    |   |-- index.ts
    |   └-- README.md
    |
    |-- events/                          # Event system
    |   |-- types.ts                     # Event types
    |   |-- event-bus.interface.ts       # Event Bus interface
    |   |-- event-publisher.ts           # Event publisher
    |   |-- in-memory-event-bus.ts       # In-memory implementation
    |   |-- index.ts
    |   └-- README.md
    |
    |-- hooks/                           # React hooks (future)
    |   └-- README.md
    |
    └-- README.md                        # This file

---

## Основные сущности

### Work (Произведение)
Абстрактное произведение в системе.

Fields:
- id: UUID
- title: string
- slug: string
- type: manga | manhwa | manhua
- status: upcoming | ongoing | completed | hiatus | cancelled
- description: text
- coverUrl: string
- alternativeTitles: { english, romaji, native }

### Source (Источник)
Внешний сайт-агрегатор (Shikimori, MangaDex).

Fields:
- id: UUID
- name: string
- slug: string
- baseUrl: string
- apiUrl: string
- type: api | scraper | manual
- isActive: boolean
- config: jsonb

### WorkSource (Связь Work-Source)
Many-to-many связь с метаданными.

Fields:
- id: UUID
- workId: UUID
- sourceId: UUID
- externalId: string
- externalUrl: string
- externalRating: decimal
- externalRatingCount: int
- metadata: jsonb
- syncedAt: timestamp

### Translator (Переводчик)
Команда переводчиков на источнике.

Fields:
- id: UUID
- sourceId: UUID
- name: string
- slug: string
- url: string
- contacts: jsonb

### Chapter (Глава)
Глава произведения со ссылкой на источник.

Fields:
- id: UUID
- workId: UUID
- sourceId: UUID
- translatorId: UUID
- title: string
- number: decimal
- volume: string
- externalUrl: string
- publishedAt: timestamp

### Author, Genre, Tag
Метаданные для классификации произведений.

---

## Архитектура

### Слои приложения

1. Schemas Layer (Zod + TypeScript)
   - Валидация данных
   - Type inference
   - API contracts

2. Repository Layer (Interfaces)
   - Data access abstraction
   - CRUD operations
   - Query builders

3. Service Layer (Business Logic)
   - WorkService - управление произведениями
   - AggregatorService - импорт из источников
   - ShikimoriAdapter - интеграция с Shikimori

4. Event Layer (Event-Driven)
   - CatalogEventPublisher
   - Event Bus (in-memory / Redis / Kafka)
   - Inter-module communication

5. API Layer (Next.js App Router) - future
   - Route handlers
   - Middleware
   - Error handling

6. Hooks Layer (React) - future
   - useWorks
   - useWork
   - useSearch

### Dependency Flow

    API Routes
        |
        v
    Services (inject repositories, event publisher)
        |
        v
    Repositories (inject Supabase client)
        |
        v
    Database (PostgreSQL via Supabase)

### Event Flow

    Service
        |
        v
    Event Publisher
        |
        v
    Event Bus
        |
        +---> Reading Tracker (subscriber)
        +---> Game Economy (subscriber)
        +---> Analytics (subscriber)

---

## API Endpoints (Planned)

### Public

    GET    /api/catalog/works                  # List works
    GET    /api/catalog/works/search           # Search works
    GET    /api/catalog/works/[id]             # Get work details
    GET    /api/catalog/works/[id]/chapters    # Get chapters
    GET    /api/catalog/sources                # List sources
    GET    /api/catalog/genres                 # List genres
    GET    /api/catalog/tags                   # List tags

### Protected (Moderator/Admin)

    POST   /api/catalog/works                  # Create work
    PUT    /api/catalog/works/[id]             # Update work
    DELETE /api/catalog/works/[id]             # Delete work
    POST   /api/catalog/works/import           # Import from source
    POST   /api/catalog/works/[id]/sync        # Sync work
    POST   /api/catalog/sources                # Add source

### Protected (User)

    POST   /api/catalog/works/[id]/rate        # Rate work
    GET    /api/catalog/works/[id]/my-rating   # Get user rating

---

## Events

### catalog.work_created.v1
Payload: { workId, title, type, slug, addedBy }

Subscribers:
- Reading Tracker: initialize progress
- Game Economy: award bonus

### catalog.work_synced.v1
Payload: { workId, sourceId, externalId, changedFields }

Subscribers:
- Analytics: track syncs

### catalog.chapters_synced.v1
Payload: { workId, sourceId, newChaptersCount, totalChapters }

Subscribers:
- Reading Tracker: update available chapters
- Users: notify subscribers

### catalog.work_rated.v1
Payload: { workId, userId, rating, previousRating, newAverageRating }

Subscribers:
- Game Economy: award experience

### catalog.work_viewed.v1
Payload: { workId, userId, ipAddress, userAgent }

Subscribers:
- Analytics: track views

---

## External Integrations

### Shikimori API
- Endpoint: https://shikimori.one/api/graphql
- Rate Limit: 4 rps, 80 rpm
- Auth: User-Agent header required
- Adapter: ShikimoriAdapter

Features:
- Fetch manga by ID
- Search manga
- Get genres, publishers
- Stats (scores, statuses)

### Future: MangaDex API
- Endpoint: https://api.mangadex.org
- Rate Limit: TBD
- Auth: OAuth2
- Adapter: MangaDexAdapter (planned)

### Future: MyAnimeList API
- Endpoint: https://api.myanimelist.net/v2
- Rate Limit: TBD
- Auth: OAuth2
- Adapter: MALAdapter (planned)

---

## Database Schema

### Tables

- works
- sources
- work_sources (many-to-many)
- translators
- chapters
- authors
- genres
- tags
- work_authors (many-to-many)
- work_genres (many-to-many)
- work_tags (many-to-many)
- work_ratings
- work_views (optional)

### Indexes

- works: (type, status, created_at, slug)
- work_sources: (work_id, source_id, external_id)
- chapters: (work_id, source_id, number, translator_id)
- Full-text search on works.title

---

## Technology Stack

### Backend
- Next.js 16 App Router
- TypeScript 5.6.3 (strict mode)
- Zod 3.23.8
- Supabase Client 2.x

### State Management
- TanStack Query v5 (server state)
- Zustand (client state)

### Database
- PostgreSQL (via Supabase)
- Redis (caching, rate limiting)

### Testing
- Jest (unit tests)
- Playwright (E2E tests)
- MSW (API mocking)

---

## Development Workflow

### 1. Create Feature Branch

    git checkout -b feature/catalog-work-list

### 2. Implement Repository

    class WorkRepositorySupabase implements IWorkRepository {
      // Implementation
    }

### 3. Implement Service (with events)

    class WorkService {
      async createWork(input, userId) {
        const work = await this.repository.create(...);
        await this.eventPublisher.publishWorkCreated(...);
        return work;
      }
    }

### 4. Create API Route

    export async function GET(request: Request) {
      const service = new WorkService(...);
      const works = await service.getWorks(query);
      return Response.json(works);
    }

### 5. Create React Hook

    export function useWorks(query: GetWorksQuery) {
      return useQuery({
        queryKey: ['works', query],
        queryFn: () => fetchWorks(query)
      });
    }

### 6. Create UI Component

    export function WorkList() {
      const { data } = useWorks({ page: 1, limit: 20 });
      return <div>{/* Render works */}</div>;
    }

### 7. Write Tests

    describe('WorkService', () => {
      it('should create work and publish event', async () => {
        // Test implementation
      });
    });

---

## Dependencies

### From Other Modules

- Users Module: userId, role check

### For Other Modules

- Reading Tracker: work data, chapters
- Game Economy: rating events

---

## Performance Considerations

### Caching Strategy

- List queries: Redis (TTL: 5 min)
- Work details: Redis (TTL: 10 min)
- Search results: Redis (TTL: 1 min)
- Client-side: TanStack Query

### Database Optimization

- Indexes on frequently queried fields
- Materialized view for statistics
- Pagination for large result sets
- Eager loading for relations

### Rate Limiting

- Public endpoints: 100 req/min per IP
- Search: 30 req/min per IP
- Protected endpoints: 1000 req/min per user

---

## Security

### Authentication

- JWT validation via middleware
- Role-based access control (RBAC)

### Authorization

- User: rate works, view details
- Moderator: create/update works
- Admin: delete works, manage sources

### Input Validation

- Zod schemas on all inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize descriptions)

### Rate Limiting

- Per-IP for public endpoints
- Per-user for protected endpoints
- Per-source for external API calls

---

## Monitoring

### Metrics

- catalog.works.list.latency (p50, p95, p99)
- catalog.works.search.latency
- catalog.works.create.success_rate
- catalog.sync.success_rate
- catalog.cache.hit_rate

### Logging

- All API requests (correlation-id)
- Event publications
- External API calls
- Errors with stack traces

### Alerting

- Error rate > 5% for 5 minutes
- p95 latency > 500ms for 10 minutes
- Sync failures > 10% per hour

---

## Next Steps

### Phase 1: Core Implementation
1. Create Supabase migrations
2. Implement repositories
3. Implement services
4. Create API routes
5. Write unit tests

### Phase 2: UI Integration
1. Create React hooks
2. Create UI components
3. Implement pagination
4. Implement filters
5. Write E2E tests

### Phase 3: External Integrations
1. Complete Shikimori adapter
2. Implement sync jobs
3. Add MangaDex adapter
4. Add MyAnimeList adapter

### Phase 4: Optimization
1. Implement caching
2. Add materialized views
3. Optimize queries
4. Load testing

---

## Contributing

See main project WORKFLOW.md for contribution guidelines.

---

## License

Internal project - not for public distribution.

