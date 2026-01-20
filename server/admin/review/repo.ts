import { prisma } from "@/src/lib/db";
import { Prisma } from "@prisma/client";

export const adminReviewRepo = {
  async findAll({
    page = 1,
    limit = 20,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (search) {
      where.OR = [
        { comment: { contains: search } },
        { user: { name: { contains: search } } },
        { product: { name: { contains: search } } },
      ];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          product: { select: { id: true, name: true, slug: true, images: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async delete(id: string) {
    return prisma.review.delete({
      where: { id },
    });
  }
};
