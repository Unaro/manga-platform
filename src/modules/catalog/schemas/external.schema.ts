import { z } from "zod";

/**
 * Неполная дата от Shikimori (год, месяц, день могут быть null)
 */
export const IncompleteDateSchema = z.object({
  year: z.number().nullable(),
  month: z.number().min(1).max(12).nullable(),
  day: z.number().min(1).max(31).nullable()
}).nullable();
export type IncompleteDate = z.infer<typeof IncompleteDateSchema>;

/**
 * Постер (обложка) от Shikimori
 */
export const ShikimoriPosterSchema = z.object({
  /** Оригинальное изображение (высокое качество) */
  originalUrl: z.string().url(),
  /** Основное изображение */
  mainUrl: z.string().url(),
  /** Превью */
  previewUrl: z.string().url().optional()
});
export type ShikimoriPoster = z.infer<typeof ShikimoriPosterSchema>;

/**
 * Жанр от Shikimori
 */
export const ShikimoriGenreSchema = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullable().optional(),
  kind: z.enum(["anime", "manga"]).optional()
});
export type ShikimoriGenre = z.infer<typeof ShikimoriGenreSchema>;

/**
 * Издатель от Shikimori
 */
export const ShikimoriPublisherSchema = z.object({
  id: z.string(),
  name: z.string()
});
export type ShikimoriPublisher = z.infer<typeof ShikimoriPublisherSchema>;

/**
 * Роль персоны (автор, художник и т.д.)
 */
export const ShikimoriPersonRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  russian: z.string().nullable().optional(),
  roles: z.array(z.string()).optional()
});
export type ShikimoriPersonRole = z.infer<typeof ShikimoriPersonRoleSchema>;

/**
 * Внешняя ссылка (MAL, AniList и т.д.)
 */
export const ShikimoriExternalLinkSchema = z.object({
  id: z.string().optional(),
  kind: z.string(),
  url: z.string().url(),
  source: z.string().optional()
});
export type ShikimoriExternalLink = z.infer<typeof ShikimoriExternalLinkSchema>;

/**
 * Статистика оценок
 */
export const ShikimoriScoreStatSchema = z.object({
  score: z.number().min(1).max(10),
  count: z.number().min(0)
});
export type ShikimoriScoreStat = z.infer<typeof ShikimoriScoreStatSchema>;

/**
 * Статистика статусов
 */
export const ShikimoriStatusStatSchema = z.object({
  status: z.string(),
  count: z.number().min(0)
});
export type ShikimoriStatusStat = z.infer<typeof ShikimoriStatusStatSchema>;

/**
 * Оценка пользователя от Shikimori (требует авторизации)
 */
export const ShikimoriUserRateSchema = z.object({
  id: z.string(),
  score: z.number().min(0).max(10),
  status: z.string(),
  chapters: z.number().min(0),
  volumes: z.number().min(0),
  updatedAt: z.string().datetime().optional()
}).nullable();
export type ShikimoriUserRate = z.infer<typeof ShikimoriUserRateSchema>;

/**
 * Полный ответ Shikimori GraphQL API для Manga
 */
export const ShikimoriMangaSchema = z.object({
  /** ID манги на Shikimori */
  id: z.string(),
  
  /** Названия */
  name: z.string(),
  russian: z.string().nullable().optional(),
  english: z.string().nullable().optional(),
  japanese: z.string().nullable().optional(),
  
  /** Тип произведения */
  kind: z.enum([
    "manga",
    "manhwa", 
    "manhua",
    "one_shot",
    "doujin",
    "novel",
    "light_novel"
  ]),
  
  /** Статус публикации */
  status: z.enum([
    "anons",
    "ongoing",
    "released",
    "paused",
    "discontinued"
  ]),
  
  /** Рейтинг (0-10) */
  score: z.number().min(0).max(10).nullable(),
  
  /** Количество глав и томов */
  chapters: z.number().min(0).nullable(),
  volumes: z.number().min(0).nullable(),
  
  /** Описание */
  description: z.string().nullable().optional(),
  descriptionHtml: z.string().nullable().optional(),
  descriptionSource: z.string().nullable().optional(),
  
  /** Даты */
  airedOn: IncompleteDateSchema.optional(),
  releasedOn: IncompleteDateSchema.optional(),
  
  /** Обложка */
  poster: ShikimoriPosterSchema.optional(),
  
  /** URL на Shikimori (относительный) */
  url: z.string(),
  
  /** Жанры */
  genres: z.array(ShikimoriGenreSchema).optional(),
  
  /** Издатели */
  publishers: z.array(ShikimoriPublisherSchema).optional(),
  
  /** Авторы (через roles) */
  authors: z.array(ShikimoriPersonRoleSchema).optional(),
  
  /** Франшиза */
  franchise: z.string().nullable().optional(),
  
  /** Внешние ссылки */
  externalLinks: z.array(ShikimoriExternalLinkSchema).optional(),
  
  /** Статистика */
  scoresStats: z.array(ShikimoriScoreStatSchema).optional(),
  statusesStats: z.array(ShikimoriStatusStatSchema).optional(),
  
  /** Оценка пользователя (если авторизован) */
  userRate: ShikimoriUserRateSchema.optional()
});
export type ShikimoriManga = z.infer<typeof ShikimoriMangaSchema>;

