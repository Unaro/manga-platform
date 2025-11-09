import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { TagRepositorySupabase } from "@/modules/catalog/repositories/supabase/metadata.repository";

export async function GET() {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const tagRepo = new TagRepositorySupabase(supabase);
    const tags = await tagRepo.findAll();

    return NextResponse.json({ tags });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
