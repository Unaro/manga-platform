import { z } from "zod";

/**
 * Глава произведения - доменная модель
 */
export const ChapterSchema = z.object({
  /** Идентификатор главы */
  id: z.string().uuid(),
  /** ID произведения */
  workId: z.string().uuid(),
  /** ID источника */
  sourceId: z.string().uuid(),
  /** ID переводчика */
  translatorId: z.string().uuid().nullable(),
  /** Название главы */
  title: z.string().max(255).nullable(),
  /** Номер главы (может быть дробным, например 1.5) */
  number: z.number().min(0),
  /** Том */
  volume: z.string().max(50).nullable(),
  /** Внешняя ссылка на главу */
  externalUrl: z.string().url(),
  /** Дата публикации главы */
  publishedAt: z.date().nullable(),
  /** Дата создания записи */
  createdAt: z.date()
});
export type Chapter = z.infer<typeof ChapterSchema>;

/**
 * Глава с полной информацией (включая переводчика)
 */
export const ChapterWithTranslatorSchema = ChapterSchema.extend({
  /** Информация о переводчике */
  translator: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string()
  }).nullable(),
  /** Информация об источнике */
  source: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string()
  })
});
export type ChapterWithTranslator = z.infer<typeof ChapterWithTranslatorSchema>;

