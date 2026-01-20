import { NextRequest, NextResponse } from "next/server";
import { categoryRepo } from "@/server/category/repo";
import { categorySerializer } from "@/server/category/serializer";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const category = await categoryRepo.findBySlug(slug);

    if (!category) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    const serialized = categorySerializer.serializeCategory(category);
    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}
