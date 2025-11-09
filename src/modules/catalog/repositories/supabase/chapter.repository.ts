import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import type {
  IChapterRepository,
  ITranslatorRepository,
  CreateChapterData,
  CreateTranslatorData,
  FindChaptersParams
} from "../chapter.repository.interface";
import type { Chapter } from "../../schemas/chapter.schema";
import type { Translator } from "../../schemas/translator.schema";

type SupabaseChapter = Database["public"]["Tables"]["chapters"]["Row"];
type SupabaseTranslator = Database["public"]["Tables"]["translators"]["Row"];

export class TranslatorRepositorySupabase implements ITranslatorRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapToDomain(row: SupabaseTranslator): Translator {
    return {
      id: row.id,
      sourceId: row.source_id,
      name: row.name,
      slug: row.slug,
      url: row.url,
      contacts: (row.contacts as Record<string, any>) ?? {},
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  async findById(id: string): Promise<Translator | null> {
    const { data, error } = await this.supabase.from("translators").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findBySlug(sourceId: string, slug: string): Promise<Translator | null> {
    const { data, error } = await this.supabase.from("translators").select("*").eq("source_id", sourceId).eq("slug", slug).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByName(sourceId: string, name: string): Promise<Translator | null> {
    const { data, error } = await this.supabase.from("translators").select("*").eq("source_id", sourceId).eq("name", name).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findBySourceId(sourceId: string): Promise<Translator[]> {
    const { data, error } = await this.supabase.from("translators").select("*").eq("source_id", sourceId).order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapToDomain(row));
  }

  async create(data: CreateTranslatorData): Promise<Translator> {
    const { data: created, error } = await this.supabase
      .from("translators")
      .insert({ source_id: data.sourceId, name: data.name, slug: data.slug, url: data.url ?? null, contacts: (data.contacts ?? {}) as any })
      .select()
      .single();
    if (error) throw new Error(`Failed to create translator: ${error.message}`);
    return this.mapToDomain(created);
  }

  async findOrCreate(data: CreateTranslatorData): Promise<Translator> {
    const existing = await this.findBySlug(data.sourceId, data.slug);
    if (existing) return existing;
    return this.create(data);
  }
}

export class ChapterRepositorySupabase implements IChapterRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapToDomain(row: SupabaseChapter): Chapter {
    return {
      id: row.id,
      workId: row.work_id,
      sourceId: row.source_id,
      translatorId: row.translator_id,
      title: row.title,
      number: Number(row.number),
      volume: row.volume,
      externalUrl: row.external_url,
      publishedAt: row.published_at ? new Date(row.published_at) : null,
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  async findById(id: string): Promise<Chapter | null> {
    const { data, error } = await this.supabase.from("chapters").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByIdWithTranslator(id: string): Promise<{ number: number; id: string; sourceId: string; createdAt: Date; title: string | null; volume: string | null; workId: string; translatorId: string | null; externalUrl: string; publishedAt: Date | null; translator: { id: string; name: string; slug: string } | null; source: { id: string; name: string; slug: string } } | null> {
    const { data, error } = await this.supabase
      .from("chapters")
      .select(`*, translators(id, name, slug), sources(id, name, slug)`)
      .eq("id", id)
      .single();
    if (error || !data) return null;
    
    const chapter = this.mapToDomain(data);
    return {
      ...chapter,
      translator: (data as any).translators ? { id: (data as any).translators.id, name: (data as any).translators.name, slug: (data as any).translators.slug } : null,
      source: { id: (data as any).sources.id, name: (data as any).sources.name, slug: (data as any).sources.slug }
    };
  }

  async findByWorkId(params: FindChaptersParams): Promise<{ chapters: Array<Chapter & { translator: { id: string; name: string; slug: string } | null; source: { id: string; name: string; slug: string } }>; total: number }> {
    let query = this.supabase
      .from("chapters")
      .select(`*, translators(id, name, slug), sources(id, name, slug)`, { count: "exact" })
      .eq("work_id", params.workId);

    if (params.sourceId) query = query.eq("source_id", params.sourceId);
    if (params.translatorId) query = query.eq("translator_id", params.translatorId);

    query = query.order("number", { ascending: true });

    if (params.page && params.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) return { chapters: [], total: 0 };

    const chapters = (data ?? []).map((row: any) => ({
      ...this.mapToDomain(row),
      translator: row.translators ? { id: row.translators.id, name: row.translators.name, slug: row.translators.slug } : null,
      source: { id: row.sources.id, name: row.sources.name, slug: row.sources.slug }
    }));

    return { chapters, total: count ?? 0 };
  }

  async findByNumber(workId: string, sourceId: string, number: number, translatorId: string | null): Promise<Chapter | null> {
    let query = this.supabase.from("chapters").select("*").eq("work_id", workId).eq("source_id", sourceId).eq("number", number);
    if (translatorId) query = query.eq("translator_id", translatorId);
    else query = query.is("translator_id", null);
    const { data, error } = await query.single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async countByWorkId(workId: string): Promise<number> {
    const { count, error } = await this.supabase.from("chapters").select("*", { count: "exact", head: true }).eq("work_id", workId);
    if (error) return 0;
    return count ?? 0;
  }

  async findLatestByWorkId(workId: string): Promise<Chapter | null> {
    const { data, error } = await this.supabase.from("chapters").select("*").eq("work_id", workId).order("number", { ascending: false }).limit(1).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async create(data: CreateChapterData): Promise<Chapter> {
    const { data: created, error } = await this.supabase
      .from("chapters")
      .insert({
        work_id: data.workId,
        source_id: data.sourceId,
        translator_id: data.translatorId ?? null,
        title: data.title ?? null,
        number: data.number,
        volume: data.volume ?? null,
        external_url: data.externalUrl,
        published_at: data.publishedAt ? data.publishedAt.toISOString() : null
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create chapter: ${error.message}`);
    return this.mapToDomain(created);
  }

  async findOrCreate(data: CreateChapterData): Promise<Chapter> {
    const existing = await this.findByNumber(data.workId, data.sourceId, data.number, data.translatorId ?? null);
    if (existing) return existing;
    return this.create(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from("chapters").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete chapter: ${error.message}`);
  }

  async deleteByWorkId(workId: string): Promise<void> {
    await this.supabase.from("chapters").delete().eq("work_id", workId);
  }
}
