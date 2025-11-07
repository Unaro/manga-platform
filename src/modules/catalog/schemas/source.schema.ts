import { z } from "zod";

/**
 * Тип источника
 */
export const SourceTypeSchema = z.enum([
  "api",      // API интеграция (Shikimori, MangaDex)
  "scraper",  // Web scraping
  "manual"    // Ручное добавление
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

/**
 * Конфигурация источника
 */
export const SourceConfigSchema = z.object({
  /** Использовать GraphQL вместо REST */
  useGraphQL: z.boolean().optional(),
  /** Предпочитать русские названия */
  preferRussianNames: z.boolean().optional(),
  /** Rate limit: запросов в секунду */
  rateLimitRps: z.number().min(1).max(100).optional(),
  /** Rate limit: запросов в минуту */
  rateLimitRpm: z.number().min(1).max(1000).optional(),
  /** OAuth Client ID */
  clientId: z.string().optional(),
  /** OAuth Client Secret */
  clientSecret: z.string().optional(),
  /** API Key */
  apiKey: z.string().optional(),
  /** Дополнительные настройки */
  extra: z.record(z.unknown()).optional()
});
export type SourceConfig = z.infer<typeof SourceConfigSchema>;

/**
 * Источник (внешний сайт) - доменная модель
 */
export const SourceSchema = z.object({
  /** Идентификатор источника */
  id: z.string().uuid(),
  /** Название источника */
  name: z.string().min(1).max(100),
  /** URL-friendly slug */
  slug: z.string().min(1).max(100),
  /** Базовый URL сайта */
  baseUrl: z.string().url(),
  /** URL API endpoint */
  apiUrl: z.string().url().nullable(),
  /** Тип источника */
  type: SourceTypeSchema,
  /** Активен ли источник */
  isActive: z.boolean(),
  /** Конфигурация источника */
  config: SourceConfigSchema,
  /** Дата создания */
  createdAt: z.date()
});
export type Source = z.infer<typeof SourceSchema>;

/**
 * Метаданные WorkSource специфичные для Shikimori
 */
export const ShikimoriWorkSourceMetadataSchema = z.object({
  /** Количество глав на Shikimori */
  chapters: z.number().nullable().optional(),
  /** Количество томов на Shikimori */
  volumes: z.number().nullable().optional(),
  /** Дата начала публикации */
  airedOn: z.object({
    year: z.number().nullable(),
    month: z.number().nullable(),
    day: z.number().nullable()
  }).nullable().optional(),
  /** Дата завершения публикации */
  releasedOn: z.object({
    year: z.number().nullable(),
    month: z.number().nullable(),
    day: z.number().nullable()
  }).nullable().optional(),
  /** Франшиза */
  franchise: z.string().nullable().optional(),
  /** Издатели */
  publishers: z.array(z.object({
    id: z.string(),
    name: z.string()
  })).optional(),
  /** Внешние ссылки (MAL, AniList) */
  externalLinks: z.array(z.object({
    kind: z.string(),
    url: z.string(),
    source: z.string().optional()
  })).optional(),
  /** Статистика оценок */
  scoresStats: z.array(z.object({
    score: z.number(),
    count: z.number()
  })).optional(),
  /** Статистика статусов пользователей */
  statusesStats: z.array(z.object({
    status: z.string(),
    count: z.number()
  })).optional()
});
export type ShikimoriWorkSourceMetadata = z.infer<typeof ShikimoriWorkSourceMetadataSchema>;

/**
 * Связь произведения с источником (many-to-many)
 */
export const WorkSourceSchema = z.object({
  /** Идентификатор связи */
  id: z.string().uuid(),
  /** ID произведения */
  workId: z.string().uuid(),
  /** ID источника */
  sourceId: z.string().uuid(),
  /** ID произведения на внешнем источнике */
  externalId: z.string().min(1).max(255),
  /** URL произведения на внешнем источнике */
  externalUrl: z.string().url(),
  /** Рейтинг на внешнем источнике */
  externalRating: z.number().min(0).max(10).nullable(),
  /** Количество оценок на внешнем источнике */
  externalRatingCount: z.number().min(0).nullable(),
  /** Дополнительные метаданные (специфичные для источника) */
  metadata: z.record(z.unknown()),
  /** Дата последней синхронизации */
  syncedAt: z.date(),
  /** Дата создания связи */
  createdAt: z.date()
});
export type WorkSource = z.infer<typeof WorkSourceSchema>;

/**
 * WorkSource с информацией об источнике
 */
export const WorkSourceWithSourceSchema = WorkSourceSchema.extend({
  source: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    baseUrl: z.string().url()
  })
});
export type WorkSourceWithSource = z.infer<typeof WorkSourceWithSourceSchema>;

