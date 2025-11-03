# Правила разработки (RULES)

## Принципы
- **Последовательные модули**: каждый модуль доводим до production-ready, затем следующий.
- **Независимость**: интеграция модулей только через события и контрактные интерфейсы.
- **Type-first**: сначала типы и контракты (API/Events), затем реализации.
- **Строгая типизация**: `strict` + `exactOptionalPropertyTypes` + zero-any.
- **Слабая связанность, высокая когезия**: каждый модуль решает свои юзкейсы локально.

## Стандарты кодовой базы
### TypeScript
- Запрещён `any`. Используйте дженерики и тип-гварды.
- Условное добавление опциональных полей при маппинге БД ↔ домен.
- Никаких инфраструктурных типов в домене (чистые типы).

### Структура модулей
```
src/modules/<module>/
  ├─ types/         # доменные типы и контракты событий
  ├─ repositories/  # интерфейсы + реализации (DB/Cache)
  ├─ services/      # бизнес-логика, транзакции, инварианты
  ├─ api/           # Zod-схемы, handlers, ответы/ошибки
  └─ events/        # подписчики/эмиттеры, регистрация
```

### Event-driven
- События версионируются: `type: 'reading.activity.v1'` (или payload.version).
- Обработчики идемпотентны (idempotency key + таблица дедупликации при необходимости).
- Ошибки обработчиков не ломают основной use-case (best-effort).

### API и валидация
- Валидация входа Zod-схемами, статусы: 400/401/403/404/409/422/500.
- Унифицированный ответ `ApiResult<T>`.
- Не возвращать внутренние детали ошибок клиенту.

### Доступ к данным
- Репозитории — единственная точка доступа к БД.
- Мапперы БД ↔ домен — отдельные функции с контролем optional/nullable.
- Индексы и ограничения соответствуют ER-схеме.

### Безопасность
- JWT, email-верификация, rate limiting входа.
- RBAC проверки в сервисах и эндпоинтах.
- Очистка пользовательского ввода, XSS/CSRF защита.
- Аудит экономических операций.

### Тестирование
- Unit: сервисы/репозитории с моками EventBus/DB.
- Contract: API по Zod-схемам (позитивные и негативные кейсы).
- Integration: модуль целиком без внешних зависимостей (заглушки).

### Feature Flags
- Включение/выключение модулей и фич без redeploy UI.
- Серверные проверки флагов обязательны.

### Definition of Done (для модуля)
- Типы/контракты стабильны и покрыты тестами.
- Endpoint’ы с валидацией/ошибками и документацией типов.
- Инварианты сервиса и транзакции реализованы, репозитории покрыты тестами.
- Подписчики событий подключены и идемпотентны.
- Healthcheck, фичефлаги, алерты критических ошибок.

## Порядок разработки модулей
### Фаза 1 — Основа
1) Users — регистрация/вход, email-верификация, профиль, роли
2) Catalog — CRUD произведений, жанры/теги, поиск/фильтры
3) Reading Tracker — закладки, прогресс, история

### Фаза 2 — Источники данных
4) Content Parser — плагинный парсер, админ-конфиг, планировщик, антиспам
5) Extension Bridge — API для расширений/мобилок, прием активности

### Фаза 3 — Игровые механики
6) Game Engine — единые правила наград, уровни/опыт, валюта, антиабуз
7) Cards & Inventory — карточки, паки, вероятности, инвентарь (выдача через Engine)
8) Achievements — определения/условия/награды

### Фаза 4 — Социальные функции
9) Trading & Marketplace — P2P/маркет/аукционы, комиссии
10) Notifications — email/push/in-app, предпочтения
11) Analytics — сбор событий и отчеты

## События (контракты)
```ts
// reading.activity
interface ReadingActivityEvent {
  type: 'reading.activity';
  userId: string;
  workId: string;
  chapterNumber: number;
  timeSpent: number;
  completionPercentage: number;
  source: 'web' | 'extension' | 'mobile';
}

// work.discovered
interface WorkDiscoveredEvent {
  type: 'work.discovered';
  workData: WorkMetadata;
  source: string;
  parserId: string;
}

// engine.reward.issued
interface RewardIssuedEvent {
  type: 'engine.reward.issued';
  userId: string;
  rewardType: 'coins' | 'gems' | 'exp' | 'card';
  amount?: number;
  cardId?: string;
  reason: string;
}

// achievement.unlocked
interface AchievementUnlockedEvent {
  type: 'achievement.unlocked';
  userId: string;
  achievementId: string;
  rewards: Reward[];
}
```

## Инфраструктура
- Dev: Vercel + Supabase (Postgres/Storage/Auth), .env.example → .env
- Prod: при росте — VPS + Docker Compose (Postgres, Redis, MinIO), мониторинг
- Миграции в репозитории, атомарные и обратимые
- Healthchecks per-module, статус-страница и алерты
