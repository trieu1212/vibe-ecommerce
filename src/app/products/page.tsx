"use client";

import { ProductCard } from "@/src/components/products/ProductCard";
import { useProducts } from "@/src/hooks/use-products";

export default function ProductsPage() {
  const { data, isLoading } = useProducts({ limit: 100 });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tất cả sản phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá {products.length} sản phẩm tuyệt vời
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Không tìm thấy sản phẩm nào
          </p>
        </div>
      )}
    </div>
  );
}
