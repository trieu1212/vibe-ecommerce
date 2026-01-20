"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Package, Users, ShoppingCart, DollarSign, Loader2 } from "lucide-react";
import { useAdminDashboard } from "@/src/hooks/use-admin-dashboard";
import { formatPrice } from "@/src/lib/utils";
import { DashboardCharts } from "@/src/components/admin/dashboard/DashboardCharts";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminDashboard();

  if (isLoading) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts 
        revenueData={stats?.charts?.revenue || []} 
        statusData={stats?.charts?.status || []} 
      />

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats?.recentOrders?.map((order) => (
                  <div className="flex items-center" key={order.id}>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                    <div className="ml-auto font-medium">{formatPrice(order.amount)}</div>
                  </div>
              ))}
              {stats?.recentOrders?.length === 0 && (
                  <p className="text-muted-foreground text-center">No recent sales</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
