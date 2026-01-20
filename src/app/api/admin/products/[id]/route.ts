import { NextRequest, NextResponse } from "next/server";
import { adminProductRepo } from "@/server/admin/product/repo";
import { authService } from "@/server/auth/service";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  comparePrice: z.number().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  images: z.array(z.string()).min(1).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
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
    const validatedData = updateProductSchema.parse(body);

    const updateData: any = { ...validatedData };
    if (validatedData.images) {
      updateData.images = JSON.stringify(validatedData.images);
    }
    
    // If name changed, optionally update slug? usually we don't to keep urls stable.

    const product = await adminProductRepo.update(id, updateData);
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    
    // Check if hard delete query param exists
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    // Currently only supporting soft delete in repo
    // If hard delete is needed, we should add delete method to repo
    
    await adminProductRepo.softDelete(id);
    return NextResponse.json({ message: "Product soft deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
      const admin = await checkAdmin(request);
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { id } = await params;
      const product = await adminProductRepo.findById(id);
      
      if (!product) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json(product);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
