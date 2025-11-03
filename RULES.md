# Правила разработки (RULES)

Обновлено: 03 Ноября 2025

## Ключевые дополнения
- Ветвление по модулям: каждая реализация модуля ведётся в отдельной ветке `feature/module-<name>` с PR в `main` после чек-листа DoD.
- Порядок итераций обновлён: добавлены Content Parser и Extension Bridge до Game Engine.
- Game Economy переименован и расширен до Game Engine: единая точка выдачи наград, уровней и карточек.

## Ветвление и PR-процесс
- Основные ветки: `main` (защищённая), `develop` (опционально для долгих интеграций).
- Фича-ветки:
  - `feature/module-users`, `feature/module-catalog`, `feature/module-reading-tracker`
  - `feature/module-content-parser`, `feature/module-extension-bridge`
  - `feature/module-game-engine`, `feature/module-cards`, `feature/module-achievements`
  - `feature/module-trading`, `feature/module-notifications`, `feature/module-analytics`
  - Подзадачи: `feature/module-<name>-<task>`
- Коммиты: `feat(module-<name>): ...`, `fix(module-<name>): ...`, `refactor(module-<name>): ...`
- PR: заголовок `[module-<name>] Краткое описание`; описание — фичи, контракты (API/Events), миграции, риски, обратная совместимость.

## Definition of Done (модуль)
- Типы и контракты (API/Events) стабильны, покрыты тестами.
- Endpoints валидируются Zod; корректные коды ошибок; унифицированные ответы.
- Инварианты реализованы, транзакции атомарны; репозитории покрыты тестами.
- Обработчики событий идемпотентны (idempotency key) и зарегистрированы.
- Healthcheck и фичефлаг модуля добавлены; документация обновлена.

## Архитектурные принципы
- Type-first, strict TS, `exactOptionalPropertyTypes`, zero-any.
- Слабая связанность: только события и контрактные интерфейсы между модулями.
- Graceful degradation: падение зависимостей не ломает основной юзкейс.
- Репозитории как единственная точка доступа к данным; чистые доменные типы.

## Порядок разработки (итерации)
### Фаза 1 — Основа
1) Users — регистрация/вход, email-верификация, профиль, роли
2) Catalog — CRUD, жанры/теги, поиск/фильтры
3) Reading Tracker — закладки, прогресс, история

### Фаза 2 — Источники данных
4) Content Parser — плагинный парсер, админ-конфиг, планировщик, антиспам
5) Extension Bridge — API для расширений/мобилок, приём активности

### Фаза 3 — Игровые механики
6) Game Engine — правила наград, уровни/опыт, валюта, антиабуз
7) Cards & Inventory — карточки, паки, вероятности, инвентарь (выдача через Engine)
8) Achievements — определения/условия/награды

### Фаза 4 — Социальные функции
9) Trading & Marketplace — P2P/маркет/аукционы, комиссии
10) Notifications — email/push/in-app, предпочтения
11) Analytics — сбор событий и отчёты

## События (контракты)
```ts
interface ReadingActivityEvent {
  type: 'reading.activity';
  userId: string; workId: string; chapterNumber: number;
  timeSpent: number; completionPercentage: number;
  source: 'web' | 'extension' | 'mobile';
}
interface WorkDiscoveredEvent { type: 'work.discovered'; workData: WorkMetadata; source: string; parserId: string; }
interface RewardIssuedEvent { type: 'engine.reward.issued'; userId: string; rewardType: 'coins' | 'gems' | 'exp' | 'card'; amount?: number; cardId?: string; reason: string; }
interface AchievementUnlockedEvent { type: 'achievement.unlocked'; userId: string; achievementId: string; rewards: Reward[]; }
```

## Стандарты модулей и кода
- Структура: `types/`, `repositories/`, `services/`, `api/`, `events/`.
- Валидация: Zod; статусы 400/401/403/404/409/422/500; `ApiResult<T>`.
- Доступ к данным: репозитории + мапперы БД↔домен (контроль optional/nullable).
- Безопасность: JWT, email-верификация, rate limiting; RBAC; sanitation; XSS/CSRF защита; аудит экономики.
- Тесты: unit/contract/integration; CI проверяет typecheck+lint+test.

## Инфраструктура
- Dev: Vercel + Supabase (Postgres/Storage/Auth); `.env.example` → `.env`.
- Prod: VPS + Docker Compose (Postgres, Redis, MinIO) при росте; мониторинг (Grafana/Prometheus), логи (Loki/ELK).
- Миграции: в репозитории, атомарные и обратимые. Healthchecks per-module, статус-страница и алерты.
