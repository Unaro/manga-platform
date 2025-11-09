import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { SourceRepositorySupabase } from "@/modules/catalog/repositories/supabase/source.repository";

export async function GET() {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const sourceRepo = new SourceRepositorySupabase(supabase);
    const sources = await sourceRepo.findAllActive();

    return NextResponse.json({ sources });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
