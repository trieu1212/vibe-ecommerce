"use client";

import { useState } from "react";
import { Star, MessageCircle, Trash2 } from "lucide-react";
import { useAuthStore } from "@/src/store/auth";
import { useReviews, useProductRatingStats, useCreateReview, useDeleteReview } from "@/src/hooks/use-reviews";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { formatDate } from "@/src/lib/utils";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const { data: reviewsData, isLoading } = useReviews({ productId, limit: 20 });
  const { data: stats } = useProductRatingStats(productId);
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;

    createReview.mutate(
      {
        productId,
        rating,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
        },
      }
    );
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyComment.trim()) return;

    createReview.mutate(
      {
        productId,
        rating: 5, // Replies don't need rating
        comment: replyComment.trim(),
        parentId,
      },
      {
        onSuccess: () => {
          setReplyComment("");
          setReplyTo(null);
        },
      }
    );
  };

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      {stats && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {stats.average.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(stats.average)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.total} đánh giá
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.ratingCounts[star as keyof typeof stats.ratingCounts];
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-8">{star} ⭐</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review */}
      {isAuthenticated ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Viết đánh giá</h3>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">Đánh giá:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này... (tối thiểu 5 ký tự)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mb-2"
            />
            {comment.trim() && comment.trim().length < 5 && (
              <p className="text-sm text-red-500 mb-2">
                Bình luận phải có ít nhất 5 ký tự
              </p>
            )}

            <Button
              onClick={handleSubmitReview}
              disabled={!comment.trim() || comment.trim().length < 5 || createReview.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {createReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Vui lòng đăng nhập để viết đánh giá
            </p>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="outline"
            >
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Đánh giá từ khách hàng ({stats?.total || 0})
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                {/* Review Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{review.user?.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(replyTo === review.id ? null : review.id)}
                      className="text-primary"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Trả lời
                    </Button>
                  )}
                  
                  {/* Delete button - only show for own reviews */}
                  {isAuthenticated && user?.id === review.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReviewToDelete(review.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteReview.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  )}
                </div>


                {/* Reply Form */}
                {replyTo === review.id && (
                  <div className="mt-4 pl-12">
                    <Textarea
                      placeholder="Viết câu trả lời..."
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(review.id)}
                        disabled={!replyComment.trim() || createReview.isPending}
                      >
                        Gửi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyTo(null);
                          setReplyComment("");
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 pl-12 space-y-4">
                    <Separator />
                    {review.replies.map((reply: any) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                            {reply.user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{reply.user?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này không? 
              Tất cả các câu trả lời sẽ bị xóa theo. 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (reviewToDelete) {
                  deleteReview.mutate({ reviewId: reviewToDelete, productId });
                  setDeleteDialogOpen(false);
                  setReviewToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa đánh giá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
