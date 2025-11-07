# Catalog Services

Сервисы модуля Catalog - бизнес-логика и интеграции с внешними API.

## Структура

    services/
    |-- work.service.ts           # Основная логика работы с произведениями
    |-- aggregator.service.ts     # Агрегация данных из внешних источников
    |-- shikimori.adapter.ts      # Адаптер для Shikimori API
    |-- index.ts                  # Exports
    └-- README.md

## Сервисы

### WorkService
Основной сервис для работы с произведениями.

Методы:
- getWorks() - список с фильтрами и пагинацией
- getWorkById() - получить по ID с полной информацией
- searchWorks() - full-text поиск
- createWork() - создать произведение (модератор)
- updateWork() - обновить произведение (модератор)
- deleteWork() - удалить произведение (admin)

### AggregatorService
Сервис для агрегации данных из внешних источников.

Методы:
- registerAdapter() - регистрация адаптера источника
- importWorkFromSource() - импорт произведения из источника
- syncWorkFromSource() - синхронизация данных произведения
- syncChaptersFromSource() - синхронизация глав

## Адаптеры

### ISourceAdapter
Интерфейс адаптера внешнего источника.

Методы:
- fetchWork() - получить данные произведения
- fetchChapters() - получить главы
- search() - поиск произведений

### ShikimoriAdapter
Реализация адаптера для Shikimori API.

Особенности:
- GraphQL API (предпочтительно)
- Rate limiting: 4 rps, 80 rpm
- Автоматический маппинг данных
- User-Agent requirement

## Использование

    import { WorkService, AggregatorService, ShikimoriAdapter } from "./services";
    
    const workService = new WorkService(
      workRepository,
      sourceRepository,
      authorRepository,
      genreRepository,
      tagRepository
    );
    
    const aggregator = new AggregatorService(
      workRepository,
      sourceRepository,
      authorRepository,
      genreRepository,
      tagRepository,
      chapterRepository,
      translatorRepository
    );
    
    const shikimoriAdapter = new ShikimoriAdapter({
      baseUrl: "https://shikimori.one",
      graphqlUrl: "https://shikimori.one/api/graphql",
      appName: "manga-platform/1.0"
    });
    
    aggregator.registerAdapter("shikimori", shikimoriAdapter);
    
    const work = await aggregator.importWorkFromSource("shikimori", "2", userId);

## Dependency Injection

Сервисы принимают репозитории через конструктор (Dependency Injection).

Преимущества:
- Легко тестировать с моками
- Слабая связанность
- Возможность замены реализации

## Error Handling

Сервисы выбрасывают ошибки с понятными сообщениями:
- "Work with slug already exists"
- "Source not found"
- "Adapter for source not found"

Контроллеры API должны обрабатывать эти ошибки и возвращать правильные HTTP коды.