/**
 * Ответ Shikimori GraphQL для списка манги
 */
export const ShikimoriMangaListResponseSchema = z.object({
  data: z.object({
    mangas: z.array(ShikimoriMangaSchema)
  })
});
export type ShikimoriMangaListResponse = z.infer<typeof ShikimoriMangaListResponseSchema>;

/**
 * Нормализованные данные произведения для нашей системы
 */
export const ExternalWorkDataSchema = z.object({
  /** ID на внешнем источнике */
  externalId: z.string(),
  
  /** Основное название (предпочитаем русское) */
  title: z.string(),
  
  /** Альтернативные названия */
  alternativeTitles: z.object({
    english: z.string().nullable().optional(),
    romaji: z.string().nullable().optional(),
    native: z.string().nullable().optional()
  }),
  
  /** Тип произведения */
  type: z.enum(["manga", "manhwa", "manhua"]),
  
  /** Статус */
  status: z.enum(["upcoming", "ongoing", "completed", "hiatus", "cancelled"]),
  
  /** Описание (очищенное от HTML) */
  description: z.string().nullable().optional(),
  
  /** URL обложки */
  coverUrl: z.string().url().nullable().optional(),
  
  /** URL на внешнем источнике */
  externalUrl: z.string().url(),
  
  /** Рейтинг на внешнем источнике */
  externalRating: z.number().min(0).max(10).nullable().optional(),
  
  /** Количество оценок */
  externalRatingCount: z.number().min(0).nullable().optional(),
  
  /** Жанры (названия, предпочитаем русские) */
  genres: z.array(z.string()),
  
  /** Авторы (имена) */
  authors: z.array(z.string()).optional(),
  
  /** Теги (для one_shot, doujin и т.д.) */
  tags: z.array(z.string()).optional(),
  
  /** Дополнительные метаданные (chapters, volumes, dates, links) */
  metadata: z.object({
    chapters: z.number().nullable().optional(),
    volumes: z.number().nullable().optional(),
    airedOn: IncompleteDateSchema.optional(),
    releasedOn: IncompleteDateSchema.optional(),
    franchise: z.string().nullable().optional(),
    publishers: z.array(ShikimoriPublisherSchema).optional(),
    externalLinks: z.array(ShikimoriExternalLinkSchema).optional(),
    scoresStats: z.array(ShikimoriScoreStatSchema).optional(),
    statusesStats: z.array(ShikimoriStatusStatSchema).optional()
  }).optional()
});
export type ExternalWorkData = z.infer<typeof ExternalWorkDataSchema>;

/**
 * Данные главы от внешнего источника
 */
export const ExternalChapterDataSchema = z.object({
  /** Номер главы */
  number: z.number().min(0),
  /** Название главы */
  title: z.string().nullable().optional(),
  /** Том */
  volume: z.string().nullable().optional(),
  /** URL главы */
  externalUrl: z.string().url(),
  /** Название переводчика */
  translatorName: z.string().nullable().optional(),
  /** Дата публикации */
  publishedAt: z.string().datetime().nullable().optional()
});
export type ExternalChapterData = z.infer<typeof ExternalChapterDataSchema>;

