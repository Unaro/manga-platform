import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import type {
  ISourceRepository,
  CreateSourceData,
  CreateWorkSourceData,
  UpdateWorkSourceData
} from "../source.repository.interface";
import type { Source, WorkSource } from "../../schemas/source.schema";

type SupabaseSource = Database["public"]["Tables"]["sources"]["Row"];
type SupabaseWorkSource = Database["public"]["Tables"]["work_sources"]["Row"];

export class SourceRepositorySupabase implements ISourceRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapSourceToDomain(row: SupabaseSource): Source {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      baseUrl: row.base_url,
      apiUrl: row.api_url,
      type: row.type as "api" | "scraper" | "manual",
      isActive: row.is_active ?? true,
      config: (row.config as Record<string, any>) ?? {},
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  private mapWorkSourceToDomain(row: SupabaseWorkSource): WorkSource {
    return {
      id: row.id,
      workId: row.work_id,
      sourceId: row.source_id,
      externalId: row.external_id,
      externalUrl: row.external_url,
      externalRating: row.external_rating ?? null,
      externalRatingCount: row.external_rating_count ?? null,
      metadata: (row.metadata as Record<string, any>) ?? {},
      syncedAt: row.synced_at ? new Date(row.synced_at) : new Date(),
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  async findById(id: string): Promise<Source | null> {
    const { data, error } = await this.supabase.from("sources").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapSourceToDomain(data);
  }

  async findBySlug(slug: string): Promise<Source | null> {
    const { data, error } = await this.supabase.from("sources").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return this.mapSourceToDomain(data);
  }

  async findAll(): Promise<Source[]> {
    const { data, error } = await this.supabase.from("sources").select("*").order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapSourceToDomain(row));
  }

  async findActive(): Promise<Source[]> {
    const { data, error } = await this.supabase.from("sources").select("*").eq("is_active", true).order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapSourceToDomain(row));
  }

  async findAllActive(): Promise<Source[]> {
    return this.findActive();
  }

  async create(data: CreateSourceData): Promise<Source> {
    const { data: created, error } = await this.supabase
      .from("sources")
      .insert({
        name: data.name,
        slug: data.slug,
        base_url: data.baseUrl,
        api_url: data.apiUrl ?? null,
        type: data.type,
        is_active: data.isActive ?? true,
        config: (data.config ?? {}) as any
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create source: ${error.message}`);
    return this.mapSourceToDomain(created);
  }

  async update(id: string, data: Partial<CreateSourceData>): Promise<Source> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.baseUrl !== undefined) updateData.base_url = data.baseUrl;
    if (data.apiUrl !== undefined) updateData.api_url = data.apiUrl;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;
    if (data.config !== undefined) updateData.config = data.config as any;

    const { data: updated, error } = await this.supabase
      .from("sources")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update source: ${error.message}`);
    return this.mapSourceToDomain(updated);
  }

  async findWorkSource(workId: string, sourceId: string): Promise<WorkSource | null> {
    const { data, error } = await this.supabase
      .from("work_sources")
      .select("*")
      .eq("work_id", workId)
      .eq("source_id", sourceId)
      .single();
    if (error || !data) return null;
    return this.mapWorkSourceToDomain(data);
  }

  async findWorkSourceByExternalId(sourceId: string, externalId: string): Promise<WorkSource | null> {
    const { data, error } = await this.supabase
      .from("work_sources")
      .select("*")
      .eq("source_id", sourceId)
      .eq("external_id", externalId)
      .single();
    if (error || !data) return null;
    return this.mapWorkSourceToDomain(data);
  }

  async findWorkSourcesByWorkId(workId: string): Promise<Array<WorkSource & { source: { id: string; name: string; slug: string; baseUrl: string } }>> {
    const { data, error } = await this.supabase
      .from("work_sources")
      .select(`*, sources(id, name, slug, base_url)`)
      .eq("work_id", workId);
    if (error) return [];
    return (data ?? []).map((row: any) => ({
      ...this.mapWorkSourceToDomain(row),
      source: {
        id: row.sources.id,
        name: row.sources.name,
        slug: row.sources.slug,
        baseUrl: row.sources.base_url
      }
    }));
  }

  async createWorkSource(data: CreateWorkSourceData): Promise<WorkSource> {
    const { data: created, error } = await this.supabase
      .from("work_sources")
      .insert({
        work_id: data.workId,
        source_id: data.sourceId,
        external_id: data.externalId,
        external_url: data.externalUrl,
        external_rating: data.externalRating ?? null,
        external_rating_count: data.externalRatingCount ?? null,
        metadata: (data.metadata ?? {}) as any
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create work source: ${error.message}`);
    return this.mapWorkSourceToDomain(created);
  }

  async updateWorkSource(id: string, data: UpdateWorkSourceData): Promise<WorkSource> {
    const updateData: any = {};
    if (data.externalRating !== undefined) updateData.external_rating = data.externalRating;
    if (data.externalRatingCount !== undefined) updateData.external_rating_count = data.externalRatingCount;
    if (data.metadata !== undefined) updateData.metadata = data.metadata as any;
    const { data: updated, error } = await this.supabase
      .from("work_sources")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update work source: ${error.message}`);
    return this.mapWorkSourceToDomain(updated);
  }

  async updateSyncedAt(id: string): Promise<void> {
    await this.supabase.from("work_sources").update({ synced_at: new Date().toISOString() }).eq("id", id);
  }

  async deleteWorkSource(id: string): Promise<void> {
    const { error } = await this.supabase.from("work_sources").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete work source: ${error.message}`);
  }
}
