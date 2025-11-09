import type { IEventBus } from "./event-bus.interface";
import type {
  WorkCreatedEvent,
  WorkUpdatedEvent,
  WorkSyncedEvent,
  ChaptersSyncedEvent,
  WorkRatedEvent,
  WorkViewedEvent
} from "./types";
import { CatalogEventTypes } from "./types";

/**
 * Publisher событий модуля Catalog
 */
export class CatalogEventPublisher {
  constructor(private eventBus: IEventBus) {}

  /**
   * Генерация уникального ID события
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Опубликовать событие: Произведение создано
   */
  async publishWorkCreated(payload: WorkCreatedEvent["payload"]): Promise<void> {
    const event: WorkCreatedEvent = {
      type: CatalogEventTypes.WORK_CREATED,
      version: 1,
      timestamp: new Date(),
      eventId: this.generateEventId(),
      payload
    };

    await this.eventBus.publish(event);
  }

  /**
   * Опубликовать событие: Произведение обновлено
   */
  async publishWorkUpdated(payload: WorkUpdatedEvent["payload"]): Promise<void> {
    const event: WorkUpdatedEvent = {
      type: CatalogEventTypes.WORK_UPDATED,
      version: 1,
      timestamp: new Date(),
      eventId: this.generateEventId(),
      payload
    };

    await this.eventBus.publish(event);
  }

  /**
   * Опубликовать событие: Произведение синхронизировано
   */
  async publishWorkSynced(payload: WorkSyncedEvent["payload"]): Promise<void> {
    const event: WorkSyncedEvent = {
      type: CatalogEventTypes.WORK_SYNCED,
      version: 1,
      timestamp: new Date(),
      eventId: this.generateEventId(),
      payload
    };

    await this.eventBus.publish(event);
  }

  /**
   * Опубликовать событие: Главы синхронизированы
   */
  async publishChaptersSynced(payload: ChaptersSyncedEvent["payload"]): Promise<void> {
    const event: ChaptersSyncedEvent = {
      type: CatalogEventTypes.CHAPTERS_SYNCED,
      version: 1,
      timestamp: new Date(),
      eventId: this.generateEventId(),
      payload
    };

    await this.eventBus.publish(event);
  }

  /**
   * Опубликовать событие: Произведение оценено
   */
  async publishWorkRated(payload: WorkRatedEvent["payload"]): Promise<void> {
    const event: WorkRatedEvent = {
      type: CatalogEventTypes.WORK_RATED,
      version: 1,
      timestamp: new Date(),
      eventId: this.generateEventId(),
      payload
    };

    await this.eventBus.publish(event);
  }

  /**
   * Опубликовать событие: Произведение просмотрено
   */
  async publishWorkViewed(payload: WorkViewedEvent["payload"]): Promise<void> {
    const event: WorkViewedEvent = {
      type: CatalogEventTypes.WORK_VIEWED,
      version: 1,
      timestamp: new Date(),
      eventId: this.generateEventId(),
      payload
    };

    await this.eventBus.publish(event);
  }
}

