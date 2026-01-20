import { prisma } from "@/src/lib/db";
import { Prisma } from "@prisma/client";

export const adminProductRepo = {
  async findAll({
    page = 1,
    limit = 10,
    search,
    status, // 'active', 'deleted', 'all'
    categoryId,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "deleted" | "all";
    categoryId?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search } }, // Case insensitive usually depends on DB collation
        { slug: { contains: search } },
      ];
    }

    // Status filter (Soft Delete)
    if (status === "active") {
      where.deletedAt = null;
    } else if (status === "deleted") {
      where.deletedAt = { not: null };
    }
    // If 'all', we don't filter by deletedAt

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: where as Prisma.ProductWhereInput,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: where as Prisma.ProductWhereInput }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({
      data,
    });
  },

  async update(id: string, data: Prisma.ProductUncheckedUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false, // Optional: also deactivate it
      } as any,
    });
  },

  async restore(id: string) {
    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      } as any,
    });
  },
};
