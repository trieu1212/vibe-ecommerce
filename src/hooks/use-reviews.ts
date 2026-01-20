"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

interface ReviewFilters {
  productId: string;
  page?: number;
  limit?: number;
}

interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
  parentId?: string;
}

export function useReviews(filters: ReviewFilters) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("productId", filters.productId);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await apiClient.get(`/reviews?${params.toString()}`);
      return response.data;
    },
  });
}

export function useProductRatingStats(productId: string) {
  return useQuery({
    queryKey: ["review-stats", productId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/stats/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const response = await apiClient.post("/reviews", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(variables.parentId ? "Đã trả lời đánh giá" : "Đã thêm đánh giá");
      queryClient.invalidateQueries({ queryKey: ["reviews", { productId: variables.productId }] });
      queryClient.invalidateQueries({ queryKey: ["review-stats", variables.productId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Không thể thêm đánh giá");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, productId }: { reviewId: string; productId: string }) => {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Đã xóa đánh giá");
      queryClient.invalidateQueries({ queryKey: ["reviews", { productId: variables.productId }] });
      queryClient.invalidateQueries({ queryKey: ["review-stats", variables.productId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Không thể xóa đánh giá");
    },
  });
}
