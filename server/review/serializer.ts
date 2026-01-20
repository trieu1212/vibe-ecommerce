export const reviewSerializer = {
  serializeReview(review: any) {
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      user: review.user
        ? {
            id: review.user.id,
            name: review.user.name,
            avatar: review.user.avatar,
          }
        : null,
      rating: review.rating,
      comment: review.comment,
      parentId: review.parentId,
      replies: review.replies
        ? review.replies.map((reply: any) => this.serializeReview(reply))
        : [],
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  },

  serializeReviews(reviews: any[]) {
    return reviews.map((review) => this.serializeReview(review));
  },

  serializeReviewList(data: { reviews: any[]; total: number }) {
    return {
      reviews: this.serializeReviews(data.reviews),
      total: data.total,
    };
  },

  serializeRatingStats(stats: any) {
    return {
      total: stats.total,
      average: stats.average,
      ratingCounts: stats.ratingCounts,
    };
  },
};
