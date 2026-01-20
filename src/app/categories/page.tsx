"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { useCategories } from "@/src/hooks/use-categories";

export default function CategoriesPage() {
  const { data, isLoading } = useCategories({ parentId: null, limit: 100 });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Danh mục sản phẩm</h1>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Danh mục sản phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá các danh mục sản phẩm của chúng tôi
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category: any) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={category.image || "/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm opacity-90 mb-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="text-sm opacity-75">
                    {category.productCount} sản phẩm
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Chưa có danh mục nào
          </p>
        </div>
      )}
    </div>
  );
}
