# Catalog Module

Модуль управления каталогом произведений (манга, манхва, манхуа) с агрегацией данных из внешних источников.

## Структура

    src/modules/catalog/
    |-- schemas/           # Zod схемы и TypeScript типы
    |   |-- work.schema.ts
    |   |-- source.schema.ts
    |   |-- translator.schema.ts
    |   |-- chapter.schema.ts
    |   |-- metadata.schema.ts
    |   |-- dto.schema.ts
    |   |-- external.schema.ts
    |   └-- index.ts
    |-- repositories/      # Репозитории для работы с БД
    |-- services/          # Бизнес-логика
    |-- hooks/             # React hooks для UI
    |-- events/            # События модуля
    └-- README.md

## Основные сущности

### Work (Произведение)
Абстрактное произведение (манга/манхва/манхуа) в системе.

### Source (Источник)
Внешний сайт-источник данных (Shikimori, MangaDex и др.).

### WorkSource (Связь)
Many-to-many связь между Work и Source с метаданными (external_id, external_url, rating).

### Translator (Переводчик)
Команда переводчиков, привязанная к источнику.

### Chapter (Глава)
Глава произведения со ссылкой на источник и переводчика.

### Author, Genre, Tag
Метаданные для классификации произведений.

## Зависимости

### От других модулей
- Users Module: проверка роли, userId для addedBy

### Для других модулей
- Reading Tracker: события work_created, work_updated
- Game Economy: событие work_rated для начисления опыта

## События

### catalog.work_created.v1
Публикуется при создании нового произведения.

### catalog.work_synced.v1
Публикуется при синхронизации с внешним источником.

### catalog.chapters_synced.v1
Публикуется при синхронизации глав произведения.

### catalog.work_rated.v1
Публикуется при оценке произведения пользователем.

## API Endpoints

### Public
- GET /api/catalog/works - Список произведений
- GET /api/catalog/works/search - Поиск произведений
- GET /api/catalog/works/[id] - Детали произведения
- GET /api/catalog/works/[id]/chapters - Главы произведения

### Protected (Moderator/Admin)
- POST /api/catalog/works - Создать произведение
- PUT /api/catalog/works/[id] - Обновить произведение
- POST /api/catalog/works/import - Импорт из источника
- POST /api/catalog/works/[id]/sync - Синхронизация

### Protected (User)
- POST /api/catalog/works/[id]/rate - Оценить произведение

## Feature Flags

    FEATURE_CATALOG_ENABLED=true
    FEATURE_CATALOG_SHIKIMORI_SYNC=true
    FEATURE_CATALOG_AUTO_SYNC=true

