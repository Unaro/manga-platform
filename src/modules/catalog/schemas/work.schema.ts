import { z } from "zod";

/**
 * Тип произведения
 */
export const WorkTypeSchema = z.enum(["manga", "manhwa", "manhua"]);
export type WorkType = z.infer<typeof WorkTypeSchema>;

/**
 * Статус публикации произведения
 */
export const WorkStatusSchema = z.enum([
  "upcoming",    // Анонсировано, ещё не вышло
  "ongoing",     // Выходит
  "completed",   // Завершено
  "hiatus",      // На паузе
  "cancelled"    // Отменено
]);
export type WorkStatus = z.infer<typeof WorkStatusSchema>;

/**
 * Альтернативные названия произведения
 */
export const AlternativeTitlesSchema = z.object({
  /** Английское название */
  english: z.string().nullable(),
  /** Ромадзи (латиница) */
  romaji: z.string().nullable(),
  /** Оригинальное название (на языке страны происхождения) */
  native: z.string().nullable()
});
export type AlternativeTitles = z.infer<typeof AlternativeTitlesSchema>;

/**
 * Произведение (манга/манхва/манхуа) - доменная модель
 */
export const WorkSchema = z.object({
  /** Идентификатор произведения */
  id: z.string().uuid(),
  /** Основное название */
  title: z.string().min(1).max(255),
  /** URL-friendly slug */
  slug: z.string().min(1).max(255),
  /** Описание произведения */
  description: z.string().nullable(),
  /** Тип произведения */
  type: WorkTypeSchema,
  /** Статус публикации */
  status: WorkStatusSchema,
  /** URL обложки */
  coverUrl: z.string().url().nullable(),
  /** Альтернативные названия */
  alternativeTitles: AlternativeTitlesSchema,
  /** Пользователь, добавивший произведение */
  addedBy: z.string().uuid(),
  /** Дата создания записи */
  createdAt: z.date(),
  /** Дата последнего обновления */
  updatedAt: z.date()
});
export type Work = z.infer<typeof WorkSchema>;

/**
 * Источник произведения (краткая информация)
 */
export const WorkSourceInfoSchema = z.object({
  /** ID записи WorkSource */
  id: z.string().uuid(),
  /** Название источника */
  sourceName: z.string(),
  /** Slug источника */
  sourceSlug: z.string(),
  /** ID на внешнем источнике */
  externalId: z.string(),
  /** URL на внешнем источнике */
  externalUrl: z.string().url(),
  /** Рейтинг на источнике */
  externalRating: z.number().nullable(),
  /** Количество оценок на источнике */
  externalRatingCount: z.number().nullable(),
  /** Дата последней синхронизации */
  syncedAt: z.date()
});
export type WorkSourceInfo = z.infer<typeof WorkSourceInfoSchema>;

/**
 * Статистика произведения
 */
export const WorkStatisticsSchema = z.object({
  /** Количество просмотров */
  viewCount: z.number().min(0),
  /** Количество оценок пользователей */
  ratingCount: z.number().min(0),
  /** Средняя оценка (1-10) */
  averageRating: z.number().min(0).max(10),
  /** Количество добавлений в закладки */
  bookmarkCount: z.number().min(0),
  /** Общее количество глав */
  chapterCount: z.number().min(0)
});
export type WorkStatistics = z.infer<typeof WorkStatisticsSchema>;

/**
 * Произведение с полной информацией (включая связи)
 */
export const WorkWithRelationsSchema = WorkSchema.extend({
  /** Авторы произведения */
  authors: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string()
  })),
  /** Жанры */
  genres: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string()
  })),
  /** Теги */
  tags: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    category: z.string()
  })),
  /** Источники (внешние сайты) */
  sources: z.array(WorkSourceInfoSchema),
  /** Статистика */
  statistics: WorkStatisticsSchema
});
export type WorkWithRelations = z.infer<typeof WorkWithRelationsSchema>;

/**
 * Краткая информация о произведении (для списков)
 */
export const WorkSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  type: WorkTypeSchema,
  status: WorkStatusSchema,
  coverUrl: z.string().url().nullable(),
  /** Краткая статистика */
  statistics: z.object({
    averageRating: z.number(),
    ratingCount: z.number()
  })
});
export type WorkSummary = z.infer<typeof WorkSummarySchema>;

