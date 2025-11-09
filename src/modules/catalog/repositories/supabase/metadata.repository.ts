import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import type {
  IAuthorRepository,
  IGenreRepository,
  ITagRepository,
  CreateAuthorData,
  CreateGenreData,
  CreateTagData
} from "../metadata.repository.interface";
import type { Author, Genre, Tag } from "../../schemas/metadata.schema";

type SupabaseAuthor = Database["public"]["Tables"]["authors"]["Row"];
type SupabaseGenre = Database["public"]["Tables"]["genres"]["Row"];
type SupabaseTag = Database["public"]["Tables"]["tags"]["Row"];

export class AuthorRepositorySupabase implements IAuthorRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapToDomain(row: SupabaseAuthor): Author {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      bio: row.bio,
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  async findById(id: string): Promise<Author | null> {
    const { data, error } = await this.supabase.from("authors").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findBySlug(slug: string): Promise<Author | null> {
    const { data, error } = await this.supabase.from("authors").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByName(name: string): Promise<Author | null> {
    const { data, error } = await this.supabase.from("authors").select("*").eq("name", name).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findAll(): Promise<Author[]> {
    const { data, error } = await this.supabase.from("authors").select("*").order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapToDomain(row));
  }

  async findByWorkId(workId: string): Promise<Author[]> {
    const { data, error } = await this.supabase
      .from("work_authors")
      .select("authors(*)")
      .eq("work_id", workId)
      .order("order_index");
    if (error) return [];
    return (data ?? []).map((row: any) => this.mapToDomain(row.authors));
  }

  async create(data: CreateAuthorData): Promise<Author> {
    const { data: created, error } = await this.supabase
      .from("authors")
      .insert({ name: data.name, slug: data.slug, bio: data.bio ?? null })
      .select()
      .single();
    if (error) throw new Error(`Failed to create author: ${error.message}`);
    return this.mapToDomain(created);
  }

  async findOrCreate(data: CreateAuthorData): Promise<Author> {
    const existing = await this.findBySlug(data.slug);
    if (existing) return existing;
    return this.create(data);
  }

  async linkToWork(workId: string, authorId: string, order: number): Promise<void> {
    await this.supabase.from("work_authors").insert({ work_id: workId, author_id: authorId, order_index: order });
  }

  async unlinkFromWork(workId: string, authorId: string): Promise<void> {
    await this.supabase.from("work_authors").delete().eq("work_id", workId).eq("author_id", authorId);
  }
}

export class GenreRepositorySupabase implements IGenreRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapToDomain(row: SupabaseGenre): Genre {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  async findById(id: string): Promise<Genre | null> {
    const { data, error } = await this.supabase.from("genres").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findBySlug(slug: string): Promise<Genre | null> {
    const { data, error } = await this.supabase.from("genres").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByName(name: string): Promise<Genre | null> {
    const { data, error } = await this.supabase.from("genres").select("*").eq("name", name).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findAll(): Promise<Genre[]> {
    const { data, error } = await this.supabase.from("genres").select("*").order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapToDomain(row));
  }

  async findByWorkId(workId: string): Promise<Genre[]> {
    const { data, error } = await this.supabase
      .from("work_genres")
      .select("genres(*)")
      .eq("work_id", workId);
    if (error) return [];
    return (data ?? []).map((row: any) => this.mapToDomain(row.genres));
  }

  async create(data: CreateGenreData): Promise<Genre> {
    const { data: created, error } = await this.supabase
      .from("genres")
      .insert({ name: data.name, slug: data.slug, description: data.description ?? null })
      .select()
      .single();
    if (error) throw new Error(`Failed to create genre: ${error.message}`);
    return this.mapToDomain(created);
  }

  async findOrCreate(data: CreateGenreData): Promise<Genre> {
    const existing = await this.findBySlug(data.slug);
    if (existing) return existing;
    return this.create(data);
  }

  async linkToWork(workId: string, genreId: string): Promise<void> {
    await this.supabase.from("work_genres").insert({ work_id: workId, genre_id: genreId });
  }

  async unlinkFromWork(workId: string, genreId: string): Promise<void> {
    await this.supabase.from("work_genres").delete().eq("work_id", workId).eq("genre_id", genreId);
  }
}

export class TagRepositorySupabase implements ITagRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  private mapToDomain(row: SupabaseTag): Tag {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      category: row.category as "theme" | "content" | "format" | "demographic",
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    };
  }

  async findById(id: string): Promise<Tag | null> {
    const { data, error } = await this.supabase.from("tags").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const { data, error } = await this.supabase.from("tags").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findByName(name: string): Promise<Tag | null> {
    const { data, error } = await this.supabase.from("tags").select("*").eq("name", name).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async findAll(): Promise<Tag[]> {
    const { data, error } = await this.supabase.from("tags").select("*").order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapToDomain(row));
  }

  async findByCategory(category: "theme" | "content" | "format" | "demographic"): Promise<Tag[]> {
    const { data, error } = await this.supabase.from("tags").select("*").eq("category", category).order("name");
    if (error) return [];
    return (data ?? []).map(row => this.mapToDomain(row));
  }

  async findByWorkId(workId: string): Promise<Tag[]> {
    const { data, error } = await this.supabase
      .from("work_tags")
      .select("tags(*)")
      .eq("work_id", workId);
    if (error) return [];
    return (data ?? []).map((row: any) => this.mapToDomain(row.tags));
  }

  async create(data: CreateTagData): Promise<Tag> {
    const { data: created, error } = await this.supabase
      .from("tags")
      .insert({ name: data.name, slug: data.slug, description: data.description ?? null, category: data.category })
      .select()
      .single();
    if (error) throw new Error(`Failed to create tag: ${error.message}`);
    return this.mapToDomain(created);
  }

  async findOrCreate(data: CreateTagData): Promise<Tag> {
    const existing = await this.findBySlug(data.slug);
    if (existing) return existing;
    return this.create(data);
  }

  async linkToWork(workId: string, tagId: string): Promise<void> {
    await this.supabase.from("work_tags").insert({ work_id: workId, tag_id: tagId });
  }

  async unlinkFromWork(workId: string, tagId: string): Promise<void> {
    await this.supabase.from("work_tags").delete().eq("work_id", workId).eq("tag_id", tagId);
  }
}
