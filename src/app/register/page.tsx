"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/server/auth/schemas";
import { useAuthStore } from "@/src/store/auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterInput) => {
    try {
      await apiClient.post("/auth/register", data);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Redirect to login with email pre-filled
      const params = new URLSearchParams({
        email: data.email,
        registered: "true",
      });
      router.push(`/login?${params.toString()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để bắt đầu mua sắm
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
