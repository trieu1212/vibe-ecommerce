import { NextRequest, NextResponse } from "next/server";
import { adminOrderRepo } from "@/server/admin/order/repo";
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

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || undefined;

    const result = await adminOrderRepo.findAll({ page, limit, status, search });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Admin Orders API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
