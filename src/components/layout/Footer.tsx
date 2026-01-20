"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <span className="text-xl font-bold text-white">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Vibe
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Trải nghiệm mua sắm trực tuyến cao cấp với thiết kế hiện đại và dịch vụ tuyệt vời.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Đổi trả hàng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Đăng ký nhận tin</h3>
            <p className="text-sm text-muted-foreground">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="bg-white"
              />
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Vibe E-commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
