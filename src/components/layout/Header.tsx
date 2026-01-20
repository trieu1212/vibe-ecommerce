"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Heart } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { useCartStore } from "@/src/store/cart";
import { useWishlistStore } from "@/src/store/wishlist";
import { useAuthStore } from "@/src/store/auth";
import { useLogout } from "@/src/hooks/use-auth";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.getTotalItems());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
                <Link
                  href="/products"
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  Sản phẩm
                </Link>
                <Link
                  href="/categories"
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  Danh mục
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <span className="hidden text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent sm:inline-block">
              Vibe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Danh mục
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Về chúng tôi
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.role === "ADMIN" && (
                      <>
                        <DropdownMenuItem asChild className="text-purple-600 font-medium">
                          <Link href="/admin">Admin Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Hồ sơ</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Đơn hàng</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-600 focus:text-red-700"
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Đăng ký</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
