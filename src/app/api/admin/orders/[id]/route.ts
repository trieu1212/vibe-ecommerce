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

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
      const admin = await checkAdmin(request);
      if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { id } = await params;
      const order = await adminOrderRepo.findById(id);
      
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

      return NextResponse.json(order);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    if (!status) return NextResponse.json({ error: "Status is required" }, { status: 400 });

    const updatedOrder = await adminOrderRepo.updateStatus(id, status);
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
