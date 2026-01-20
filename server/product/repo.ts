import { prisma } from "@/src/lib/db";

export const productRepo = {
  async findAll(params?: {
    skip?: number;
    take?: number;
    categoryId?: string;
    search?: string;
    isFeatured?: boolean;
  }) {
    const where: any = { isActive: true };
    
    if (params?.categoryId) {
      where.categoryId = params.categoryId;
    }
    
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }
    
    if (params?.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip: params?.skip || 0,
        take: params?.take || 12,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  async findBySlug(slug: string) {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  },

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },
};
