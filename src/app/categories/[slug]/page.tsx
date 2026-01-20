"use client";

import { notFound } from "next/navigation";
import { ProductCard } from "@/src/components/products/ProductCard";
import { useProducts } from "@/src/hooks/use-products";
import React from "react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  
  // First get category info
  const [category, setCategory] = React.useState<any>(null);
  const [categoryId, setCategoryId] = React.useState<string | null>(null);

  // Fetch category by slug
  React.useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`/api/categories/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCategory(data);
          setCategoryId(data.id);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }
    fetchCategory();
  }, [slug]);

  // Then get products for this category
  const { data, isLoading } = useProducts({ 
    categoryId: categoryId || undefined,
    limit: 100 
  });

  if (!category && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  const products = data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-lg">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {products.length} sản phẩm
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
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
      )}

      {products.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Chưa có sản phẩm nào trong danh mục này
          </p>
        </div>
      )}
    </div>
  );
}
