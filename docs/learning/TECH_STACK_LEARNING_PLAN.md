# 📚 План обучения: Manga Platform Tech Stack

Структурированный план изучения технологий, паттернов и алгоритмов для поддержки и развития проекта.

---

## 🎯 Критический Уровень (Без этого не понять код)

### 1. TypeScript (Advanced)
**Время:** 2-3 недели  
**Приоритет:** КРИТИЧЕСКИЙ

#### Темы
- Type System Deep Dive
  - Generics и Type Constraints
  - Conditional Types `T extends U ? X : Y`
  - Mapped Types `{ [K in keyof T]: ... }`
  - Template Literal Types
  - `infer` keyword
  
- Utility Types
  - `Partial<T>`, `Required<T>`, `Pick<T, K>`
  - `Omit<T, K>`, `Record<K, V>`
  - `ReturnType<T>`, `Parameters<T>`
  
- Advanced Patterns
  - Discriminated Unions
  - Type Guards (custom guards)
  - `exactOptionalPropertyTypes` (ключевой для проекта)
  - `strictNullChecks`

#### Ресурсы
- 📖 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- 📖 [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- 🎥 [Matt Pocock - Advanced TypeScript](https://www.youtube.com/c/MattPocockCoding)
- 📝 Практика: типизировать API responses из существующего кода

---

### 2. Zod (Runtime Validation)
**Время:** 1 неделя  
**Приоритет:** КРИТИЧЕСКИЙ

#### Темы
- Schema Definition
  - Primitives: `z.string()`, `z.number()`, `z.boolean()`
  - Objects: `z.object()`, nested objects
  - Arrays: `z.array()`, tuples
  - Unions: `z.union()`, `z.discriminatedUnion()`
  
- Advanced Features
  - `.transform()` для БД ↔ Domain маппинга
  - `.refine()` для custom валидаций
  - `.safeParse()` vs `.parse()`
  - Error handling и formatting
  
- Type Inference
  - `z.infer<typeof Schema>`
  - Связь с TypeScript types

#### Ресурсы
- 📖 [Zod Documentation](https://zod.dev/)
- 📝 Практика: написать схемы для User/Work entities

---

### 3. Next.js 16 (App Router + React 19)
**Время:** 3-4 недели  
**Приоритет:** КРИТИЧЕСКИЙ

#### Темы
- App Router Architecture
  - File-based routing
  - Layouts, Pages, Loading, Error
  - Async Server Components
  - **Async params** (новое в Next.js 15+)
  
- Rendering Strategies
  - Server Components vs Client Components
  - `use client` directive
  - Streaming and Suspense
  - PPR (Partial Prerendering)
  
- Data Fetching
  - Server-side `fetch()` с кешированием
  - `revalidatePath()`, `revalidateTag()`
  - Parallel Data Fetching
  
- API Routes (Route Handlers)
  - `route.ts` файлы
  - GET/POST/PUT/DELETE handlers
  - Request/Response objects

#### Ресурсы
- 📖 [Next.js 16 Documentation](https://nextjs.org/docs)
- 📖 [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- 🎥 [Vercel Next.js Conf](https://www.youtube.com/c/VercelHQ)
- 📝 Практика: создать простую CRUD страницу

---

### 4. React 19 (Новые Концепции)
**Время:** 2 недели  
**Приоритет:** ВЫСОКИЙ

#### Темы
- Hooks Deep Dive
  - `useState`, `useEffect`, `useContext`
  - `useMemo`, `useCallback`, `useRef`
  - `useTransition`, `useDeferredValue`
  - Custom Hooks (создание собственных)
  
- React 19 Features
  - `use()` hook (async)
  - Server Actions
  - `useFormStatus()`, `useFormState()`
  
- Patterns
  - Compound Components
  - Render Props
  - HOCs (Higher-Order Components)

#### Ресурсы
- 📖 [React Documentation](https://react.dev/)
- 📖 [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- 🎥 [Jack Herrington - React Patterns](https://www.youtube.com/c/JackHerrington)

---

## 🔧 Базовый Уровень (Основы работы приложения)

### 5. Supabase (Backend as a Service)
**Время:** 2 недели  
**Приоритет:** ВЫСОКИЙ

#### Темы
- PostgreSQL через Supabase
  - Schema design
  - Relationships (FK, indexes)
  - RLS (Row Level Security)
  - Migrations
  
- Supabase Client
  - Type-safe queries
  - `.select()`, `.insert()`, `.update()`, `.delete()`
  - Joins и nested selects
  - Real-time subscriptions
  
- Authentication
  - User management
  - JWT tokens
  - Sessions

#### Ресурсы
- 📖 [Supabase Documentation](https://supabase.com/docs)
- 📖 [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- 📝 Практика: создать таблицу с RLS policies

---

### 6. TanStack Query (Server State)
**Время:** 1-2 недели  
**Приоритет:** ВЫСОКИЙ

#### Темы
- Query Fundamentals
  - `useQuery` hook
  - Query keys
  - Caching strategy
  - `staleTime`, `gcTime`
  
- Mutations
  - `useMutation` hook
  - Optimistic updates
  - `onSuccess`, `onError` callbacks
  
- Advanced
  - Infinite queries
  - Prefetching
  - Query invalidation

#### Ресурсы
- 📖 [TanStack Query Docs](https://tanstack.com/query/latest)
- 🎥 [TKDodo Blog](https://tkdodo.eu/blog/practical-react-query)

---

### 7. Zustand (Client State)
**Время:** 1 неделя  
**Приоритет:** СРЕДНИЙ

#### Темы
- Store Creation
  - `create<T>()()` API (v5)
  - Slices pattern
  - Devtools middleware
  
- Selectors
  - Selective subscriptions
  - Performance optimization
  
- Persistence
  - `persist` middleware
  - localStorage sync

#### Ресурсы
- 📖 [Zustand Documentation](https://github.com/pmndrs/zustand)
- 📝 Практика: создать UI store (modals, theme)

---

## 🏗️ Архитектурные Паттерны

### 8. Design Patterns
**Время:** 3-4 недели  
**Приоритет:** ВЫСОКИЙ

#### Используемые в проекте

**Repository Pattern**
- Инкапсуляция доступа к данным
- Абстракция от конкретной БД
- Interface segregation

**Service Layer Pattern**
- Бизнес-логика отдельно от контроллеров
- Композиция репозиториев
- Transaction boundaries

**Adapter Pattern**
- `ShikimoriAdapter` - внешние API
- Трансформация внешних данных
- Rate limiting, retry logic

**Factory Pattern**
- Создание сложных объектов
- Dependency Injection

**Observer Pattern** (Event Bus)
- Event-driven architecture
- Decoupling модулей
- Pub/Sub система

#### Ресурсы
- 📖 [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- 📖 [Patterns.dev](https://www.patterns.dev/)
- 📝 Практика: реализовать простой Event Bus

---

### 9. Clean Architecture / Domain-Driven Design
**Время:** 2-3 недели  
**Приоритет:** СРЕДНИЙ

#### Темы
- Layered Architecture
  - Presentation → Application → Domain → Infrastructure
  - Dependency Rule (зависимости идут внутрь)
  
- DDD Concepts
  - Entities vs Value Objects
  - Aggregates
  - Domain Events
  - Repositories (domain-level)

#### Ресурсы
- 📖 [Clean Architecture - Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- 📖 [Domain-Driven Design Distilled](https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon/dp/0134434420)

---

### 10. SOLID Principles
**Время:** 1 неделя  
**Приоритет:** СРЕДНИЙ

#### Темы
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

#### Применение в проекте
- Interfaces для repositories
- Service composition
- Dependency injection

#### Ресурсы
- 📖 [SOLID Principles Explained](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

---

## 🚀 Продвинутый Уровень

### 11. Event-Driven Architecture
**Время:** 2 недели  
**Приоритет:** СРЕДНИЙ (для будущего)

#### Темы
- Event Bus Implementation
- Event Sourcing (базовые концепции)
- CQRS (Command Query Responsibility Segregation)
- Idempotency
- Event versioning

#### Ресурсы
- 📖 [Martin Fowler - Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- 📖 [Microsoft - CQRS Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

---

### 12. GraphQL (Shikimori Integration)
**Время:** 1-2 недели  
**Приоритет:** НИЗКИЙ (уже реализовано)

#### Темы
- Queries vs Mutations
- Schema definition
- Resolvers
- N+1 problem и DataLoader

#### Ресурсы
- 📖 [GraphQL Official Docs](https://graphql.org/learn/)
- 📖 [How to GraphQL](https://www.howtographql.com/)

---

### 13. Микросервисная Архитектура
**Время:** 4-6 недель  
**Приоритет:** НИЗКИЙ (Phase 3)

#### Темы
- Service Boundaries
- API Gateway pattern
- Service Discovery
- Circuit Breaker
- Distributed Transactions (Saga pattern)
- Message Queues (RabbitMQ/Kafka)

#### Ресурсы
- 📖 [Microservices.io](https://microservices.io/patterns/index.html)
- 📖 [Building Microservices - Sam Newman](https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1492034029)

---

## 🔐 Security & Performance

### 14. Web Security Basics
**Время:** 1-2 недели  
**Приоритет:** ВЫСОКИЙ

#### Темы
- OWASP Top 10
- XSS, CSRF, SQL Injection
- Authentication vs Authorization
- JWT security
- Rate Limiting
- Input Validation (Zod)
- CSP Headers

#### Ресурсы
- 📖 [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- 📖 [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

### 15. Performance Optimization
**Время:** 2 недели  
**Приоритет:** СРЕДНИЙ

#### Темы
- React Performance
  - `React.memo`, `useMemo`, `useCallback`
  - Code splitting / Lazy loading
  - Virtualization (react-window)
  
- Database Optimization
  - Indexes strategy
  - Query optimization
  - N+1 queries prevention
  
- Caching Strategies
  - Client-side (TanStack Query)
  - Server-side (Next.js cache)
  - CDN caching

#### Ресурсы
- 📖 [Web.dev Performance](https://web.dev/performance/)
- 📖 [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

## 🧪 Testing & DevOps

### 16. Testing Strategy
**Время:** 2-3 недели  
**Приоритет:** СРЕДНИЙ

#### Темы
- Unit Testing (Jest)
- Integration Testing
- E2E Testing (Playwright/Cypress)
- Test-Driven Development (TDD)
- Mocking (MSW для API mocks)

#### Ресурсы
- 📖 [Testing Library Docs](https://testing-library.com/)
- 📖 [Kent C. Dodds - Testing](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

### 17. CI/CD & Deployment
**Время:** 1-2 недели  
**Приоритет:** НИЗКИЙ

#### Темы
- GitHub Actions
- Docker basics
- Vercel deployment
- Environment variables management
- Database migrations automation

#### Ресурсы
- 📖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 📖 [Docker Get Started](https://docs.docker.com/get-started/)

---

## 📊 Алгоритмы и Структуры Данных

### 18. Применяемые Алгоритмы в Проекте
**Время:** 2-3 недели  
**Приоритет:** НИЗКИЙ

#### Используется
- **Debounce/Throttle** - search input
- **Pagination** (offset-based, cursor-based)
- **Sorting algorithms** - work listing
- **Graph algorithms** - recommendation system (будущее)
- **Tree structures** - comment threads
- **Caching algorithms** (LRU) - TanStack Query

#### Ресурсы
- 📖 [JavaScript Algorithms](https://github.com/trekhleb/javascript-algorithms)
- 📖 [Algorithms Visualized](https://visualgo.net/)

---

## 🗓️ Рекомендуемый План Изучения (12 недель)

### Недели 1-3: TypeScript + Zod + Next.js Basics
- TypeScript Advanced (2 недели)
- Zod (1 неделя)
- Параллельно: Next.js документация (чтение)

### Недели 4-6: React + Next.js Deep Dive
- React 19 Hooks (1 неделя)
- Next.js 16 App Router (2 недели)
- Практика: создать простой CRUD

### Недели 7-9: State Management + Data Layer
- Supabase (1.5 недели)
- TanStack Query (1 неделя)
- Zustand (0.5 недели)

### Недели 10-12: Architecture + Patterns
- Design Patterns (2 недели)
- Clean Architecture (1 неделя)
- Практика: рефакторинг существующего кода

### Ongoing: Security + Performance
- Изучать параллельно с основными темами
- Code review существующего кода

---

## 📝 Практические Задания

### 1. Создать Mini-Module
Реализовать простой модуль (например, Notifications):
- Zod схемы
- Repository (in-memory или Supabase)
- Service layer
- API routes
- React hooks
- UI components

### 2. Рефакторинг Catalog Module
- Добавить unit tests
- Оптимизировать queries
- Добавить error boundaries
- Улучшить accessibility

### 3. Implement Feature Flag System
- Zod schema для config
- Zustand store для клиента
- API route для server-side
- React hook для usage

---

## 🎯 Метрики Прогресса

### Проверь себя
- [ ] Могу объяснить `exactOptionalPropertyTypes`
- [ ] Понимаю разницу Server/Client Components
- [ ] Знаю когда использовать Zustand vs TanStack Query
- [ ] Могу написать type-safe Supabase query
- [ ] Понимаю Repository Pattern
- [ ] Могу создать Zod schema с трансформацией
- [ ] Знаю как работает caching в Next.js 16
- [ ] Понимаю Event-driven architecture

---

## 🔗 Дополнительные Ресурсы

### Блоги
- [Kent C. Dodds](https://kentcdodds.com/blog)
- [TkDodo - React Query](https://tkdodo.eu/blog)
- [Josh Comeau - React](https://www.joshwcomeau.com/)
- [Lee Robinson - Next.js](https://leerob.io/)

### YouTube Channels
- [Jack Herrington](https://www.youtube.com/c/JackHerrington)
- [Theo - t3.gg](https://www.youtube.com/c/TheoBrowne1017)
- [Web Dev Simplified](https://www.youtube.com/c/WebDevSimplified)

### Communities
- [Next.js Discord](https://nextjs.org/discord)
- [Reactiflux Discord](https://www.reactiflux.com/)
- [r/reactjs](https://www.reddit.com/r/reactjs/)

---

## ✅ Next Steps

1. **Начни с TypeScript** - это фундамент всего проекта
2. **Практикуй на реальном коде** - читай и модифицируй Catalog module
3. **Задавай вопросы** - разбирай непонятные паттерны
4. **Создавай тесты** - лучший способ понять код
5. **Документируй изученное** - веди личные заметки

Удачи в изучении! 🚀