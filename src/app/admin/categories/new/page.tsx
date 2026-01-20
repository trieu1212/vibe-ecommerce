import { CategoryForm } from "@/src/components/admin/categories/CategoryForm";

export const metadata = {
  title: "New Category | Admin",
};

export default function NewCategoryPage() {
  return (
      <div className="space-y-6">
          <h1 className="text-2xl font-bold">Create Category</h1>
          <CategoryForm />
      </div>
  );
}
