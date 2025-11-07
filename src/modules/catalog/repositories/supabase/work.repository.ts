import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type {
  IWorkRepository,
  FindManyWorksParams,
  CreateWorkData,
  UpdateWorkData,
  SearchWorksResult
} from "../work.repository.interface";
import type { Work, WorkWithRelations, WorkSummary } from "../../schemas/work.schema";

type SupabaseWork = Database["public"]["Tables"]["works"]["Row"];
type SupabaseWorkInsert = Database["public"]["Tables"]["works"]["Insert"];
type SupabaseWorkUpdate = Database["public"]["Tables"]["works"]["Update"];

const SORT_FIELD_MAP: Record<string, string> = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  title: "title",
  rating: "created_at"
};

export class WorkRepositorySupabase implements IWorkRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapToDomain(row: SupabaseWork): Work {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      type: row.type as "manga" | "manhwa" | "manhua",
      status: row.status as "upcoming" | "ongoing" | "completed" | "hiatus" | "cancelled",
      coverUrl: row.cover_url,
      alternativeTitles: {
        english: (row.alternative_titles as any)?.english ?? null,
        romaji: (row.alternative_titles as any)?.romaji ?? null,
        native: (row.alternative_titles as any)?.native ?? null
      },
      addedBy: row.added_by,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date()
    };
  }

  async findById(id: string): Promise<Work | null> {
    const { data, error } = await this.supabase.from("works").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findBySlug(slug: string): Promise<Work | null> {
    const { data, error } = await this.supabase.from("works").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByIdWithRelations(id: string): Promise<WorkWithRelations | null> {
    const { data: workData, error: workError } = await this.supabase.from("works").select("*").eq("id", id).single();
    if (workError || !workData) return null;

    const { data: authorsData } = await this.supabase
      .from("work_authors")
      .select(`order_index, authors(id, name, slug, bio)`)
      .eq("work_id", id)
      .order("order_index");

    const { data: genresData } = await this.supabase.from("work_genres").select(`genres(id, name, slug, description)`).eq("work_id", id);
    const { data: tagsData } = await this.supabase.from("work_tags").select(`tags(id, name, slug, description, category)`).eq("work_id", id);
    const { data: sourcesData } = await this.supabase
      .from("work_sources")
      .select(`id, external_id, external_url, external_rating, external_rating_count, synced_at, sources(id, name, slug, base_url)`)
      .eq("work_id", id);

    const stats = await this.getStatistics(id);
    const work = this.mapToDomain(workData);

    return {
      ...work,
      authors: authorsData?.map(a => ({ id: (a.authors as any).id, name: (a.authors as any).name, slug: (a.authors as any).slug, bio: (a.authors as any).bio, createdAt: new Date() })) ?? [],
      genres: genresData?.map(g => ({ id: (g.genres as any).id, name: (g.genres as any).name, slug: (g.genres as any).slug, description: (g.genres as any).description, createdAt: new Date() })) ?? [],
      tags: tagsData?.map(t => ({ id: (t.tags as any).id, name: (t.tags as any).name, slug: (t.tags as any).slug, description: (t.tags as any).description, category: (t.tags as any).category, createdAt: new Date() })) ?? [],
      sources: sourcesData?.map(s => ({ id: s.id, sourceName: (s.sources as any).name, sourceSlug: (s.sources as any).slug, externalId: s.external_id, externalUrl: s.external_url, externalRating: s.external_rating ?? null, externalRatingCount: s.external_rating_count ?? null, syncedAt: s.synced_at ? new Date(s.synced_at) : new Date() })) ?? [],
      statistics: { viewCount: stats?.viewCount ?? 0, ratingCount: stats?.ratingCount ?? 0, averageRating: stats?.averageRating ?? 0, bookmarkCount: stats?.bookmarkCount ?? 0, chapterCount: stats?.chapterCount ?? 0 }
    };
  }

  async findMany(params: FindManyWorksParams): Promise<{ works: WorkSummary[]; total: number }> {
    let query = this.supabase.from("works").select("*", { count: "exact" });
    if (params.type) query = query.eq("type", params.type);
    if (params.status) query = query.eq("status", params.status);

    const sortField = SORT_FIELD_MAP[params.sort ?? "createdAt"] ?? "created_at";
    const sortOrder = params.order ?? "desc";
    query = query.order(sortField, { ascending: sortOrder === "asc" });

    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(`Failed to fetch works: ${error.message}`);

    const works: WorkSummary[] = (data ?? []).map(row => ({ ...this.mapToDomain(row), statistics: { averageRating: 0, ratingCount: 0 } }));
    return { works, total: count ?? 0 };
  }

  async search(query: string, limit: number = 20): Promise<SearchWorksResult[]> {
    const { data, error } = await this.supabase.from("works").select("*").or(`title.ilike.%${query}%,slug.ilike.%${query}%`).limit(limit);
    if (error) throw new Error(`Search failed: ${error.message}`);
    return (data ?? []).map((row, index) => ({ work: { ...this.mapToDomain(row), statistics: { averageRating: 0, ratingCount: 0 } }, rank: index + 1, matchedFields: ["title"] }));
  }

  async create(data: CreateWorkData): Promise<Work> {
    const { data: created, error } = await this.supabase.from("works").insert({ title: data.title, slug: data.slug, description: data.description, type: data.type, status: data.status, cover_url: data.coverUrl, alternative_titles: data.alternativeTitles as any, added_by: data.addedBy }).select().single();
    if (error) throw new Error(`Failed to create work: ${error.message}`);
    return this.mapToDomain(created);
  }

  async update(id: string, data: UpdateWorkData): Promise<Work> {
    const updateData: SupabaseWorkUpdate = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.coverUrl !== undefined) updateData.cover_url = data.coverUrl;
    if (data.alternativeTitles !== undefined) updateData.alternative_titles = data.alternativeTitles as any;
    const { data: updated, error } = await this.supabase.from("works").update(updateData).eq("id", id).select().single();
    if (error) throw new Error(`Failed to update work: ${error.message}`);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("works").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete work: ${error.message}`);
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const { data, error } = await this.supabase.from("works").select("id").eq("slug", slug).single();
    return !error && data !== null;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.supabase.from("work_views").insert({ work_id: id, viewed_at: new Date().toISOString() });
  }

  async getStatistics(id: string): Promise<{ viewCount: number; ratingCount: number; averageRating: number; bookmarkCount: number; chapterCount: number } | null> {
    const { data, error } = await this.supabase.from("work_statistics").select("*").eq("work_id", id).single();
    if (error || !data) return { viewCount: 0, ratingCount: 0, averageRating: 0, bookmarkCount: 0, chapterCount: 0 };
    return { viewCount: data.view_count ?? 0, ratingCount: data.rating_count ?? 0, averageRating: Number(data.average_rating) || 0, bookmarkCount: 0, chapterCount: data.chapter_count ?? 0 };
  }
}
