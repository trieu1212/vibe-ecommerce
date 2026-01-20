import { NextRequest, NextResponse } from "next/server";
import { productRepo } from "@/server/product/repo";
import { productSerializer } from "@/server/product/serializer";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const product = await productRepo.findBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const serialized = productSerializer.serializeProduct(product);
    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}
