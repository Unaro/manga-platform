import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { GenreRepositorySupabase } from "@/modules/catalog/repositories/supabase/metadata.repository";

export async function GET() {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const genreRepo = new GenreRepositorySupabase(supabase);
    const genres = await genreRepo.findAll();

    return NextResponse.json({ genres });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
