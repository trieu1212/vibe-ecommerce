import { NextRequest, NextResponse } from "next/server";
import { categoryRepo } from "@/server/category/repo";
import { categorySerializer } from "@/server/category/serializer";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const parentId = searchParams.get("parentId");

    const skip = (page - 1) * limit;

    const data = await categoryRepo.findAll({
      skip,
      take: limit,
      parentId: parentId === "null" ? null : parentId,
    });

    const response = categorySerializer.serializeCategoryList(data);

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
