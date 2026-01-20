"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";

export interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Array<{
        id: string;
        amount: number;
        customer: {
            name: string;
            email: string;
        }
    }>;
    charts: {
        revenue: Array<{ name: string; total: number }>;
        status: Array<{ name: string; value: number }>;
    }
}

export function useAdminDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
        const response = await apiClient.get("/admin/dashboard");
        return response.data;
    }
  });
}
