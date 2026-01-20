import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/auth/service";
import { authSerializer } from "@/server/auth/serializer";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const user = await authService.getCurrentUser(token);
    const serializedUser = authSerializer.serializeUser(user);
    
    return NextResponse.json(serializedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 401 }
    );
  }
}
