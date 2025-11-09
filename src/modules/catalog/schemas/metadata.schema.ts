import { z } from "zod";

/**
 * Автор произведения
 */
export const AuthorSchema = z.object({
  /** Идентификатор автора */
  id: z.string().uuid(),
  /** Имя автора */
  name: z.string().min(1).max(255),
  /** URL-friendly slug */
  slug: z.string().min(1).max(255),
  /** Биография автора */
  bio: z.string().nullable(),
  /** Дата создания */
  createdAt: z.date()
});
export type Author = z.infer<typeof AuthorSchema>;

/**
 * Жанр произведения
 */
export const GenreSchema = z.object({
  /** Идентификатор жанра */
  id: z.string().uuid(),
  /** Название жанра */
  name: z.string().min(1).max(100),
  /** URL-friendly slug */
  slug: z.string().min(1).max(100),
  /** Описание жанра */
  description: z.string().nullable(),
  /** Дата создания */
  createdAt: z.date()
});
export type Genre = z.infer<typeof GenreSchema>;

/**
 * Категория тега
 */
export const TagCategorySchema = z.enum([
  "theme",       // Тематика (isekai, school, military)
  "content",     // Контент (gore, ecchi, psychological)
  "format",      // Формат (4-koma, anthology, oneshot)
  "demographic"  // Демография (shounen, seinen, josei, shoujo)
]);
export type TagCategory = z.infer<typeof TagCategorySchema>;

/**
 * Тег произведения
 */
export const TagSchema = z.object({
  /** Идентификатор тега */
  id: z.string().uuid(),
  /** Название тега */
  name: z.string().min(1).max(100),
  /** URL-friendly slug */
  slug: z.string().min(1).max(100),
  /** Описание тега */
  description: z.string().nullable(),
  /** Категория тега */
  category: TagCategorySchema,
  /** Дата создания */
  createdAt: z.date()
});
export type Tag = z.infer<typeof TagSchema>;

/**
 * Связь произведения с автором
 */
export const WorkAuthorSchema = z.object({
  /** ID произведения */
  workId: z.string().uuid(),
  /** ID автора */
  authorId: z.string().uuid(),
  /** Порядок отображения (для множественных авторов) */
  orderIndex: z.number().min(0)
});
export type WorkAuthor = z.infer<typeof WorkAuthorSchema>;

/**
 * Связь произведения с жанром
 */
export const WorkGenreSchema = z.object({
  /** ID произведения */
  workId: z.string().uuid(),
  /** ID жанра */
  genreId: z.string().uuid()
});
export type WorkGenre = z.infer<typeof WorkGenreSchema>;

/**
 * Связь произведения с тегом
 */
export const WorkTagSchema = z.object({
  /** ID произведения */
  workId: z.string().uuid(),
  /** ID тега */
  tagId: z.string().uuid()
});
export type WorkTag = z.infer<typeof WorkTagSchema>;

