import { prisma } from "@/src/lib/db";
import { Prisma } from "@prisma/client";

export const adminCategoryRepo = {
  async findAll({
    page = 1,
    limit = 100, // Categories usually fewer, so higher limit
    search,
    status, // 'active', 'deleted', 'all'
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "deleted" | "all";
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    if (status === "active") {
      where.deletedAt = null;
    } else if (status === "deleted") {
      where.deletedAt = { not: null };
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          parent: true,
          _count: {
            select: { products: true, children: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.count({ where }),
    ]);

    return {
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: true },
    });
  },

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
    });
  },

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async softDelete(id: string) {
    return prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  async restore(id: string) {
    return prisma.category.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  },
};
