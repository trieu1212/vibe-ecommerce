"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth";
import { useCurrentUser } from "@/src/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { Mail, User as UserIcon, Calendar, Shield } from "lucide-react";
import { formatDate } from "@/src/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Hồ sơ của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
              </div>
              <Badge
                variant={user.role === "ADMIN" ? "default" : "secondary"}
                className={
                  user.role === "ADMIN"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : ""
                }
              >
                {user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin cá nhân</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và tên</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vai trò</p>
                    <p className="font-medium">
                      {user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/orders")}
              >
                Xem đơn hàng
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-muted-foreground mt-1">Đơn hàng</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-muted-foreground mt-1">Yêu thích</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">0₫</p>
              <p className="text-sm text-muted-foreground mt-1">Đã chi tiêu</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
