import { NextRequest, NextResponse } from "next/server";
import { orderRepo } from "@/server/order/repo";
import { authService } from "@/server/auth/service";

async function getUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return await authService.verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { items, shippingInfo, paymentMethod, totalAmount, shippingFee } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in order" }, { status: 400 });
        }

        const order = await orderRepo.create({
            userId: user.userId,
            items,
            shippingInfo,
            paymentMethod,
            totalAmount,
            shippingFee
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Create order error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const orders = await orderRepo.findByUserId(user.userId);
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
