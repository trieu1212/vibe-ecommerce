"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Remove isLoading as it's not in AuthState
  const { user, isAuthenticated } = useAuthStore(); 
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Basic client-side protection
    if (isClient) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [isClient, isAuthenticated, user, router]);

  // Prevent flash of unstyled content or unauthorized content
  if (!isClient) {
     return null; 
  }

  // Double check before rendering children
  if (!isAuthenticated || user?.role !== "ADMIN") {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[260px_1fr]">
      <div className="hidden border-r bg-slate-900 lg:block dark:bg-gray-800/40">
        <AdminSidebar />
      </div>
      <div className="flex flex-col bg-gray-50/50 min-h-screen">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
