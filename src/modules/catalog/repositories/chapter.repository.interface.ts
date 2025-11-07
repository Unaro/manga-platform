import type { Chapter, ChapterWithTranslator } from "../schemas/chapter.schema";
import type { Translator } from "../schemas/translator.schema";

/**
 * Данные для создания переводчика
 */
export interface CreateTranslatorData {
  sourceId: string;
  name: string;
  slug: string;
  url: string | null;
  contacts: Record<string, unknown>;
}

/**
 * Данные для создания главы
 */
export interface CreateChapterData {
  workId: string;
  sourceId: string;
  translatorId: string | null;
  title: string | null;
  number: number;
  volume: string | null;
  externalUrl: string;
  publishedAt: Date | null;
}

/**
 * Параметры для поиска глав
 */
export interface FindChaptersParams {
  workId: string;
  sourceId?: string;
  translatorId?: string;
  page: number;
  limit: number;
  order: "asc" | "desc";
}

/**
 * Интерфейс репозитория для работы с переводчиками
 */
export interface ITranslatorRepository {
  /**
   * Найти переводчика по ID
   */
  findById(id: string): Promise<Translator | null>;
  
  /**
   * Найти переводчика по slug и sourceId
   */
  findBySlug(sourceId: string, slug: string): Promise<Translator | null>;
  
  /**
   * Найти переводчика по имени и sourceId
   */
  findByName(sourceId: string, name: string): Promise<Translator | null>;
  
  /**
   * Получить всех переводчиков источника
   */
  findBySourceId(sourceId: string): Promise<Translator[]>;
  
  /**
   * Создать переводчика
   */
  create(data: CreateTranslatorData): Promise<Translator>;
  
  /**
   * Создать переводчика если не существует
   */
  findOrCreate(data: CreateTranslatorData): Promise<Translator>;
}

/**
 * Интерфейс репозитория для работы с главами
 */
export interface IChapterRepository {
  /**
   * Найти главу по ID
   */
  findById(id: string): Promise<Chapter | null>;
  
  /**
   * Найти главу с информацией о переводчике
   */
  findByIdWithTranslator(id: string): Promise<ChapterWithTranslator | null>;
  
  /**
   * Найти главы произведения с фильтрами
   */
  findByWorkId(params: FindChaptersParams): Promise<{
    chapters: ChapterWithTranslator[];
    total: number;
  }>;
  
  /**
   * Найти главу по номеру, источнику и переводчику
   */
  findByNumber(
    workId: string,
    sourceId: string,
    number: number,
    translatorId: string | null
  ): Promise<Chapter | null>;
  
  /**
   * Создать главу
   */
  create(data: CreateChapterData): Promise<Chapter>;
  
  /**
   * Создать главу если не существует
   */
  findOrCreate(data: CreateChapterData): Promise<Chapter>;
  
  /**
   * Удалить главу
   */
  delete(id: string): Promise<void>;
  
  /**
   * Получить количество глав произведения
   */
  countByWorkId(workId: string): Promise<number>;
  
  /**
   * Получить последнюю главу произведения
   */
  findLatestByWorkId(workId: string): Promise<Chapter | null>;
}

