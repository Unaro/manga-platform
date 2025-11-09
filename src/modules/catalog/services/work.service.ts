import type {
  IWorkRepository,
  IAuthorRepository,
  IGenreRepository,
  ITagRepository,
  FindManyWorksParams
} from "../repositories";
import type { Work, WorkWithRelations, WorkSummary } from "../schemas/work.schema";

export interface CreateWorkInput {
  title: string;
  slug: string;
  description?: string;
  type: "manga" | "manhwa" | "manhua";
  status: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  coverUrl?: string;
  alternativeTitles?: {
    english?: string;
    romaji?: string;
    native?: string;
  };
  authorIds?: string[];
  genreIds?: string[];
  tagIds?: string[];
  addedBy: string;
}

export interface UpdateWorkInput {
  title?: string;
  slug?: string;
  description?: string;
  type?: "manga" | "manhwa" | "manhua";
  status?: "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled";
  coverUrl?: string;
  alternativeTitles?: {
    english?: string;
    romaji?: string;
    native?: string;
  };
}

export class WorkService {
  constructor(
    private workRepo: IWorkRepository,
    private authorRepo: IAuthorRepository,
    private genreRepo: IGenreRepository,
    private tagRepo: ITagRepository
  ) {}

  async getWorkBySlug(slug: string): Promise<WorkWithRelations | null> {
    const work = await this.workRepo.findBySlug(slug);
    if (!work) return null;
    return this.workRepo.findByIdWithRelations(work.id);
  }

  async getWorkById(id: string): Promise<WorkWithRelations | null> {
    return this.workRepo.findByIdWithRelations(id);
  }

  async listWorks(params: FindManyWorksParams): Promise<{ works: WorkSummary[]; total: number }> {
    return this.workRepo.findMany(params);
  }

  async searchWorks(query: string, limit: number = 20) {
    return this.workRepo.search(query, limit);
  }

  async createWork(input: CreateWorkInput): Promise<Work> {
    const exists = await this.workRepo.existsBySlug(input.slug);
    if (exists) {
      throw new Error(`Work with slug "${input.slug}" already exists`);
    }

    const work = await this.workRepo.create({
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
      type: input.type,
      status: input.status,
      coverUrl: input.coverUrl ?? null,
      alternativeTitles: {
        english: input.alternativeTitles?.english ?? null,
        romaji: input.alternativeTitles?.romaji ?? null,
        native: input.alternativeTitles?.native ?? null
      },
      addedBy: input.addedBy
    });

    if (input.authorIds && input.authorIds.length > 0) {
      for (let i = 0; i < input.authorIds.length; i++) {
        const authorId = input.authorIds[i];
        if (authorId) {
          await this.authorRepo.linkToWork(work.id, authorId, i);
        }
      }
    }

    if (input.genreIds && input.genreIds.length > 0) {
      for (const genreId of input.genreIds) {
        if (genreId) {
          await this.genreRepo.linkToWork(work.id, genreId);
        }
      }
    }

    if (input.tagIds && input.tagIds.length > 0) {
      for (const tagId of input.tagIds) {
        if (tagId) {
          await this.tagRepo.linkToWork(work.id, tagId);
        }
      }
    }

    return work;
  }

  async updateWork(id: string, input: UpdateWorkInput): Promise<Work> {
    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined) updateData.description = input.description ?? null;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.coverUrl !== undefined) updateData.coverUrl = input.coverUrl ?? null;
    if (input.alternativeTitles !== undefined) {
      updateData.alternativeTitles = {
        english: input.alternativeTitles.english ?? null,
        romaji: input.alternativeTitles.romaji ?? null,
        native: input.alternativeTitles.native ?? null
      };
    }
    return this.workRepo.update(id, updateData);
  }

  async deleteWork(id: string): Promise<void> {
    await this.workRepo.delete(id);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.workRepo.incrementViewCount(id);
  }

  async getWorkStatistics(id: string) {
    return this.workRepo.getStatistics(id);
  }

  async linkAuthors(workId: string, authorIds: string[]): Promise<void> {
    for (let i = 0; i < authorIds.length; i++) {
      const authorId = authorIds[i];
      if (authorId) {
        await this.authorRepo.linkToWork(workId, authorId, i);
      }
    }
  }

  async unlinkAuthor(workId: string, authorId: string): Promise<void> {
    await this.authorRepo.unlinkFromWork(workId, authorId);
  }

  async linkGenres(workId: string, genreIds: string[]): Promise<void> {
    for (const genreId of genreIds) {
      if (genreId) {
        await this.genreRepo.linkToWork(workId, genreId);
      }
    }
  }

  async unlinkGenre(workId: string, genreId: string): Promise<void> {
    await this.genreRepo.unlinkFromWork(workId, genreId);
  }

  async linkTags(workId: string, tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      if (tagId) {
        await this.tagRepo.linkToWork(workId, tagId);
      }
    }
  }

  async unlinkTag(workId: string, tagId: string): Promise<void> {
    await this.tagRepo.unlinkFromWork(workId, tagId);
  }
}
