"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Heart, Share2, Truck, Shield } from "lucide-react";
import { useProduct } from "@/src/hooks/use-products";
import { useCartStore } from "@/src/store/cart";
import { useWishlistStore } from "@/src/store/wishlist";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { formatPrice } from "@/src/lib/utils";
import { Separator } from "@/src/components/ui/separator";
import { toast } from "sonner";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  
  const { data: product, isLoading } = useProduct(slug);
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const images = product.images;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: 1,
      slug: product.slug,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isFeatured && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 border-0">
                Nổi bật
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4 bg-red-500">
                -{discount}%
              </Badge>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1, 5).map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <Image src={img} alt={`${product.name} ${idx + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button 
              size="lg" 
              variant={isInWishlist(product.id) ? "default" : "outline"}
              onClick={() => {
                const inWishlist = isInWishlist(product.id);
                if (inWishlist) {
                  removeFromWishlist(product.id);
                  toast.success("Đã xóa khỏi yêu thích");
                } else {
                  addToWishlist({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: images[0],
                    slug: product.slug,
                  });
                  toast.success("Đã thêm vào yêu thích");
                }
              }}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Miễn phí vận chuyển</p>
                  <p className="text-xs text-muted-foreground">Đơn hàng trên 500k</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Bảo hành chính hãng</p>
                  <p className="text-xs text-muted-foreground">12 tháng</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-2">
            <h3 className="font-semibold">Thông tin sản phẩm</h3>
            <div className="space-y-1 text-sm">
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Danh mục:</span>
                <span className="font-medium">{product.category?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}

// Need to import React for React.use()
import React from "react";
import { ProductReviews } from "@/src/components/products/ProductReviews";
