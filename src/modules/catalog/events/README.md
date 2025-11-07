# Catalog Events

Система событий для модуля Catalog - event-driven взаимодействие между модулями.

## Структура

    events/
    |-- types.ts                     # Типы событий
    |-- event-bus.interface.ts       # Интерфейс Event Bus
    |-- event-publisher.ts           # Publisher событий
    |-- in-memory-event-bus.ts       # In-memory реализация
    |-- index.ts                     # Exports
    └-- README.md

## События модуля

### catalog.work_created.v1
Публикуется при создании нового произведения.

Payload:
- workId: ID произведения
- title: Название
- type: Тип (manga/manhwa/manhua)
- slug: URL-friendly slug
- addedBy: ID пользователя

Subscribers:
- Reading Tracker: создает начальную запись прогресса
- Game Economy: начисляет бонус модератору

### catalog.work_updated.v1
Публикуется при обновлении произведения.

Payload:
- workId: ID произведения
- updatedBy: ID пользователя
- changedFields: Список измененных полей

### catalog.work_synced.v1
Публикуется при синхронизации с внешним источником.

Payload:
- workId: ID произведения
- sourceId: ID источника
- externalId: ID на внешнем источнике
- changedFields: Список измененных полей

### catalog.chapters_synced.v1
Публикуется при синхронизации глав.

Payload:
- workId: ID произведения
- sourceId: ID источника
- newChaptersCount: Количество новых глав
- totalChapters: Общее количество глав

Subscribers:
- Reading Tracker: обновляет доступные главы

### catalog.work_rated.v1
Публикуется при оценке произведения пользователем.

Payload:
- workId: ID произведения
- userId: ID пользователя
- rating: Оценка (1-10)
- previousRating: Предыдущая оценка
- newAverageRating: Новый средний рейтинг

Subscribers:
- Game Economy: начисляет опыт пользователю

### catalog.work_viewed.v1
Публикуется при просмотре произведения.

Payload:
- workId: ID произведения
- userId: ID пользователя (null для гостей)
- ipAddress: IP адрес
- userAgent: User Agent

Subscribers:
- Analytics: учет просмотров

## Использование

### Publisher

    import { CatalogEventPublisher, InMemoryEventBus } from "./events";
    
    const eventBus = new InMemoryEventBus();
    const publisher = new CatalogEventPublisher(eventBus);
    
    await publisher.publishWorkCreated({
      workId: "123",
      title: "Naruto",
      type: "manga",
      slug: "naruto",
      addedBy: "user-456"
    });

### Subscriber

    import { CatalogEventTypes, InMemoryEventBus } from "./events";
    import type { WorkCreatedEvent } from "./events";
    
    const eventBus = new InMemoryEventBus();
    
    const unsubscribe = eventBus.subscribe<WorkCreatedEvent>(
      CatalogEventTypes.WORK_CREATED,
      async (event) => {
        console.log("Work created:", event.payload.title);
        
        await readingTrackerService.initializeProgress(
          event.payload.workId,
          event.payload.addedBy
        );
      }
    );
    
    unsubscribe();

### Integration with Services

    import { WorkService } from "../services";
    import { CatalogEventPublisher } from "../events";
    
    class WorkServiceWithEvents extends WorkService {
      constructor(
        workRepository: IWorkRepository,
        private eventPublisher: CatalogEventPublisher
      ) {
        super(workRepository);
      }
      
      async createWork(input: CreateWorkInput, userId: string) {
        const work = await super.createWork(input, userId);
        
        await this.eventPublisher.publishWorkCreated({
          workId: work.id,
          title: work.title,
          type: work.type,
          slug: work.slug,
          addedBy: userId
        });
        
        return work;
      }
    }

## Event Bus Implementations

### InMemoryEventBus
In-memory реализация для разработки и тестирования.

Особенности:
- Синхронная обработка событий
- Логирование в консоль
- Нет персистентности
- Подходит для dev/test

### Future: RedisEventBus
Planned реализация с Redis Pub/Sub.

Особенности:
- Масштабируемость
- Персистентность
- Поддержка нескольких инстансов
- Retry механизм

### Future: KafkaEventBus
Planned реализация с Apache Kafka.

Особенности:
- Event sourcing
- Stream processing
- Гарантированная доставка
- Replay events

## Event Versioning

События имеют версию (v1, v2 и т.д.).

При изменении структуры события:
1. Создать новый тип события (v2)
2. Старые события продолжают работать
3. Постепенная миграция subscribers
4. Deprecation notice для старой версии

Example:

    catalog.work_created.v1 (current)
    catalog.work_created.v2 (future)

## Error Handling

Ошибки в обработчиках не прерывают публикацию.

Все ошибки логируются:

    [EventBus] Error in handler for catalog.work_created.v1: Error message

## Testing

    import { InMemoryEventBus } from "./events";
    
    describe("WorkService Events", () => {
      it("should publish work_created event", async () => {
        const eventBus = new InMemoryEventBus();
        const publisher = new CatalogEventPublisher(eventBus);
        
        const events: WorkCreatedEvent[] = [];
        eventBus.subscribe<WorkCreatedEvent>(
          CatalogEventTypes.WORK_CREATED,
          (event) => {
            events.push(event);
          }
        );
        
        await publisher.publishWorkCreated({
          workId: "123",
          title: "Test",
          type: "manga",
          slug: "test",
          addedBy: "user-1"
        });
        
        expect(events).toHaveLength(1);
        expect(events[0].payload.title).toBe("Test");
      });
    });

