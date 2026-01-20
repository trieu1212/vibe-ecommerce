"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/src/store/cart";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { formatPrice } from "@/src/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());
  const getTotalItems = useCartStore((state) => state.getTotalItems());

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const shippingFee = getTotalPrice >= 500000 ? 0 : 30000;
  const finalTotal = getTotalPrice + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-16 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tiếp tục mua sắm
        </Link>
        <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
        <p className="text-muted-foreground mt-2">
          {getTotalItems} sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4 md:p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-primary mt-2">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="hidden md:block text-right">
                    <p className="text-sm text-muted-foreground">Tổng</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">{formatPrice(getTotalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {getTotalPrice < 500000 && (
                  <p className="text-sm text-muted-foreground">
                    Mua thêm {formatPrice(500000 - getTotalPrice)} để được miễn phí vận chuyển
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                Thanh toán
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Phí vận chuyển và thuế được tính khi thanh toán
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
