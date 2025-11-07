import type { Source, WorkSource, WorkSourceWithSource } from "../schemas/source.schema";

/**
 * Данные для создания источника
 */
export interface CreateSourceData {
  name: string;
  slug: string;
  baseUrl: string;
  apiUrl: string | null;
  type: "api" | "scraper" | "manual";
  isActive: boolean;
  config: Record<string, unknown>;
}

/**
 * Данные для создания связи Work-Source
 */
export interface CreateWorkSourceData {
  workId: string;
  sourceId: string;
  externalId: string;
  externalUrl: string;
  externalRating: number | null;
  externalRatingCount: number | null;
  metadata: Record<string, unknown>;
}

/**
 * Данные для обновления связи Work-Source
 */
export interface UpdateWorkSourceData {
  externalRating?: number | null;
  externalRatingCount?: number | null;
  metadata?: Record<string, unknown>;
}

/**
 * Интерфейс репозитория для работы с источниками
 */
export interface ISourceRepository {
  /**
   * Найти источник по ID
   */
  findById(id: string): Promise<Source | null>;
  
  /**
   * Найти источник по slug
   */
  findBySlug(slug: string): Promise<Source | null>;
  
  /**
   * Получить все активные источники
   */
  findAllActive(): Promise<Source[]>;
  
  /**
   * Создать источник
   */
  create(data: CreateSourceData): Promise<Source>;
  
  /**
   * Обновить источник
   */
  update(id: string, data: Partial<CreateSourceData>): Promise<Source>;
  
  /**
   * Найти связь Work-Source по workId и sourceId
   */
  findWorkSource(workId: string, sourceId: string): Promise<WorkSource | null>;
  
  /**
   * Найти связь Work-Source по sourceId и externalId
   */
  findWorkSourceByExternalId(sourceId: string, externalId: string): Promise<WorkSource | null>;
  
  /**
   * Получить все источники для произведения
   */
  findWorkSourcesByWorkId(workId: string): Promise<WorkSourceWithSource[]>;
  
  /**
   * Создать связь Work-Source
   */
  createWorkSource(data: CreateWorkSourceData): Promise<WorkSource>;
  
  /**
   * Обновить связь Work-Source
   */
  updateWorkSource(id: string, data: UpdateWorkSourceData): Promise<WorkSource>;
  
  /**
   * Удалить связь Work-Source
   */
  deleteWorkSource(id: string): Promise<void>;
  
  /**
   * Обновить timestamp синхронизации
   */
  updateSyncedAt(id: string): Promise<void>;
}

