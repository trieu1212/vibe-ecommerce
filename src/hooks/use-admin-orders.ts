"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
      id: string;
      productId: string;
      product: {
          name: string;
          images: string;
          slug: string;
      };
      quantity: number;
      price: number;
  }>;
  user?: {
      name: string;
      email: string;
  }
}

interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useAdminOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const response = await apiClient.get(`/admin/orders?${params.toString()}`);
      return response.data;
    },
  });
}

export function useAdminOrder(id: string) {
    return useQuery({
        queryKey: ["admin-order", id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/orders/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useAdminOrderStatusUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.put(`/admin/orders/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to update status");
    }
  });
}
