import { NextRequest, NextResponse } from "next/server";
import { reviewRepo } from "@/server/review/repo";
import { reviewSerializer } from "@/server/review/serializer";
import { createReviewSchema } from "@/server/review/schemas";
import { authService } from "@/server/auth/service";

// GET /api/reviews?productId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const data = await reviewRepo.findByProduct(productId, { skip, take: limit });
    const response = reviewSerializer.serializeReviewList(data);

    return NextResponse.json({
      ...response,
      page,
      limit,
      totalPages: Math.ceil(data.total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await authService.verifyToken(token);
    if (!payload) {
      console.log("Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    console.log("User ID from token:", payload.userId);

    const validatedData = createReviewSchema.parse(body);
    console.log("Validated data:", validatedData);

    const review = await reviewRepo.create({
      ...validatedData,
      userId: payload.userId,
    });

    const serialized = reviewSerializer.serializeReview(review);
    return NextResponse.json(serialized, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    
    if (error.name === "ZodError") {
      console.log("Validation errors:", error.errors);
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}
