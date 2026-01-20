import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Bình luận phải có ít nhất 5 ký tự"),
  parentId: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
