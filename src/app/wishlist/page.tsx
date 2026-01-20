"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useWishlistStore } from "@/src/store/wishlist";
import { useCartStore } from "@/src/store/cart";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { formatPrice } from "@/src/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      slug: item.slug,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Danh sách yêu thích trống</h2>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích
            </p>
            <Button
              onClick={() => (window.location.href = "/products")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Khám phá sản phẩm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Danh sách yêu thích</h1>
          <p className="text-muted-foreground mt-2">
            {items.length} sản phẩm
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setClearDialogOpen(true)}
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.productId} className="group overflow-hidden">
            <CardContent className="p-0">
              {/* Product Image */}
              <Link href={`/products/${item.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xl font-bold text-primary mb-4">
                  {formatPrice(item.price)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      removeItem(item.productId);
                      toast.success("Đã xóa khỏi yêu thích");
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tất cả</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tất cả {items.length} sản phẩm khỏi danh sách yêu thích không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearWishlist();
                toast.success("Đã xóa tất cả");
                setClearDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
