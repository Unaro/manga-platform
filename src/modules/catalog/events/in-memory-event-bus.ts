import type { IEventBus, EventHandler } from "./event-bus.interface";
import type { CatalogEvent } from "./types";

/**
 * In-Memory реализация Event Bus для разработки и тестирования
 */
export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();

  /**
   * Опубликовать событие
   */
  async publish<T extends CatalogEvent>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.type);
    
    if (!handlers || handlers.size === 0) {
      console.log(`[EventBus] No handlers for event type: ${event.type}`);
      return;
    }

    console.log(`[EventBus] Publishing event: ${event.type}`, event);

    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventBus] Error in handler for ${event.type}:`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Подписаться на событие
   */
  subscribe<T extends CatalogEvent>(
    eventType: T["type"],
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const handlers = this.handlers.get(eventType)!;
    handlers.add(handler);

    console.log(`[EventBus] Subscribed to event: ${eventType}`);

    return () => {
      this.unsubscribe(eventType, handler);
    };
  }

  /**
   * Отписаться от события
   */
  unsubscribe(eventType: string, handler: EventHandler<any>): void {
    const handlers = this.handlers.get(eventType);
    
    if (handlers) {
      handlers.delete(handler);
      console.log(`[EventBus] Unsubscribed from event: ${eventType}`);
      
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * Очистить все подписки (для тестов)
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Получить количество обработчиков для типа события (для тестов)
   */
  getHandlerCount(eventType: string): number {
    const handlers = this.handlers.get(eventType);
    return handlers ? handlers.size : 0;
  }
}

