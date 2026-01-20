"use client";

import { useAuthStore } from "@/src/store/auth";
import { useLogout } from "@/src/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Menu, LogOut, Home, User, Bell } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "./AdminSidebar";
import { useState } from "react";

export function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[240px] border-none bg-slate-900 text-white">
            <AdminSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        {/* Breadcrumbs or Page Title could go here */}
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild title="View Store">
            <Link href="/">
                <Home className="h-5 w-5" />
            </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
