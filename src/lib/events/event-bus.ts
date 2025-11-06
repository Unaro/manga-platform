/**
 * Базовое событие согласно архитектурным принципам.
 */
export interface BaseEvent {
  readonly type: string;
  readonly timestamp: Date;
  readonly eventId: string;
  readonly version: number;
  readonly metadata?: EventMetadata;
}

export interface EventMetadata {
  userId?: string;
  sessionId?: string;
  traceId?: string;
  source?: string;
  causationId?: string;
  correlationId?: string;
}

/**
 * Доменное событие для изменений агрегатов.
 */
export interface DomainEvent<TData = unknown> extends BaseEvent {
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly data: TData;
}

/**
 * Интеграционное событие для взаимодействия между модулями.
 */
export interface IntegrationEvent<TData = unknown> extends BaseEvent {
  readonly data: TData;
  readonly source: string;
  readonly destination?: string;
}

/**
 * Обработчик событий.
 */
export type EventHandler<TEvent = BaseEvent> = (
  event: TEvent
) => Promise<void> | void;

/**
 * Шина событий для pub/sub паттерна.
 */
export interface EventBus {
  publish<TEvent extends BaseEvent>(
    topic: string,
    event: TEvent
  ): Promise<void>;
  subscribe<TEvent extends BaseEvent>(
    topic: string,
    handler: EventHandler<TEvent>
  ): void;
  unsubscribe(topic: string, handler: EventHandler): void;
}

/**
 * In-memory реализация event bus для разработки.
 */
export class InMemoryEventBus implements EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  async publish<TEvent extends BaseEvent>(
    topic: string,
    event: TEvent
  ): Promise<void> {
    const handlers = this.handlers.get(topic);
    
    if (!handlers || handlers.size === 0) {
      console.warn(`No handlers registered for topic: ${topic}`);
      return;
    }

    // Выполняем обработчики параллельно
    await Promise.all(
      Array.from(handlers).map((handler) =>
        Promise.resolve(handler(event)).catch((error) => {
          console.error(`Error in event handler for ${topic}:`, error);
        })
      )
    );
  }

  subscribe<TEvent extends BaseEvent>(
    topic: string,
    handler: EventHandler<TEvent>
  ): void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }
    
    this.handlers.get(topic)!.add(handler as EventHandler);
  }

  unsubscribe(topic: string, handler: EventHandler): void {
    const handlers = this.handlers.get(topic);
    if (handlers) {
      handlers.delete(handler);
    }
  }
}

/**
 * Глобальный экземпляр event bus.
 */
export const eventBus = new InMemoryEventBus();