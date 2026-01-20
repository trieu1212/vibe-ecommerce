import { prisma } from "@/src/lib/db";
import { Prisma, OrderStatus } from "@prisma/client";

export const adminOrderRepo = {
  async findAll({
    page = 1,
    limit = 20,
    status,
    search,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (status && status !== "ALL") {
      where.status = status as OrderStatus;
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { user: { email: { contains: search } } },
        { shippingInfo: { contains: search } }, // Search inside JSON string
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
            items: {
              include: {
                product: {
                    select: { name: true, images: true }
                }
              }
            },
            user: {
                select: { name: true, email: true }
            }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    // Transform data for frontend
    const transformedOrders = orders.map(order => {
        let shippingStr = order.shippingInfo;
        let shipping = {};
        try {
            shipping = JSON.parse(shippingStr);
        } catch (e) {
            shipping = { address: shippingStr }; 
        }

        return {
            id: order.id,
            customerName: (shipping as any).fullName || (shipping as any).name || order.user.name,
            email: (shipping as any).email || order.user.email,
            phone: (shipping as any).phone || "",
            address: (shipping as any).address || "",
            total: order.totalAmount,
            status: order.status,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                product: {
                    name: item.product.name,
                    images: item.product.images
                }
            }))
        };
    });

    return {
      orders: transformedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });
  },
  
  async findById(id: string) {
      const order = await prisma.order.findUnique({
          where: { id },
          include: {
            items: {
                include: {
                  product: {
                    select: { name: true, images: true, slug: true }
                  }
                }
            },
            user: {
                select: { name: true, email: true, id: true }
            }
          }
      });

      if (!order) return null;

      let shippingStr = order.shippingInfo;
        let shipping = {};
        try {
            shipping = JSON.parse(shippingStr);
        } catch (e) {
            shipping = { address: shippingStr };
        }

      return {
          id: order.id,
          customerName: (shipping as any).fullName || (shipping as any).name || order.user.name,
          email: (shipping as any).email || order.user.email,
          phone: (shipping as any).phone || "",
          address: (shipping as any).address || "",
          shippingInfo: shipping,
          total: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          items: order.items.map(item => ({
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              product: {
                  name: item.product.name,
                  images: item.product.images,
                  slug: item.product.slug
              }
          }))
      };
  }
};
