import type { CatalogEvent } from "./types";

/**
 * Обработчик события
 */
export type EventHandler<T extends CatalogEvent> = (event: T) => Promise<void> | void;

/**
 * Интерфейс Event Bus для межмодульного взаимодействия
 */
export interface IEventBus {
  /**
   * Опубликовать событие
   */
  publish<T extends CatalogEvent>(event: T): Promise<void>;
  
  /**
   * Подписаться на событие
   */
  subscribe<T extends CatalogEvent>(
    eventType: T["type"],
    handler: EventHandler<T>
  ): () => void;
  
  /**
   * Отписаться от события
   */
  unsubscribe(eventType: string, handler: EventHandler<any>): void;
}

