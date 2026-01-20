"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/src/components/admin/products/ProductForm";
import { useAdminProduct } from "@/src/hooks/use-admin-products";
import { Loader2 } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setProductId(p.id));
  }, [params]);

  const { data: product, isLoading, error } = useAdminProduct(productId);

  if (!productId || isLoading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (error || !product) {
      return <div>Error loading product</div>;
  }

  return (
      <div className="space-y-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <ProductForm initialData={product} id={productId} />
      </div>
  );
}
