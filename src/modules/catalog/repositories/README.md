# Catalog Repositories

Репозитории для модуля Catalog - интерфейсы для работы с базой данных.

## Структура

    repositories/
    |-- work.repository.interface.ts          # Work repository
    |-- source.repository.interface.ts        # Source + WorkSource
    |-- metadata.repository.interface.ts      # Author, Genre, Tag
    |-- chapter.repository.interface.ts       # Chapter + Translator
    |-- index.ts                              # Exports
    └-- README.md

## Принципы

### Repository Pattern
- Интерфейсы определяют контракт
- Реализации (Supabase) будут созданы отдельно
- Изоляция бизнес-логики от деталей БД

### Naming Convention
- Interface: IWorkRepository
- Implementation: WorkRepositorySupabase (будет создан)

### CRUD Operations
- create() - создание записи
- findById() - поиск по ID
- findBySlug() - поиск по slug
- findMany() - множественный поиск с фильтрами
- update() - обновление
- delete() - удаление

### Special Methods
- findOrCreate() - найти или создать
- linkToWork() - связать с произведением
- unlinkFromWork() - отвязать от произведения
- incrementViewCount() - увеличить счетчик
- updateSyncedAt() - обновить timestamp синхронизации

## Использование

    import type { IWorkRepository } from "./repositories";
    
    class WorkService {
      constructor(private workRepository: IWorkRepository) {}
      
      async getWorkById(id: string) {
        return await this.workRepository.findById(id);
      }
    }

## Next Steps

1. Создать реализации для Supabase
2. Добавить unit тесты с моками
3. Добавить интеграционные тесты

