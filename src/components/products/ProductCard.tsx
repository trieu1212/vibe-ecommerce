"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { formatPrice } from "@/src/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  isFeatured?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  images,
  isFeatured,
}: ProductCardProps) {
  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Product Image */}
          <Image
            src={images[0] || "/placeholder.png"}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isFeatured && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">
                Nổi bật
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="bg-red-500">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button - Shows on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-primary">
            {formatPrice(price)}
          </span>
          {comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
