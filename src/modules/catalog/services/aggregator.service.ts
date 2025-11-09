import type { IWorkRepository, ISourceRepository } from "../repositories";
import type { IAuthorRepository, IGenreRepository, ITagRepository } from "../repositories";
import type { IChapterRepository, ITranslatorRepository } from "../repositories";
import type { ExternalWorkData, ExternalChapterData } from "../schemas/external.schema";
import type { Work } from "../schemas/work.schema";

/**
 * Интерфейс адаптера источника
 */
export interface ISourceAdapter {
  fetchWork(externalId: string): Promise<ExternalWorkData>;
  fetchChapters(externalId: string): Promise<ExternalChapterData[]>;
  search(query: string): Promise<ExternalWorkData[]>;
}

/**
 * Сервис агрегации данных из внешних источников
 */
export class AggregatorService {
  private adapters: Map<string, ISourceAdapter> = new Map();

  constructor(
    private workRepository: IWorkRepository,
    private sourceRepository: ISourceRepository,
    private authorRepository: IAuthorRepository,
    private genreRepository: IGenreRepository,
    private tagRepository: ITagRepository,
    private chapterRepository: IChapterRepository,
    private translatorRepository: ITranslatorRepository
  ) {}

  registerAdapter(sourceSlug: string, adapter: ISourceAdapter): void {
    this.adapters.set(sourceSlug, adapter);
  }

  private getAdapter(sourceSlug: string): ISourceAdapter {
    const adapter = this.adapters.get(sourceSlug);
    if (!adapter) {
      throw new Error(`Adapter for source "${sourceSlug}" not found`);
    }
    return adapter;
  }

  async importWorkFromSource(
    sourceSlug: string,
    externalId: string,
    userId: string
  ): Promise<Work> {
    const source = await this.sourceRepository.findBySlug(sourceSlug);
    if (!source) {
      throw new Error(`Source "${sourceSlug}" not found`);
    }
    
    if (!source.isActive) {
      throw new Error(`Source "${sourceSlug}" is not active`);
    }
    
    const existing = await this.sourceRepository.findWorkSourceByExternalId(
      source.id,
      externalId
    );
    
    if (existing) {
      const work = await this.workRepository.findById(existing.workId);
      if (work) {
        return work;
      }
    }
    
    const adapter = this.getAdapter(sourceSlug);
    const externalData = await adapter.fetchWork(externalId);
    
    const work = await this.createOrUpdateWork(externalData, userId);
    
    await this.sourceRepository.createWorkSource({
      workId: work.id,
      sourceId: source.id,
      externalId: externalData.externalId,
      externalUrl: externalData.externalUrl,
      externalRating: externalData.externalRating ?? null,
      externalRatingCount: externalData.externalRatingCount ?? null,
      metadata: externalData.metadata || {}
    });
    
    if (externalData.authors && externalData.authors.length > 0) {
      await this.linkAuthors(work.id, externalData.authors);
    }
    
    if (externalData.genres && externalData.genres.length > 0) {
      await this.linkGenres(work.id, externalData.genres);
    }
    
    if (externalData.tags && externalData.tags.length > 0) {
      await this.linkTags(work.id, externalData.tags);
    }
    
    return work;
  }

  async syncWorkFromSource(
    workId: string,
    sourceId: string
  ): Promise<void> {
    const workSource = await this.sourceRepository.findWorkSource(workId, sourceId);
    if (!workSource) {
      throw new Error(`Work-Source relation not found`);
    }
    
    const source = await this.sourceRepository.findById(sourceId);
    if (!source) {
      throw new Error(`Source not found`);
    }
    
    const adapter = this.getAdapter(source.slug);
    const externalData = await adapter.fetchWork(workSource.externalId);
    
    await this.workRepository.update(workId, {
      title: externalData.title,
      description: externalData.description ?? null,
      status: externalData.status,
      coverUrl: externalData.coverUrl ?? null,
      alternativeTitles: {
        english: externalData.alternativeTitles.english ?? null,
        romaji: externalData.alternativeTitles.romaji ?? null,
        native: externalData.alternativeTitles.native ?? null
      }
    });
    
    await this.sourceRepository.updateWorkSource(workSource.id, {
      externalRating: externalData.externalRating ?? null,
      externalRatingCount: externalData.externalRatingCount ?? null,
      metadata: externalData.metadata || {}
    });
    
    await this.sourceRepository.updateSyncedAt(workSource.id);
  }

