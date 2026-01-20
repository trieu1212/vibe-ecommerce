import { prisma } from "@/src/lib/db";
import { Prisma } from "@prisma/client";

export const orderRepo = {
  async create({
    userId,
    items,
    shippingInfo,
    paymentMethod,
    totalAmount,
    shippingFee
  }: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    shippingInfo: any;
    paymentMethod: string;
    totalAmount: number;
    shippingFee: number;
  }) {
    return prisma.$transaction(async (tx) => {
        // Create order
        const order = await tx.order.create({
            data: {
                userId,
                totalAmount,
                shippingFee,
                paymentMethod,
                shippingInfo: JSON.stringify(shippingInfo),
                status: "PENDING",
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        return order;
    });
  },

  async findByUserId(userId: string) {
      return prisma.order.findMany({
          where: { userId },
          include: {
              items: {
                  include: {
                      product: { select: { name: true, images: true, slug: true } }
                  }
              }
          },
          orderBy: { createdAt: 'desc' }
      });
  },
  
  async findById(id: string, userId: string) {
      return prisma.order.findFirst({
        where: { id, userId },
        include: {
            items: {
                include: {
                    product: { select: { name: true, images: true, slug: true } }
                }
            }
        }
      });
  }
};
