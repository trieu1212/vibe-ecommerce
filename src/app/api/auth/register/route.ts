import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/server/auth/schemas";
import { authService } from "@/server/auth/service";
import { authSerializer } from "@/server/auth/serializer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Register user
    const { user, token } = await authService.register(validatedData);
    
    // Serialize response
    const response = authSerializer.serializeAuthResponse(user, token);
    
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi" },
      { status: 400 }
    );
  }
}
