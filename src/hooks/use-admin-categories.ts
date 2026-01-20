"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  deletedAt: string | null;
  _count: { products: number; children: number };
}

interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "deleted" | "all";
}

export function useAdminCategories(filters: CategoryFilters) {
  return useQuery({
    queryKey: ["admin-categories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);

      const response = await apiClient.get(`/admin/categories?${params.toString()}`);
      return response.data;
    },
  });
}

export function useAdminCategoryDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to delete category");
    }
  });
}

export function useAdminCategoryRestore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/admin/categories/${id}/restore`, {});
      return response.data;
    },
    onSuccess: () => {
      toast.success("Category restored successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to restore category");
    }
  });
}

export function useAdminCategory(id: string) {
    return useQuery({
        queryKey: ["admin-category", id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/categories/${id}`);
            return response.data;
        },
        enabled: !!id && id !== "new",
    });
}

export function useAdminCategoryCreate() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: any) => {
        const response = await apiClient.post(`/admin/categories`, data);
        return response.data;
      },
      onSuccess: () => {
        toast.success("Category created successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      },
      onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to create category");
      }
    });
}

export function useAdminCategoryUpdate() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        const response = await apiClient.put(`/admin/categories/${id}`, data);
        return response.data;
      },
      onSuccess: () => {
        toast.success("Category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        queryClient.invalidateQueries({ queryKey: ["admin-category"] });
      },
      onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to update category");
      }
    });
}
