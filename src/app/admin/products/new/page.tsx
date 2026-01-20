import { ProductForm } from "@/src/components/admin/products/ProductForm";

export const metadata = {
  title: "New Product | Admin",
};

export default function NewProductPage() {
  return (
      <div className="space-y-6">
          <h1 className="text-2xl font-bold">Create Product</h1>
          <ProductForm />
      </div>
  );
}