  async syncChaptersFromSource(
    workId: string,
    sourceId: string
  ): Promise<number> {
    const workSource = await this.sourceRepository.findWorkSource(workId, sourceId);
    if (!workSource) {
      throw new Error(`Work-Source relation not found`);
    }
    
    const source = await this.sourceRepository.findById(sourceId);
    if (!source) {
      throw new Error(`Source not found`);
    }
    
    const adapter = this.getAdapter(source.slug);
    const externalChapters = await adapter.fetchChapters(workSource.externalId);
    
    let newChaptersCount = 0;
    
    for (const externalChapter of externalChapters) {
      let translatorId: string | null = null;
      if (externalChapter.translatorName) {
        const translator = await this.translatorRepository.findOrCreate({
          sourceId: source.id,
          name: externalChapter.translatorName,
          slug: this.generateSlug(externalChapter.translatorName),
          url: null,
          contacts: {}
        });
        translatorId = translator.id;
      }
      
      const existing = await this.chapterRepository.findByNumber(
        workId,
        sourceId,
        externalChapter.number,
        translatorId
      );
      
      if (!existing) {
        await this.chapterRepository.create({
          workId,
          sourceId,
          translatorId,
          title: externalChapter.title ?? null,
          number: externalChapter.number,
          volume: externalChapter.volume ?? null,
          externalUrl: externalChapter.externalUrl,
          publishedAt: externalChapter.publishedAt 
            ? new Date(externalChapter.publishedAt) 
            : null
        });
        newChaptersCount++;
      }
    }
    
    return newChaptersCount;
  }

  private async createOrUpdateWork(
    data: ExternalWorkData,
    userId: string
  ): Promise<Work> {
    const slug = this.generateSlug(data.title);
    
    const existing = await this.workRepository.findBySlug(slug);
    if (existing) {
      return existing;
    }
    
    return await this.workRepository.create({
      title: data.title,
      slug,
      description: data.description ?? null,
      type: data.type,
      status: data.status,
      coverUrl: data.coverUrl ?? null,
      alternativeTitles: {
        english: data.alternativeTitles.english ?? null,
        romaji: data.alternativeTitles.romaji ?? null,
        native: data.alternativeTitles.native ?? null
      },
      addedBy: userId
    });
  }

  private async linkAuthors(workId: string, authorNames: string[]): Promise<void> {
    for (let i = 0; i < authorNames.length; i++) {
      const name = authorNames[i];
      if (!name) continue;
      
      const slug = this.generateSlug(name);
      
      const author = await this.authorRepository.findOrCreate({
        name,
        slug,
        bio: null
      });
      
      await this.authorRepository.linkToWork(workId, author.id, i);
    }
  }

  private async linkGenres(workId: string, genreNames: string[]): Promise<void> {
    for (const name of genreNames) {
      if (!name) continue;
      
      const slug = this.generateSlug(name);
      
      const genre = await this.genreRepository.findOrCreate({
        name,
        slug,
        description: null
      });
      
      await this.genreRepository.linkToWork(workId, genre.id);
    }
  }

  private async linkTags(workId: string, tagNames: string[]): Promise<void> {
    for (const name of tagNames) {
      if (!name) continue;
      
      const slug = this.generateSlug(name);
      
      const tag = await this.tagRepository.findOrCreate({
        name,
        slug,
        description: null,
        category: "format"
      });
      
      await this.tagRepository.linkToWork(workId, tag.id);
    }
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 100);
  }
}

