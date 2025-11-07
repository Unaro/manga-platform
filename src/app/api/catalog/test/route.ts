import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { WorkRepositorySupabase } from "@/modules/catalog/repositories/supabase/work.repository";
import { SourceRepositorySupabase } from "@/modules/catalog/repositories/supabase/source.repository";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    
    const workRepo = new WorkRepositorySupabase(supabase);
    const sourceRepo = new SourceRepositorySupabase(supabase);

    const sources = await sourceRepo.findAll();
    const works = await workRepo.findMany({ page: 1, limit: 5 });

    return NextResponse.json({
      status: "ok",
      repositories: "working",
      sources: sources.map(s => ({ id: s.id, name: s.name, slug: s.slug })),
      works: {
        total: works.total,
        items: works.works.map(w => ({ id: w.id, title: w.title, slug: w.slug }))
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
