import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/auth/with-auth";
import { WorkRepositorySupabase } from "@/modules/catalog/repositories/supabase/work.repository";
import { z } from "zod";

const UpdateWorkSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  type: z.enum(["manga", "manhwa", "manhua"]).optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "hiatus", "cancelled"]).optional(),
  coverUrl: z.string().url().optional(),
  alternativeTitles: z.object({
    english: z.string().optional(),
    romaji: z.string().optional(),
    native: z.string().optional()
  }).optional()
});

export const GET = withPermission("catalog:read", async (request, context, { supabase }) => {
  try {
    const { id } = await context.params;

    const workRepo = new WorkRepositorySupabase(supabase as any);
    const work = await workRepo.findById(id);

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    return NextResponse.json({ work });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
});

export const PUT = withPermission("catalog:write", async (request, context, { supabase }) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = UpdateWorkSchema.parse(body);

    const workRepo = new WorkRepositorySupabase(supabase as any);

    const updateData: any = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.slug !== undefined) updateData.slug = validated.slug;
    if (validated.description !== undefined) updateData.description = validated.description ?? null;
    if (validated.type !== undefined) updateData.type = validated.type;
    if (validated.status !== undefined) updateData.status = validated.status;
    if (validated.coverUrl !== undefined) updateData.coverUrl = validated.coverUrl ?? null;
    if (validated.alternativeTitles !== undefined) {
      updateData.alternativeTitles = {
        english: validated.alternativeTitles.english ?? null,
        romaji: validated.alternativeTitles.romaji ?? null,
        native: validated.alternativeTitles.native ?? null
      };
    }

    const work = await workRepo.update(id, updateData);

    return NextResponse.json({ work });
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
});

export const DELETE = withPermission("catalog:delete", async (request, context, { supabase }) => {
  try {
    const { id } = await context.params;

    const workRepo = new WorkRepositorySupabase(supabase as any);
    await workRepo.delete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
});
