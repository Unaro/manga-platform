import { NextRequest, NextResponse } from "next/server";
import { withPermission } from "@/lib/auth/with-auth";
import { WorkRepositorySupabase } from "@/modules/catalog/repositories/supabase/work.repository";
import { z } from "zod";

const CreateWorkSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["manga", "manhwa", "manhua"]),
  status: z.enum(["upcoming", "ongoing", "completed", "hiatus", "cancelled"]),
  coverUrl: z.string().url().optional(),
  alternativeTitles: z.object({
    english: z.string().optional(),
    romaji: z.string().optional(),
    native: z.string().optional()
  }).optional()
});

export const POST = withPermission("catalog:write", async (request, context, { user, supabase }) => {
  try {
    const body = await request.json();
    const data = CreateWorkSchema.parse(body);

    const workRepo = new WorkRepositorySupabase(supabase as any);
    
    const exists = await workRepo.existsBySlug(data.slug);
    if (exists) {
      return NextResponse.json(
        { error: "Work with this slug already exists" },
        { status: 409 }
      );
    }

    const work = await workRepo.create({
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      type: data.type,
      status: data.status,
      coverUrl: data.coverUrl ?? null,
      alternativeTitles: {
        english: data.alternativeTitles?.english ?? null,
        romaji: data.alternativeTitles?.romaji ?? null,
        native: data.alternativeTitles?.native ?? null
      },
      addedBy: user.id
    });

    return NextResponse.json({ work }, { status: 201 });
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
