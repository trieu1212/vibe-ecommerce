import { prisma } from "@/src/lib/db";
import { OrderStatus } from "@prisma/client";

export const adminDashboardRepo = {
  async getStats() {
    // 1. Calculate date for 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const [
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
        recentOrders,
        ordersForGraph,
        statusDistribution
    ] = await Promise.all([
        prisma.user.count({ where: { role: "USER", deletedAt: null } as any }),
        prisma.product.count({ where: { deletedAt: null } as any }),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { not: OrderStatus.CANCELLED } }
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } }
        }),
        prisma.order.findMany({
             where: { 
                 createdAt: { gte: sixMonthsAgo },
                 status: { not: OrderStatus.CANCELLED }
             },
             select: { createdAt: true, totalAmount: true }
        }),
        prisma.order.groupBy({
            by: ['status'],
            _count: { status: true }
        })
    ]);

    // Process Monthly Revenue
    const monthlyRevenueMap = new Map<string, number>();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('en-US', { month: 'short' });
        monthlyRevenueMap.set(key, 0);
        months.push(key);
    }

    ordersForGraph.forEach(order => {
        const d = new Date(order.createdAt);
        const key = d.toLocaleString('en-US', { month: 'short' });
        if (monthlyRevenueMap.has(key)) {
            monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) || 0) + order.totalAmount);
        }
    });

    const revenueChartData = months.map(month => ({
        name: month,
        total: monthlyRevenueMap.get(month) || 0
    }));

    // Process Status Distribution
    const statusChartData = statusDistribution.map(item => ({
        name: item.status,
        value: item._count.status
    }));

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenue._sum.totalAmount || 0,
        recentOrders: recentOrders.map(order => {
             let shippingStr = order.shippingInfo;
             let shipping = {};
             try { 
                 shipping = JSON.parse(shippingStr); 
             } catch(e) { 
                 shipping = { address: shippingStr };
             }
             
             return {
                 id: order.id,
                 amount: order.totalAmount,
                 customer: {
                     name: (shipping as any).fullName || (shipping as any).name || order.user.name,
                     email: (shipping as any).email || order.user.email,
                 }
             };
        }),
        charts: {
            revenue: revenueChartData,
            status: statusChartData
        }
    };
  }

};
