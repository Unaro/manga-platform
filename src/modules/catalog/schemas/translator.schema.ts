import { z } from "zod";

/**
 * Контакты переводчика
 */
export const TranslatorContactsSchema = z.object({
  /** Email */
  email: z.string().email().nullable().optional(),
  /** Discord */
  discord: z.string().nullable().optional(),
  /** Telegram */
  telegram: z.string().nullable().optional(),
  /** VK */
  vk: z.string().nullable().optional(),
  /** Другие контакты */
  other: z.string().nullable().optional()
});
export type TranslatorContacts = z.infer<typeof TranslatorContactsSchema>;

/**
 * Переводчик/команда переводчиков - доменная модель
 */
export const TranslatorSchema = z.object({
  /** Идентификатор переводчика */
  id: z.string().uuid(),
  /** ID источника, к которому привязан переводчик */
  sourceId: z.string().uuid(),
  /** Название команды переводчиков */
  name: z.string().min(1).max(255),
  /** URL-friendly slug */
  slug: z.string().min(1).max(255),
  /** URL страницы переводчика на источнике */
  url: z.string().url().nullable(),
  /** Контакты переводчика */
  contacts: TranslatorContactsSchema,
  /** Дата создания */
  createdAt: z.date()
});
export type Translator = z.infer<typeof TranslatorSchema>;

