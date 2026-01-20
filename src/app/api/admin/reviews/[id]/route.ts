import { NextRequest, NextResponse } from "next/server";
import { adminReviewRepo } from "@/server/admin/review/repo";
import { authService } from "@/server/auth/service";

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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await adminReviewRepo.delete(id);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
