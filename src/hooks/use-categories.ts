"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";

interface CategoryFilters {
  page?: number;
  limit?: number;
  parentId?: string | null;
}

export function useCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.parentId !== undefined) params.append("parentId", filters.parentId || "null");

      const response = await apiClient.get(`/categories?${params.toString()}`);
      return response.data;
    },
  });
}

export function useTopLevelCategories() {
  return useCategories({ parentId: null, limit: 10 });
}
