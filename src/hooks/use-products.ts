"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";

interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.search) params.append("search", filters.search);
      if (filters.isFeatured !== undefined) params.append("isFeatured", filters.isFeatured.toString());

      const response = await apiClient.get(`/products?${params.toString()}`);
      return response.data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useProducts({ isFeatured: true, limit: 8 });
}
