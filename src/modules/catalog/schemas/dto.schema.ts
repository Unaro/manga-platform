import { z } from "zod";
import { WorkTypeSchema, WorkStatusSchema, AlternativeTitlesSchema } from "./work.schema";

/**
 * Query параметры для получения списка произведений
 */
export const GetWorksQuerySchema = z.object({
  /** Номер страницы */
  page: z.coerce.number().min(1).default(1),
  /** Количество элементов на страницу */
  limit: z.coerce.number().min(1).max(100).default(20),
  /** Поле для сортировки */
  sort: z.enum(["title", "rating", "createdAt", "updatedAt"]).default("createdAt"),
  /** Порядок сортировки */
  order: z.enum(["asc", "desc"]).default("desc"),
  /** Фильтр по типу */
  type: WorkTypeSchema.optional(),
  /** Фильтр по статусу */
  status: WorkStatusSchema.optional(),
  /** Фильтр по жанрам (множественный) */
  genres: z.array(z.string()).optional(),
  /** Фильтр по тегам (множественный) */
  tags: z.array(z.string()).optional(),
  /** Фильтр по источнику */
  source: z.string().optional()
});
export type GetWorksQuery = z.infer<typeof GetWorksQuerySchema>;

/**
 * Query параметры для поиска произведений
 */
export const SearchWorksQuerySchema = z.object({
  /** Поисковый запрос */
  q: z.string().min(2).max(100),
  /** Количество результатов */
  limit: z.coerce.number().min(1).max(50).default(20)
});
export type SearchWorksQuery = z.infer<typeof SearchWorksQuerySchema>;

/**
 * Данные для создания произведения (модератор)
 */
export const CreateWorkInputSchema = z.object({
  /** Основное название */
  title: z.string().min(1).max(255),
  /** Описание */
  description: z.string().max(5000).optional(),
  /** Тип произведения */
  type: WorkTypeSchema,
  /** Статус публикации */
  status: WorkStatusSchema,
  /** URL обложки */
  coverUrl: z.string().url().optional(),
  /** Альтернативные названия */
  alternativeTitles: AlternativeTitlesSchema.partial().optional(),
  /** ID авторов */
  authorIds: z.array(z.string().uuid()).min(1),
  /** ID жанров */
  genreIds: z.array(z.string().uuid()).min(1),
  /** ID тегов */
  tagIds: z.array(z.string().uuid()).optional()
});
export type CreateWorkInput = z.infer<typeof CreateWorkInputSchema>;

/**
 * Данные для обновления произведения (модератор)
 */
export const UpdateWorkInputSchema = CreateWorkInputSchema.partial();
export type UpdateWorkInput = z.infer<typeof UpdateWorkInputSchema>;

/**
 * Данные для импорта произведения из источника (admin)
 */
export const ImportWorkInputSchema = z.object({
  /** Slug источника (например, "shikimori") */
  sourceSlug: z.string().min(1).max(100),
  /** ID произведения на внешнем источнике */
  externalId: z.string().min(1).max(255),
  /** Переопределить данные вручную */
  overrides: CreateWorkInputSchema.partial().optional()
});
export type ImportWorkInput = z.infer<typeof ImportWorkInputSchema>;

/**
 * Данные для оценки произведения (пользователь)
 */
export const RateWorkInputSchema = z.object({
  /** Оценка от 1 до 10 */
  rating: z.number().min(1).max(10)
});
export type RateWorkInput = z.infer<typeof RateWorkInputSchema>;

/**
 * Query параметры для получения глав
 */
export const GetChaptersQuerySchema = z.object({
  /** Фильтр по источнику */
  sourceId: z.string().uuid().optional(),
  /** Фильтр по переводчику */
  translatorId: z.string().uuid().optional(),
  /** Порядок сортировки */
  order: z.enum(["asc", "desc"]).default("asc"),
  /** Номер страницы */
  page: z.coerce.number().min(1).default(1),
  /** Количество элементов */
  limit: z.coerce.number().min(1).max(100).default(50)
});
export type GetChaptersQuery = z.infer<typeof GetChaptersQuerySchema>;

/**
 * Результат поиска произведения
 */
export const SearchResultSchema = z.object({
  /** Произведение */
  work: z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    type: WorkTypeSchema,
    coverUrl: z.string().url().nullable()
  }),
  /** Релевантность (0-1) */
  rank: z.number().min(0).max(1),
  /** Поля, в которых найдено совпадение */
  matchedFields: z.array(z.string())
});
export type SearchResult = z.infer<typeof SearchResultSchema>;

/**
 * Пагинированный результат
 */
export const PaginationSchema = z.object({
  /** Текущая страница */
  page: z.number().min(1),
  /** Элементов на страницу */
  limit: z.number().min(1),
  /** Всего элементов */
  total: z.number().min(0),
  /** Всего страниц */
  totalPages: z.number().min(0)
});
export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Generic пагинированный ответ
 */
export function createPaginatedResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    data: z.array(dataSchema),
    pagination: PaginationSchema
  });
}

