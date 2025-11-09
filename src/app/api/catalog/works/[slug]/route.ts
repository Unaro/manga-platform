import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { WorkRepositorySupabase } from "@/modules/catalog/repositories/supabase/work.repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
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

    const workWithRelations = await workRepo.findByIdWithRelations(work.id);
    const statistics = await workRepo.getStatistics(work.id);

    await workRepo.incrementViewCount(work.id);

    return NextResponse.json({
      work: workWithRelations,
      statistics
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
