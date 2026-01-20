import { NextRequest, NextResponse } from "next/server";
import { adminProductRepo } from "@/server/admin/product/repo";
import { authService } from "@/server/auth/service";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  comparePrice: z.number().optional().nullable(),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// Middleware helper to check admin role
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

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const status = (searchParams.get("status") as "active" | "deleted" | "all") || "all";
    const categoryId = searchParams.get("categoryId") || undefined;

    const result = await adminProductRepo.findAll({
      page,
      limit,
      search,
      status,
      categoryId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);

    const product = await adminProductRepo.create({
      ...validatedData,
      slug,
      images: JSON.stringify(validatedData.images),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as z.ZodError).issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
