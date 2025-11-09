/**
 * Базовое событие модуля Catalog
 */
export interface BaseCatalogEvent {
  /** Тип события */
  type: string;
  /** Версия события */
  version: number;
  /** Timestamp события */
  timestamp: Date;
  /** Уникальный ID события */
  eventId: string;
}

/**
 * Событие: Произведение создано
 */
export interface WorkCreatedEvent extends BaseCatalogEvent {
  type: "catalog.work_created.v1";
  version: 1;
  payload: {
    /** ID произведения */
    workId: string;
    /** Название произведения */
    title: string;
    /** Тип произведения */
    type: "manga" | "manhwa" | "manhua";
    /** Slug произведения */
    slug: string;
    /** ID пользователя, создавшего произведение */
    addedBy: string;
  };
}

/**
 * Событие: Произведение обновлено
 */
export interface WorkUpdatedEvent extends BaseCatalogEvent {
  type: "catalog.work_updated.v1";
  version: 1;
  payload: {
    /** ID произведения */
    workId: string;
    /** ID пользователя, обновившего произведение */
    updatedBy: string;
    /** Список измененных полей */
    changedFields: string[];
  };
}

/**
 * Событие: Произведение синхронизировано с внешним источником
 */
export interface WorkSyncedEvent extends BaseCatalogEvent {
  type: "catalog.work_synced.v1";
  version: 1;
  payload: {
    /** ID произведения */
    workId: string;
    /** ID источника */
    sourceId: string;
    /** ID на внешнем источнике */
    externalId: string;
    /** Список измененных полей */
    changedFields: string[];
  };
}

/**
 * Событие: Главы синхронизированы с внешним источником
 */
export interface ChaptersSyncedEvent extends BaseCatalogEvent {
  type: "catalog.chapters_synced.v1";
  version: 1;
  payload: {
    /** ID произведения */
    workId: string;
    /** ID источника */
    sourceId: string;
    /** Количество новых глав */
    newChaptersCount: number;
    /** Общее количество глав */
    totalChapters: number;
  };
}

/**
 * Событие: Произведение оценено пользователем
 */
export interface WorkRatedEvent extends BaseCatalogEvent {
  type: "catalog.work_rated.v1";
  version: 1;
  payload: {
    /** ID произведения */
    workId: string;
    /** ID пользователя */
    userId: string;
    /** Оценка (1-10) */
    rating: number;
    /** Предыдущая оценка (если была) */
    previousRating: number | null;
    /** Новый средний рейтинг произведения */
    newAverageRating: number;
  };
}

/**
 * Событие: Произведение просмотрено
 */
export interface WorkViewedEvent extends BaseCatalogEvent {
  type: "catalog.work_viewed.v1";
  version: 1;
  payload: {
    /** ID произведения */
    workId: string;
    /** ID пользователя (null для неавторизованных) */
    userId: string | null;
    /** IP адрес */
    ipAddress: string;
    /** User Agent */
    userAgent: string;
  };
}

/**
 * Все типы событий модуля Catalog
 */
export type CatalogEvent =
  | WorkCreatedEvent
  | WorkUpdatedEvent
  | WorkSyncedEvent
  | ChaptersSyncedEvent
  | WorkRatedEvent
  | WorkViewedEvent;

/**
 * Типы событий (для подписки)
 */
export const CatalogEventTypes = {
  WORK_CREATED: "catalog.work_created.v1",
  WORK_UPDATED: "catalog.work_updated.v1",
  WORK_SYNCED: "catalog.work_synced.v1",
  CHAPTERS_SYNCED: "catalog.chapters_synced.v1",
  WORK_RATED: "catalog.work_rated.v1",
  WORK_VIEWED: "catalog.work_viewed.v1"
} as const;

