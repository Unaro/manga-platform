# Catalog Module: Architecture (Aggregator Model)

## Metadata
- Module: Catalog Service (Aggregator)
- Version: 1.0.0
- Created: 2025-11-08
- Status: Planning

---

## Архитектурный обзор

Модуль Catalog - это **агрегатор** произведений из различных источников (ne.senkuro.me, shikimori.org, mangadex.org и др.).
Произведение может быть представлено на нескольких источниках одновременно с разными переводчиками.

### Ключевые концепции
- **Work** - абстрактное произведение (манга/манхва/манхуа)
- **Source** - внешний источник (сайт с мангой)
- **WorkSource** - связь произведения с источником (external_id, external_url, rating)
- **Translator** - команда переводчиков на конкретном источнике
- **Chapter** - глава произведения со ссылкой на источник
- **Genre** и **Tag** - классификация произведений

### Принципы
- Type-first подход с Zod schemas
- Агрегация данных из множественных источников
- Синхронизация рейтингов с источников
- Event-driven взаимодействие между модулями

---

## Entity Relationship Diagram (Updated)

Обновленная структура данных с учетом агрегатора.

    erDiagram
        works ||--o{ work_sources : "available on"
        works ||--o{ work_authors : has
        works ||--o{ work_genres : has
        works ||--o{ work_tags : has
        works ||--o{ work_ratings : has
        works ||--o{ chapters : has
        
        sources ||--o{ work_sources : lists
        sources ||--o{ translators : hosts
        sources ||--o{ chapters : provides
        
        translators ||--o{ chapters : translates
        
        authors ||--o{ work_authors : belongs_to
        genres ||--o{ work_genres : belongs_to
        tags ||--o{ work_tags : belongs_to
        
        works {
            uuid id PK
            varchar title
            varchar slug UK
            text description
            varchar type
            varchar status
            varchar cover_url
            jsonb alternative_titles
            timestamp created_at
            timestamp updated_at
            uuid added_by FK
        }
        
        sources {
            uuid id PK
            varchar name
            varchar slug UK
            varchar base_url
            varchar api_url
            varchar type
            boolean is_active
            jsonb config
            timestamp created_at
        }
        
        work_sources {
            uuid id PK
            uuid work_id FK
            uuid source_id FK
            varchar external_id
            varchar external_url
            decimal external_rating
            int external_rating_count
            jsonb metadata
            timestamp synced_at
            timestamp created_at
        }
        
        translators {
            uuid id PK
            uuid source_id FK
            varchar name
            varchar slug
            varchar url
            jsonb contacts
            timestamp created_at
        }
        
        chapters {
            uuid id PK
            uuid work_id FK
            uuid source_id FK
            uuid translator_id FK
            varchar title
            decimal number
            varchar volume
            varchar external_url
            timestamp published_at
            timestamp created_at
        }
        
        authors {
            uuid id PK
            varchar name
            varchar slug UK
            text bio
            timestamp created_at
        }
        
        genres {
            uuid id PK
            varchar name UK
            varchar slug UK
            text description
            timestamp created_at
        }
        
        tags {
            uuid id PK
            varchar name UK
            varchar slug UK
            text description
            varchar category
            timestamp created_at
        }
        
        work_authors {
            uuid work_id FK
            uuid author_id FK
            int order_index
        }
        
        work_genres {
            uuid work_id FK
            uuid genre_id FK
        }
        
        work_tags {
            uuid work_id FK
            uuid tag_id FK
        }
        
        work_ratings {
            uuid id PK
            uuid work_id FK
            uuid user_id FK
            int rating
            timestamp created_at
            timestamp updated_at
        }

---

## Context Diagram (Updated)

Взаимодействие с внешними источниками.

    graph TB
        User[User]
        Admin[Admin]
        
        Catalog[Catalog Module<br/>Aggregator]
        
        Users[Users Module]
        EventBus[Event Bus]
        DB[(PostgreSQL)]
        Cache[(Redis Cache)]
        Queue[Bull Queue<br/>Background Jobs]
        
        ExtSource1[ne.senkuro.me<br/>External Source]
        ExtSource2[shikimori.org<br/>External Source]
        ExtSource3[mangadex.org<br/>External Source]
        
        User -->|Browse, Search| Catalog
        Admin -->|Add Source, Sync| Catalog
        
        Catalog -->|Check Auth| Users
        Catalog -->|Publish Events| EventBus
        Catalog -->|Read/Write| DB
        Catalog -->|Cache| Cache
        Catalog -->|Schedule Sync| Queue
        
        Queue -->|Fetch Data| ExtSource1
        Queue -->|Fetch Data| ExtSource2
        Queue -->|Fetch Data| ExtSource3
        
        ExtSource1 -->|Return JSON| Queue
        ExtSource2 -->|Return JSON| Queue
        ExtSource3 -->|Return JSON| Queue

---

## Component Diagram (Updated)

Компоненты модуля с учетом агрегации.

    graph TB
        subgraph "Catalog Module"
            API[API Routes]
            Schemas[Zod Schemas]
            Services[Services Layer]
            Repos[Repositories]
            Aggregator[Aggregator Service]
            SourceAdapters[Source Adapters]
            SyncJobs[Sync Background Jobs]
        end
        
        subgraph "External"
            EventBus[Event Bus]
            DB[(Database)]
            Cache[(Redis)]
            Queue[Bull Queue]
            ExtAPIs[External APIs]
        end
        
        API -->|Validate| Schemas
        API -->|Call| Services
        Services -->|Use| Repos
        Services -->|Aggregate| Aggregator
        Aggregator -->|Adapt| SourceAdapters
        SourceAdapters -->|Fetch| ExtAPIs
        SyncJobs -->|Schedule| Queue
        SyncJobs -->|Use| Aggregator
        Repos -->|Query| DB
        Services -->|Cache| Cache

---

## Sequence Diagram: Sync Work from Source

Синхронизация произведения с внешнего источника.

    sequenceDiagram
        actor Admin
        participant UI as Frontend
        participant API as API Route
        participant Service as WorkService
        participant Aggregator as AggregatorService
        participant Adapter as SourceAdapter
        participant ExtAPI as External API
        participant Repo as Repository
        participant DB as PostgreSQL
        participant Queue as Bull Queue
        participant EventBus as Event Bus
        
        Admin->>UI: Add work from source
        UI->>API: POST /api/catalog/works/import
        Note over UI,API: { sourceSlug: "shikimori",<br/> externalId: "12345" }
        
        API->>Service: importWorkFromSource(data)
        Service->>Aggregator: fetchWorkData(source, externalId)
        Aggregator->>Adapter: getWorkById(externalId)
        Adapter->>ExtAPI: GET /api/manga/12345
        ExtAPI-->>Adapter: Work data (JSON)
        Adapter-->>Aggregator: Normalized WorkData
        
        Aggregator->>Repo: findByExternalId(source, externalId)
        
        alt Work exists
            Aggregator->>Repo: updateWork(workId, data)
            Repo->>DB: UPDATE works
        else Work not exists
            Aggregator->>Repo: createWork(data)
            Repo->>DB: INSERT INTO works
            Repo->>DB: INSERT INTO work_sources
        end
        
        DB-->>Repo: Work saved
        Repo-->>Aggregator: Work entity
        
        Aggregator->>Queue: Schedule chapter sync
        Aggregator->>EventBus: Publish work_synced.v1
        
        Aggregator-->>Service: Work
        Service-->>API: 201 Created
        API-->>UI: Success
        UI-->>Admin: Work imported

---

## Sequence Diagram: Get Work with Aggregated Data

Получение произведения с данными из всех источников.

    sequenceDiagram
        actor User
        participant UI as Frontend
        participant API as API Route
        participant Service as WorkService
        participant Repo as WorkRepository
        participant Cache as Redis
        participant DB as PostgreSQL
        
        User->>UI: View work page
        UI->>API: GET /api/catalog/works/{workId}
        
        API->>Service: getWorkById(workId)
        Service->>Cache: Check cache
        
        alt Cache hit
            Cache-->>Service: Cached work data
        else Cache miss
            Service->>Repo: findById(workId)
            Repo->>DB: SELECT work with sources
            
            Note over DB: SELECT w.*, <br/>ws.external_url, ws.external_rating,<br/>s.name as source_name<br/>FROM works w<br/>LEFT JOIN work_sources ws<br/>LEFT JOIN sources s
            
            DB-->>Repo: Work + Sources[]
            Repo->>DB: SELECT chapters with translators
            DB-->>Repo: Chapters[]
            Repo-->>Service: Aggregated Work
            Service->>Cache: Cache (TTL: 10min)
        end
        
        Service-->>API: Work with all sources
        API-->>UI: 200 OK
        UI-->>User: Display work with sources

---

## Class Diagram (Updated)

Обновленные классы для агрегатора.

    classDiagram
        class Work {
            +id: string
            +title: string
            +slug: string
            +type: WorkType
            +status: WorkStatus
            +description: string | null
            +coverUrl: string | null
            +alternativeTitles: AlternativeTitles
            +createdAt: Date
            +updatedAt: Date
            +addedBy: string
        }
        
        class Source {
            +id: string
            +name: string
            +slug: string
            +baseUrl: string
            +apiUrl: string | null
            +type: SourceType
            +isActive: boolean
            +config: SourceConfig
            +createdAt: Date
        }
        
        class SourceType {
            <<enumeration>>
            scraper
            api
            manual
        }
        
        class WorkSource {
            +id: string
            +workId: string
            +sourceId: string
            +externalId: string
            +externalUrl: string
            +externalRating: number | null
            +externalRatingCount: number | null
            +metadata: object
            +syncedAt: Date
            +createdAt: Date
        }
        
        class Translator {
            +id: string
            +sourceId: string
            +name: string
            +slug: string
            +url: string | null
            +contacts: object
            +createdAt: Date
        }
        
        class Chapter {
            +id: string
            +workId: string
            +sourceId: string
            +translatorId: string
            +title: string | null
            +number: number
            +volume: string | null
            +externalUrl: string
            +publishedAt: Date | null
            +createdAt: Date
        }
        
        class Genre {
            +id: string
            +name: string
            +slug: string
            +description: string | null
            +createdAt: Date
        }
        
        class Tag {
            +id: string
            +name: string
            +slug: string
            +description: string | null
            +category: TagCategory
            +createdAt: Date
        }
        
        class TagCategory {
            <<enumeration>>
            theme
            content
            format
            demographic
        }
        
        class ISourceAdapter {
            <<interface>>
            +fetchWork(externalId: string) Promise~WorkData~
            +fetchChapters(externalId: string) Promise~ChapterData[]~
            +search(query: string) Promise~SearchResult[]~
        }
        
        class ShikimoriAdapter {
            -baseUrl: string
            -apiKey: string
            +fetchWork(externalId: string) Promise~WorkData~
            +fetchChapters(externalId: string) Promise~ChapterData[]~
            +search(query: string) Promise~SearchResult[]~
            -normalizeData(raw: any) WorkData
        }
        
        class AggregatorService {
            -adapters: Map~string, ISourceAdapter~
            -workRepository: IWorkRepository
            +syncWorkFromSource(source: string, externalId: string) Promise~Work~
            +aggregateWorkData(workId: string) Promise~AggregatedWork~
            +syncAllWorks() Promise~void~
        }
        
        Work "1" -- "*" WorkSource
        Source "1" -- "*" WorkSource
        Source "1" -- "*" Translator
        Source "1" -- "*" Chapter
        Work "1" -- "*" Chapter
        Translator "1" -- "*" Chapter
        Work "*" -- "*" Genre
        Work "*" -- "*" Tag
        
        ISourceAdapter <|.. ShikimoriAdapter
        AggregatorService --> ISourceAdapter
        AggregatorService --> Work

---

## Database Schema (Updated)

### works (unchanged)
    CREATE TABLE works (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        type VARCHAR(20) NOT NULL CHECK (type IN ('manga', 'manhwa', 'manhua')),
        status VARCHAR(20) NOT NULL CHECK (status IN ('ongoing', 'completed', 'hiatus')),
        cover_url TEXT,
        alternative_titles JSONB DEFAULT '{}',
        added_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX idx_works_type ON works(type);
    CREATE INDEX idx_works_status ON works(status);
    CREATE INDEX idx_works_slug ON works(slug);

### sources (NEW)
    CREATE TABLE sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        base_url VARCHAR(255) NOT NULL,
        api_url VARCHAR(255),
        type VARCHAR(20) NOT NULL CHECK (type IN ('scraper', 'api', 'manual')),
        is_active BOOLEAN DEFAULT TRUE,
        config JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX idx_sources_slug ON sources(slug);
    CREATE INDEX idx_sources_active ON sources(is_active);

### work_sources (NEW - many-to-many)
    CREATE TABLE work_sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
        source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        external_id VARCHAR(255) NOT NULL,
        external_url TEXT NOT NULL,
        external_rating DECIMAL(3,2),
        external_rating_count INT,
        metadata JSONB DEFAULT '{}',
        synced_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(work_id, source_id),
        UNIQUE(source_id, external_id)
    );
    
    CREATE INDEX idx_work_sources_work ON work_sources(work_id);
    CREATE INDEX idx_work_sources_source ON work_sources(source_id);
    CREATE INDEX idx_work_sources_external ON work_sources(source_id, external_id);

### translators (NEW)
    CREATE TABLE translators (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        url TEXT,
        contacts JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(source_id, slug)
    );
    
    CREATE INDEX idx_translators_source ON translators(source_id);
    CREATE INDEX idx_translators_slug ON translators(slug);

### chapters (UPDATED)
    CREATE TABLE chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
        source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        translator_id UUID REFERENCES translators(id) ON DELETE SET NULL,
        title VARCHAR(255),
        number DECIMAL(6,2) NOT NULL,
        volume VARCHAR(50),
        external_url TEXT NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(work_id, source_id, number, translator_id)
    );
    
    CREATE INDEX idx_chapters_work ON chapters(work_id);
    CREATE INDEX idx_chapters_source ON chapters(source_id);
    CREATE INDEX idx_chapters_translator ON chapters(translator_id);
    CREATE INDEX idx_chapters_number ON chapters(work_id, number DESC);

### genres (unchanged)
    CREATE TABLE genres (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );

### tags (NEW)
    CREATE TABLE tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        category VARCHAR(50) NOT NULL CHECK (category IN ('theme', 'content', 'format', 'demographic')),
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX idx_tags_category ON tags(category);

### work_genres (unchanged)
    CREATE TABLE work_genres (
        work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
        genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (work_id, genre_id)
    );

### work_tags (NEW)
    CREATE TABLE work_tags (
        work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (work_id, tag_id)
    );

---

## Source Adapters Architecture

Адаптеры для различных источников.

### Interface
    interface ISourceAdapter {
        fetchWork(externalId: string): Promise<WorkData>;
        fetchChapters(externalId: string): Promise<ChapterData[]>;
        search(query: string): Promise<SearchResult[]>;
        getRating(externalId: string): Promise<RatingData>;
    }

### Implementations
- ShikimoriAdapter (Shikimori API)
- MangaDexAdapter (MangaDex API)
- NeSenkuroAdapter (Web scraper for ne.senkuro.me)
- CustomAdapter (Manual data entry)

### Adapter Registration
    const adapters = new Map<string, ISourceAdapter>();
    adapters.set('shikimori', new ShikimoriAdapter(config));
    adapters.set('mangadex', new MangaDexAdapter(config));
    adapters.set('ne-senkuro', new NeSenkuroAdapter(config));

---

## Background Sync Jobs

### Job Types

#### sync-work
Синхронизация одного произведения с источника.

    interface SyncWorkJob {
        type: 'sync-work';
        payload: {
            workId: string;
            sourceId: string;
            externalId: string;
        };
    }

#### sync-all-works
Синхронизация всех произведений (cron: daily).

    interface SyncAllWorksJob {
        type: 'sync-all-works';
        payload: {
            sourceIds?: string[];
        };
    }

#### sync-chapters
Синхронизация глав произведения.

    interface SyncChaptersJob {
        type: 'sync-chapters';
        payload: {
            workId: string;
            sourceId: string;
        };
    }

### Schedule
- sync-all-works: Daily at 03:00 AM
- sync-chapters: Every 6 hours
- sync-ratings: Every 1 hour (active works)

---

## API Endpoints (Updated)

### Public Endpoints
- GET /api/catalog/works - List works (with source filters)
- GET /api/catalog/works/search - Search works
- GET /api/catalog/works/[id] - Get work with all sources
- GET /api/catalog/works/[id]/chapters - Get chapters (filtered by source/translator)
- GET /api/catalog/sources - List sources
- GET /api/catalog/translators - List translators

### Protected Endpoints (Admin)
- POST /api/catalog/works/import - Import work from source
- POST /api/catalog/sources - Add new source
- PUT /api/catalog/sources/[id] - Update source
- POST /api/catalog/works/[id]/sync - Trigger manual sync

### Protected Endpoints (User)
- POST /api/catalog/works/[id]/rate - Rate work
- GET /api/catalog/works/[id]/my-rating - Get user's rating

---

## Events (Updated)

### catalog.work_synced.v1
    {
      type: "catalog.work_synced.v1",
      timestamp: Date,
      eventId: string,
      payload: {
        workId: string,
        sourceId: string,
        externalId: string,
        changedFields: string[]
      }
    }

### catalog.chapters_synced.v1
    {
      type: "catalog.chapters_synced.v1",
      timestamp: Date,
      eventId: string,
      payload: {
        workId: string,
        sourceId: string,
        newChaptersCount: number,
        totalChapters: number
      }
    }

