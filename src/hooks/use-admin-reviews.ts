"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
  };
  product: {
      id: string;
      name: string;
      slug: string;
      images: string;
  };
}

interface ReviewFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export function useAdminReviews(filters: ReviewFilters) {
  return useQuery({
    queryKey: ["admin-reviews", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);

      const response = await apiClient.get(`/admin/reviews?${params.toString()}`);
      return response.data;
    },
  });
}

export function useAdminReviewDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/reviews/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to delete review");
    }
  });
}
