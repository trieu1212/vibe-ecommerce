import { prisma } from "@/src/lib/db";

export const reviewRepo = {
  async findByProduct(productId: string, params?: { skip?: number; take?: number }) {
    const where = {
      productId,
      parentId: null, // Only get top-level reviews
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total };
  },

  async findById(id: string) {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  },

  async create(data: {
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    parentId?: string;
  }) {
    return await prisma.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  },

  async update(id: string, data: { rating?: number; comment?: string }) {
    return await prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    return await prisma.review.delete({
      where: { id },
    });
  },

  async getProductRatingStats(productId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        parentId: null, // Only count top-level reviews
      },
      select: {
        rating: true,
      },
    });

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total > 0 ? sum / total : 0;

    // Count by rating
    const ratingCounts = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return {
      total,
      average: Math.round(average * 10) / 10,
      ratingCounts,
    };
  },
};
