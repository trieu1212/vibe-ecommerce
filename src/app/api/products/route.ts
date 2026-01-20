import { NextRequest, NextResponse } from "next/server";
import { productRepo } from "@/server/product/repo";
import { productSerializer } from "@/server/product/serializer";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const categoryId = searchParams.get("categoryId") || undefined;
    const search = searchParams.get("search") || undefined;
    const isFeatured = searchParams.get("isFeatured") === "true" ? true : undefined;

    const skip = (page - 1) * limit;

    const data = await productRepo.findAll({
      skip,
      take: limit,
      categoryId,
      search,
      isFeatured,
    });

    const response = productSerializer.serializeProductList(data);

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
