"use client";

import { useState } from "react";
import { useAdminOrders, useAdminOrderStatusUpdate } from "@/src/hooks/use-admin-orders";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Search, Loader2, Eye } from "lucide-react";
import { formatPrice, formatDate } from "@/src/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/src/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/src/components/ui/dialog";

export function OrderList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 20,
    search,
    status,
  });

  const updateStatus = useAdminOrderStatusUpdate();

  const handleStatusChange = (id: string, newStatus: string) => {
      updateStatus.mutate({ id, status: newStatus });
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'PENDING': return 'bg-yellow-500 hover:bg-yellow-600';
          case 'PROCESSING': return 'bg-blue-500 hover:bg-blue-600';
          case 'SHIPPED': return 'bg-indigo-500 hover:bg-indigo-600';
          case 'DELIVERED': return 'bg-green-500 hover:bg-green-600';
          case 'CANCELLED': return 'bg-red-500 hover:bg-red-600';
          default: return 'bg-gray-500';
      }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order ID, email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs font-mono">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                      <div className="flex flex-col">
                          <span className="font-medium text-sm">{order.customerName}</span>
                          <span className="text-xs text-muted-foreground">{order.email}</span>
                      </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger className={`w-[130px] h-8 text-white ${getStatusColor(order.status)} border-none`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Order Details #{order.id}</DialogTitle>
                                <DialogDescription>Created on {formatDate(order.createdAt)}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-6 py-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Customer Info</h3>
                                    <p className="text-sm">Name: {order.customerName}</p>
                                    <p className="text-sm">Email: {order.email}</p>
                                    <p className="text-sm">Phone: {order.phone}</p>
                                    <p className="text-sm">Address: {order.address}</p>
                                </div>
                                 <div className="text-right">
                                    <h3 className="font-semibold mb-2">Order Summary</h3>
                                    <p className="text-sm">Payment: {order.paymentMethod}</p>
                                    <p className="text-lg font-bold mt-2">Total: {formatPrice(order.total)}</p>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-4">Items</h3>
                                <div className="space-y-4 max-h-[300px] overflow-auto">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                 <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                                                    {/* Ideally show item image */}
                                                    {item.product?.image || item.product?.images ? (
                                                        <img 
                                                            src={item.product?.image || JSON.parse(item.product?.images || "[]")[0]} 
                                                            className="w-full h-full object-cover" 
                                                            alt="" 
                                                        />
                                                    ) : null}
                                                 </div>
                                                 <div>
                                                     <p className="text-sm font-medium">{item.product?.name}</p>
                                                     <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                 </div>
                                            </div>
                                            <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination Controls */}
       {pagination && (
        <div className="flex justify-end gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
            >
                Previous
            </Button>
            <div className="flex items-center text-sm">
                Page {page} of {pagination.totalPages}
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
            >
                Next
            </Button>
        </div>
      )}
    </div>
  );
}
