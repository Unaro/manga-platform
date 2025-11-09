import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { SourceRepositorySupabase } from "@/modules/catalog/repositories/supabase/source.repository";
import { z } from "zod";

const CreateSourceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  baseUrl: z.string().url(),
  apiUrl: z.string().url().optional(),
  type: z.enum(["api", "scraper", "manual"]),
  isActive: z.boolean().optional(),
  config: z.record(z.any()).optional()
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sourceRepo = new SourceRepositorySupabase(supabase);
    const sources = await sourceRepo.findAll();

    return NextResponse.json({ sources });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateSourceSchema.parse(body);

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sourceRepo = new SourceRepositorySupabase(supabase);
    const source = await sourceRepo.create({
      name: data.name,
      slug: data.slug,
      baseUrl: data.baseUrl,
      apiUrl: data.apiUrl ?? null,
      type: data.type,
      isActive: data.isActive ?? true,
      config: data.config ?? {}
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
