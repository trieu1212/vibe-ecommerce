"use client";

import { use, useEffect, useState } from "react";
import { CategoryForm } from "@/src/components/admin/categories/CategoryForm";
import { useAdminCategory } from "@/src/hooks/use-admin-categories";
import { Loader2 } from "lucide-react";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setCategoryId(p.id));
  }, [params]);

  const { data: category, isLoading, error } = useAdminCategory(categoryId);

  if (!categoryId || isLoading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (error || !category) {
      return <div>Error loading category</div>;
  }

  return (
      <div className="space-y-6">
          <h1 className="text-2xl font-bold">Edit Category</h1>
          <CategoryForm initialData={category} id={categoryId} />
      </div>
  );
}
