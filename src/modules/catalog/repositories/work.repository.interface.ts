import type { Work, WorkWithRelations, WorkSummary } from "../schemas/work.schema";

/**
 * Параметры для поиска произведений
 */
export interface FindManyWorksParams {
  /** Номер страницы */
  page: number;
  /** Количество элементов на страницу */
  limit: number;
  /** Поле для сортировки */
  sort?: "title" | "rating" | "createdAt" | "updatedAt";
  /** Порядок сортировки */
  order?: "asc" | "desc";
  /** Фильтр по типу */
  type?: "manga" | "manhwa" | "manhua";
  /** Фильтр по статусу */
  status?: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  /** Фильтр по жанрам (ID жанров) */
  genreIds?: string[];
  /** Фильтр по тегам (ID тегов) */
  tagIds?: string[];
  /** Фильтр по источнику (ID источника) */
  sourceId?: string;
}

/**
 * Результат поиска произведений
 */
export interface SearchWorksResult {
  work: WorkSummary;
  rank: number;
  matchedFields: string[];
}

/**
 * Данные для создания произведения
 */
export interface CreateWorkData {
  title: string;
  slug: string;
  description: string | null;
  type: "manga" | "manhwa" | "manhua";
  status: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  coverUrl: string | null;
  alternativeTitles: {
    english: string | null;
    romaji: string | null;
    native: string | null;
  };
  addedBy: string;
}

/**
 * Данные для обновления произведения
 */
export interface UpdateWorkData {
  title?: string;
  slug?: string;
  description?: string | null;
  type?: "manga" | "manhwa" | "manhua";
  status?: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  coverUrl?: string | null;
  alternativeTitles?: {
    english?: string | null;
    romaji?: string | null;
    native?: string | null;
  };
}

/**
 * Интерфейс репозитория для работы с произведениями
 */
export interface IWorkRepository {
  /**
   * Найти произведение по ID
   */
  findById(id: string): Promise<Work | null>;
  
  /**
   * Найти произведение по slug
   */
  findBySlug(slug: string): Promise<Work | null>;
  
  /**
   * Найти произведение с полной информацией (включая связи)
   */
  findByIdWithRelations(id: string): Promise<WorkWithRelations | null>;
  
  /**
   * Найти множество произведений с пагинацией и фильтрами
   */
  findMany(params: FindManyWorksParams): Promise<{
    works: WorkSummary[];
    total: number;
  }>;
  
  /**
   * Поиск произведений по названию (full-text search)
   */
  search(query: string, limit?: number): Promise<SearchWorksResult[]>;
  
  /**
   * Создать произведение
   */
  create(data: CreateWorkData): Promise<Work>;
  
  /**
   * Обновить произведение
   */
  update(id: string, data: UpdateWorkData): Promise<Work>;
  
  /**
   * Удалить произведение
   */
  delete(id: string): Promise<void>;
  
  /**
   * Проверить существование произведения по slug
   */
  existsBySlug(slug: string): Promise<boolean>;
  
  /**
   * Увеличить счетчик просмотров
   */
  incrementViewCount(id: string): Promise<void>;
  
  /**
   * Получить статистику произведения
   */
  getStatistics(id: string): Promise<{
    viewCount: number;
    ratingCount: number;
    averageRating: number;
    bookmarkCount: number;
    chapterCount: number;
  } | null>;
}

