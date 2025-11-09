import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { WorkRepositorySupabase } from "@/modules/catalog/repositories/supabase/work.repository";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(["manga", "manhwa", "manhua"]).optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "hiatus", "cancelled"]).optional(),
  sort: z.enum(["createdAt", "updatedAt", "title", "rating"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc")
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      sort: searchParams.get("sort") || undefined,
      order: searchParams.get("order") || undefined
    };

    const query = QuerySchema.parse(rawQuery);

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const workRepo = new WorkRepositorySupabase(supabase);
    const result = await workRepo.findMany({
      page: query.page,
      limit: query.limit,
      ...(query.type && { type: query.type }),
      ...(query.status && { status: query.status }),
      sort: query.sort,
      order: query.order
    });

    return NextResponse.json({
      works: result.works,
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
