import { NextRequest, NextResponse } from "next/server";
import { adminDashboardRepo } from "@/server/admin/dashboard/repo";
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

    const stats = await adminDashboardRepo.getStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
