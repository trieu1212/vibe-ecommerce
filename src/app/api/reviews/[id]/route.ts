import { NextRequest, NextResponse } from "next/server";
import { reviewRepo } from "@/server/review/repo";
import { authService } from "@/server/auth/service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get user from token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await authService.verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if review exists and belongs to user
    const review = await reviewRepo.findById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Only allow user to delete their own review or admin
    if (review.userId !== payload.userId && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await reviewRepo.delete(id);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}
