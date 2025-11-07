import type { IWorkRepository } from "../repositories";
import type { ISourceRepository } from "../repositories";
import type { IAuthorRepository, IGenreRepository, ITagRepository } from "../repositories";
import type { Work, WorkWithRelations, WorkSummary } from "../schemas/work.schema";
import type { GetWorksQuery, SearchWorksQuery, CreateWorkInput, UpdateWorkInput } from "../schemas/dto.schema";
import type { Pagination } from "../schemas/dto.schema";
import type { FindManyWorksParams } from "../repositories/work.repository.interface";

export interface GetWorksResult {
  data: WorkSummary[];
  pagination: Pagination;
}

export interface SearchWorksResult {
  data: Array<{
    work: WorkSummary;
    rank: number;
    matchedFields: string[];
  }>;
}

export class WorkService {
  constructor(
    private workRepository: IWorkRepository,
    private sourceRepository: ISourceRepository,
    private authorRepository: IAuthorRepository,
    private genreRepository: IGenreRepository,
    private tagRepository: ITagRepository
  ) {}

  async getWorks(query: GetWorksQuery): Promise<GetWorksResult> {
    const { page, limit, sort, order, type, status, genres, tags, source } = query;
    
    let genreIds: string[] | undefined;
    let tagIds: string[] | undefined;
    let sourceId: string | undefined;
    
    if (genres && genres.length > 0) {
      const genreEntities = await Promise.all(
        genres.map(slug => this.genreRepository.findBySlug(slug))
      );
      genreIds = genreEntities.filter(g => g !== null).map(g => g!.id);
    }
    
    if (tags && tags.length > 0) {
      const tagEntities = await Promise.all(
        tags.map(slug => this.tagRepository.findBySlug(slug))
      );
      tagIds = tagEntities.filter(t => t !== null).map(t => t!.id);
    }
    
    if (source) {
      const sourceEntity = await this.sourceRepository.findBySlug(source);
      sourceId = sourceEntity?.id;
    }
    
    const params: FindManyWorksParams = {
      page,
      limit,
      sort,
      order
    };
    
    if (type) params.type = type;
    if (status) params.status = status;
    if (genreIds) params.genreIds = genreIds;
    if (tagIds) params.tagIds = tagIds;
    if (sourceId) params.sourceId = sourceId;
    
    const { works, total } = await this.workRepository.findMany(params);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: works,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  async getWorkById(id: string): Promise<WorkWithRelations | null> {
    const work = await this.workRepository.findByIdWithRelations(id);
    
    if (work) {
      this.workRepository.incrementViewCount(id).catch(err => {
        console.error(`Failed to increment view count for work ${id}:`, err);
      });
    }
    
    return work;
  }

  async getWorkBySlug(slug: string): Promise<Work | null> {
    return await this.workRepository.findBySlug(slug);
  }

  async searchWorks(query: SearchWorksQuery): Promise<SearchWorksResult> {
    const { q, limit = 20 } = query;
    
    const results = await this.workRepository.search(q, limit);
    
    return {
      data: results
    };
  }

  async createWork(
    input: CreateWorkInput,
    userId: string
  ): Promise<Work> {
    const slug = this.generateSlug(input.title);
    
    const exists = await this.workRepository.existsBySlug(slug);
    if (exists) {
      throw new Error(`Work with slug "${slug}" already exists`);
    }
    
    const work = await this.workRepository.create({
      title: input.title,
      slug,
      description: input.description ?? null,
      type: input.type,
      status: input.status,
      coverUrl: input.coverUrl ?? null,
      alternativeTitles: {
        english: input.alternativeTitles?.english ?? null,
        romaji: input.alternativeTitles?.romaji ?? null,
        native: input.alternativeTitles?.native ?? null
      },
      addedBy: userId
    });
    
    if (input.authorIds && input.authorIds.length > 0) {
      await Promise.all(
        input.authorIds.map((authorId, index) =>
          this.authorRepository.linkToWork(work.id, authorId, index)
        )
      );
    }
    
    if (input.genreIds && input.genreIds.length > 0) {
      await Promise.all(
        input.genreIds.map(genreId =>
          this.genreRepository.linkToWork(work.id, genreId)
        )
      );
    }
    
    if (input.tagIds && input.tagIds.length > 0) {
      await Promise.all(
        input.tagIds.map(tagId =>
          this.tagRepository.linkToWork(work.id, tagId)
        )
      );
    }
    
    return work;
  }

  async updateWork(
    id: string,
    input: UpdateWorkInput
  ): Promise<Work> {
    const updateData: any = {};
    
    if (input.title !== undefined) {
      updateData.title = input.title;
      updateData.slug = this.generateSlug(input.title);
      
      const existing = await this.workRepository.findBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Work with slug "${updateData.slug}" already exists`);
      }
    }
    
    if (input.description !== undefined) updateData.description = input.description;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.coverUrl !== undefined) updateData.coverUrl = input.coverUrl;
    if (input.alternativeTitles !== undefined) {
      updateData.alternativeTitles = input.alternativeTitles;
    }
    
    return await this.workRepository.update(id, updateData);
  }

  async deleteWork(id: string): Promise<void> {
    await this.workRepository.delete(id);
  }

  async getWorkStatistics(id: string) {
    return await this.workRepository.getStatistics(id);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 100);
  }
}

