"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/products/ProductCard";
import { useFeaturedProducts } from "@/src/hooks/use-products";

export function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground">
                Khám phá những sản phẩm được yêu thích nhất
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const products = data?.products || [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground">
              Khám phá những sản phẩm được yêu thích nhất
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="group">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              comparePrice={product.comparePrice}
              images={product.images}
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
