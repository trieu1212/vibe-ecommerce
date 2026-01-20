import { NextRequest, NextResponse } from "next/server";
import { adminCategoryRepo } from "@/server/admin/category/repo";
import { authService } from "@/server/auth/service";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

async function checkAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const payload = await authService.verifyToken(token);
    if (payload.role !== "ADMIN") return null;
    return payload;
  } catch (error) {
    return null;
  }
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const category = await adminCategoryRepo.update(id, validatedData);
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await adminCategoryRepo.softDelete(id);
    return NextResponse.json({ message: "Category soft deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
      const admin = await checkAdmin(request);
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { id } = await params;
      const category = await adminCategoryRepo.findById(id);
      
      if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

      return NextResponse.json(category);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
