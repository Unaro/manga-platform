import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/database/types";
import { SourceRepositorySupabase } from "@/modules/catalog/repositories/supabase/source.repository";
import type { CreateSourceData } from "@/modules/catalog/repositories/source.repository.interface";
import { z } from "zod";

const UpdateSourceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  baseUrl: z.string().url().optional(),
  apiUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
  config: z.record(z.any()).optional()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = UpdateSourceSchema.parse(body);

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData: Partial<CreateSourceData> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.baseUrl !== undefined) updateData.baseUrl = validated.baseUrl;
    if (validated.apiUrl !== undefined) updateData.apiUrl = validated.apiUrl ?? null;
    if (validated.isActive !== undefined) updateData.isActive = validated.isActive;
    if (validated.config !== undefined) updateData.config = validated.config;

    const sourceRepo = new SourceRepositorySupabase(supabase);
    const source = await sourceRepo.update(id, updateData);

    return NextResponse.json({ source });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
