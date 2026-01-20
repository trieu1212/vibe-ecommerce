import { prisma } from "@/src/lib/db";

export const categoryRepo = {
  async findAll(params?: { skip?: number; take?: number; parentId?: string | null }) {
    const where: any = {};
    
    if (params?.parentId !== undefined) {
      where.parentId = params.parentId;
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 10,
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return { categories, total };
  },

  async findBySlug(slug: string) {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  },
};
