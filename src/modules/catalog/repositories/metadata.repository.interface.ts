import type { Author, Genre, Tag } from "../schemas/metadata.schema";

/**
 * Данные для создания автора
 */
export interface CreateAuthorData {
  name: string;
  slug: string;
  bio: string | null;
}

/**
 * Данные для создания жанра
 */
export interface CreateGenreData {
  name: string;
  slug: string;
  description: string | null;
}

/**
 * Данные для создания тега
 */
export interface CreateTagData {
  name: string;
  slug: string;
  description: string | null;
  category: "theme" | "content" | "format" | "demographic";
}

/**
 * Интерфейс репозитория для работы с авторами
 */
export interface IAuthorRepository {
  /**
   * Найти автора по ID
   */
  findById(id: string): Promise<Author | null>;
  
  /**
   * Найти автора по slug
   */
  findBySlug(slug: string): Promise<Author | null>;
  
  /**
   * Найти автора по имени
   */
  findByName(name: string): Promise<Author | null>;
  
  /**
   * Получить всех авторов
   */
  findAll(): Promise<Author[]>;
  
  /**
   * Создать автора
   */
  create(data: CreateAuthorData): Promise<Author>;
  
  /**
   * Создать автора если не существует
   */
  findOrCreate(data: CreateAuthorData): Promise<Author>;
  
  /**
   * Связать автора с произведением
   */
  linkToWork(workId: string, authorId: string, orderIndex: number): Promise<void>;
  
  /**
   * Отвязать автора от произведения
   */
  unlinkFromWork(workId: string, authorId: string): Promise<void>;
  
  /**
   * Получить авторов произведения
   */
  findByWorkId(workId: string): Promise<Author[]>;
}

/**
 * Интерфейс репозитория для работы с жанрами
 */
export interface IGenreRepository {
  /**
   * Найти жанр по ID
   */
  findById(id: string): Promise<Genre | null>;
  
  /**
   * Найти жанр по slug
   */
  findBySlug(slug: string): Promise<Genre | null>;
  
  /**
   * Найти жанр по имени (case-insensitive)
   */
  findByName(name: string): Promise<Genre | null>;
  
  /**
   * Получить все жанры
   */
  findAll(): Promise<Genre[]>;
  
  /**
   * Создать жанр
   */
  create(data: CreateGenreData): Promise<Genre>;
  
  /**
   * Создать жанр если не существует
   */
  findOrCreate(data: CreateGenreData): Promise<Genre>;
  
  /**
   * Связать жанр с произведением
   */
  linkToWork(workId: string, genreId: string): Promise<void>;
  
  /**
   * Отвязать жанр от произведения
   */
  unlinkFromWork(workId: string, genreId: string): Promise<void>;
  
  /**
   * Получить жанры произведения
   */
  findByWorkId(workId: string): Promise<Genre[]>;
}

/**
 * Интерфейс репозитория для работы с тегами
 */
export interface ITagRepository {
  /**
   * Найти тег по ID
   */
  findById(id: string): Promise<Tag | null>;
  
  /**
   * Найти тег по slug
   */
  findBySlug(slug: string): Promise<Tag | null>;
  
  /**
   * Найти тег по имени (case-insensitive)
   */
  findByName(name: string): Promise<Tag | null>;
  
  /**
   * Получить все теги
   */
  findAll(): Promise<Tag[]>;
  
  /**
   * Получить теги по категории
   */
  findByCategory(category: string): Promise<Tag[]>;
  
  /**
   * Создать тег
   */
  create(data: CreateTagData): Promise<Tag>;
  
  /**
   * Создать тег если не существует
   */
  findOrCreate(data: CreateTagData): Promise<Tag>;
  
  /**
   * Связать тег с произведением
   */
  linkToWork(workId: string, tagId: string): Promise<void>;
  
  /**
   * Отвязать тег от произведения
   */
  unlinkFromWork(workId: string, tagId: string): Promise<void>;
  
  /**
   * Получить теги произведения
   */
  findByWorkId(workId: string): Promise<Tag[]>;
}

