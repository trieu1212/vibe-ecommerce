"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { useTopLevelCategories } from "@/src/hooks/use-categories";

export function CategoryShowcase() {
  const { data, isLoading } = useTopLevelCategories();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Danh mục sản phẩm</h2>
            <p className="text-muted-foreground">Khám phá các danh mục phổ biến</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categories = data?.categories?.slice(0, 4) || [];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Danh mục sản phẩm</h2>
          <p className="text-muted-foreground">
            Khám phá các danh mục phổ biến
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm opacity-90 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
