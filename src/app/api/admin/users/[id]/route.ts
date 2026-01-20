import { NextRequest, NextResponse } from "next/server";
import { adminUserRepo } from "@/server/admin/user/repo";
import { authService } from "@/server/auth/service";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
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
    const validatedData = updateUserSchema.parse(body);

    // Prevent removing own admin status if unique? (Not handling for now, assume careful usage)

    const user = await adminUserRepo.update(id, validatedData);
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    
    // Prevent deleting self
    if (admin.userId === id) {
        return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await adminUserRepo.softDelete(id);
    return NextResponse.json({ message: "User soft deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
      const admin = await checkAdmin(request);
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { id } = await params;
      const user = await adminUserRepo.findById(id);
      
      if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

      return NextResponse.json(user);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
