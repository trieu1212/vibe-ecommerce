import { prisma } from "@/src/lib/db";
import { Prisma } from "@prisma/client";

export const adminUserRepo = {
  async findAll({
    page = 1,
    limit = 20,
    search,
    role,
    status, // 'active', 'deleted', 'all'
  }: {
    page?: number;
    limit?: number;
    search?: string;
    role?: "ADMIN" | "USER";
    status?: "active" | "deleted" | "all";
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    
    if (role) {
      where.role = role;
    }

    if (status === "active") {
      where.deletedAt = null;
    } else if (status === "deleted") {
      where.deletedAt = { not: null };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { // Don't return passwords
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // Create usually done via public auth, but admin might want to create users manually
  // For now we skip create user manually as it requires password handling

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },

  async restore(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  },
};
