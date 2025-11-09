import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { WorkRepositorySupabase } from "@/modules/catalog/repositories/supabase/work.repository";
import { ChapterRepositorySupabase } from "@/modules/catalog/repositories/supabase/chapter.repository";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sourceId: z.string().uuid().optional(),
  translatorId: z.string().uuid().optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc")
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      sourceId: searchParams.get("sourceId") || undefined,
      translatorId: searchParams.get("translatorId") || undefined,
      order: searchParams.get("order") || undefined
    };
    
    const query = QuerySchema.parse(rawQuery);

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const workRepo = new WorkRepositorySupabase(supabase);
    const work = await workRepo.findBySlug(slug);

    if (!work) {
      return NextResponse.json(
        { error: "Work not found" },
        { status: 404 }
      );
    }

    const chapterRepo = new ChapterRepositorySupabase(supabase);
    const result = await chapterRepo.findByWorkId({
      workId: work.id,
      page: query.page,
      limit: query.limit,
      order: query.order,
      ...(query.sourceId && { sourceId: query.sourceId }),
      ...(query.translatorId && { translatorId: query.translatorId })
    });

    return NextResponse.json({
      chapters: result.chapters,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit)
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
