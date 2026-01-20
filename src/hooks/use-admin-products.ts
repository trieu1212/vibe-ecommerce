"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: { id: string; name: string };
  deletedAt: string | null;
  createdAt: string;
}

interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "deleted" | "all";
}

export function useAdminProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const response = await apiClient.get(`/admin/products?${params.toString()}`);
      return response.data;
    },
  });
}

export function useAdminProductDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to delete product");
    }
  });
}

export function useAdminProductRestore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/admin/products/${id}/restore`, {});
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product restored successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to restore product");
    }
  });
}

export function useAdminProduct(id: string) {
    return useQuery({
        queryKey: ["admin-product", id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/products/${id}`);
            return response.data;
        },
        enabled: !!id && id !== "new",
    });
}

export function useAdminProductCreate() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: any) => {
        const response = await apiClient.post(`/admin/products`, data);
        return response.data;
      },
      onSuccess: () => {
        toast.success("Product created successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      },
      onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to create product");
      }
    });
}

export function useAdminProductUpdate() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        const response = await apiClient.put(`/admin/products/${id}`, data);
        return response.data;
      },
      onSuccess: () => {
        toast.success("Product updated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      },
      onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to update product");
      }
    });
}
