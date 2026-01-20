"use client";

import { useOrders } from "@/src/hooks/use-orders";
import { formatPrice, formatDate } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Loader2, Package, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/src/components/ui/dialog";

export function OrderHistory() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
            <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
        <p className="text-muted-foreground mb-6">
          Bạn chưa mua sắm sản phẩm nào tại Vibe.
        </p>
        <Button asChild>
          <Link href="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "PROCESSING":
        return "bg-blue-500 hover:bg-blue-600";
      case "SHIPPED":
        return "bg-indigo-500 hover:bg-indigo-600";
      case "DELIVERED":
        return "bg-green-500 hover:bg-green-600";
      case "CANCELLED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
      <div className="grid gap-6">
        {orders.map((order: any) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Đơn hàng #{order.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    Đặt ngày {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex p-4 gap-4 items-center">
                            <div className="relative h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {item.product?.images ? (
                                    <Image 
                                      src={JSON.parse(item.product.images)[0]} 
                                      alt={item.product.name} 
                                      fill 
                                      className="object-cover" 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {item.quantity} x {formatPrice(item.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="bg-gray-50/50 p-4 flex justify-between items-center">
              <div className="text-sm font-medium">
                Tổng cộng: <span className="text-lg text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
               <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                            <DialogDescription>#{order.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Ngày đặt</span>
                                    {formatDate(order.createdAt)}
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Trạng thái</span>
                                    <span className={getStatusColor(order.status) + " text-white px-2 py-0.5 rounded text-xs"}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Thanh toán</span>
                                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Sản phẩm</h4>
                                <div className="space-y-2 max-h-[200px] overflow-auto text-sm">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span>{item.product.name} x{item.quantity}</span>
                                            <span>{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold">
                                <span>Tổng cộng</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </DialogContent>
               </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
