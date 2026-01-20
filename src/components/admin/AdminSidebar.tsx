"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useLogout } from "@/src/hooks/use-auth";
import { Button } from "@/src/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
];

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate?: () => void;
}

export function AdminSidebar({ className, onNavigate, ...props }: AdminSidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <div className={cn("flex flex-col h-full bg-slate-900 text-slate-100", className)} {...props}>
      <div className="h-14 flex items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2 font-semibold" onClick={onNavigate}>
           <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-blue-500">
              <span className="text-lg font-bold text-white">V</span>
            </div>
          <span className="text-xl font-bold">Vibe Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all outline-none",
                pathname === item.href
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
