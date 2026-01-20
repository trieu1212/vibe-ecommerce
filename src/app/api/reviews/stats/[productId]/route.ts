import { NextRequest, NextResponse } from "next/server";
import { reviewRepo } from "@/server/review/repo";
import { reviewSerializer } from "@/server/review/serializer";

interface RouteParams {
  params: Promise<{ productId: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { productId } = await params;
    const stats = await reviewRepo.getProductRatingStats(productId);
    const serialized = reviewSerializer.serializeRatingStats(stats);
    
    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}
