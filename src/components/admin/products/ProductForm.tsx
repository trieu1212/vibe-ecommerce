"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminProductCreate, useAdminProductUpdate } from "@/src/hooks/use-admin-products";
import { useAdminCategories } from "@/src/hooks/use-admin-categories";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/src/components/ui/select";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/src/components/ui/checkbox"; // Assuming exists
import { useState } from "react";
import { Badge } from "@/src/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "Stock must be positive").default(0),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  // Images handling - we will use a simple array of strings for now
  // In real app we would use file upload
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: any;
  id?: string;
}

export function ProductForm({ initialData, id }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const createMutation = useAdminProductCreate();
  const updateMutation = useAdminProductUpdate();

  // Images state
  const [images, setImages] = useState<string[]>(
      initialData?.images ? (typeof initialData.images === 'string' ? JSON.parse(initialData.images) : initialData.images) : []
  );
  const [imageUrlInput, setImageUrlInput] = useState("");

  const { data: categoriesData } = useAdminCategories({ limit: 100, status: "active" });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      comparePrice: initialData?.comparePrice || undefined,
      stock: initialData?.stock || 0,
      sku: initialData?.sku || "",
      categoryId: initialData?.categoryId || "",
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
    },
  });

  const onSubmit = async (data: FormValues) => {
      const submitData = {
          ...data,
          images: images,
      };

      if (images.length === 0) {
          alert("Please add at least one image");
          return;
      }

      if (isEditing && id) {
          await updateMutation.mutateAsync({ id, data: submitData });
      } else {
          await createMutation.mutateAsync(submitData);
      }
      router.push("/admin/products");
  };

  const addImage = () => {
      if (imageUrlInput.trim()) {
          setImages([...images, imageUrlInput.trim()]);
          setImageUrlInput("");
      }
  };

  const removeImage = (index: number) => {
      setImages(images.filter((_, i) => i !== index));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
      <div className="max-w-2xl">
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input {...form.register("name")} placeholder="Product name" />
                  {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea {...form.register("description")} placeholder="Description" rows={5} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <Input type="number" {...form.register("price")} placeholder="0" />
                      {form.formState.errors.price && (
                          <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                      )}
                  </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Compare Price (Original)</label>
                      <Input type="number" {...form.register("comparePrice")} placeholder="0" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Stock</label>
                      <Input type="number" {...form.register("stock")} placeholder="0" />
                  </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">SKU</label>
                      <Input {...form.register("sku")} placeholder="SKU-123" />
                  </div>
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={form.watch("categoryId")} 
                    onValueChange={(val) => form.setValue("categoryId", val)}
                  >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                         {categoriesData?.categories.map((c: any) => (
                             <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                         ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                      <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
                  )}
              </div>

               {/* Image Management */}
               <div className="space-y-2">
                  <label className="text-sm font-medium">Images</label>
                  <div className="flex gap-2">
                      <Input 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Image URL (e.g. from Unsplash)" 
                      />
                      <Button type="button" onClick={addImage} variant="secondary">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                      {images.map((url, i) => (
                          <div key={i} className="relative group border rounded overflow-hidden w-20 h-20">
                              <img src={url} className="w-full h-full object-cover" alt="" />
                              <button 
                                type="button" 
                                onClick={() => removeImage(i)}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <X className="h-3 w-3" />
                              </button>
                          </div>
                      ))}
                      {images.length === 0 && <p className="text-sm text-muted-foreground italic">No images added</p>}
                  </div>
              </div>

              <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isActive" 
                        checked={form.watch("isActive")}
                        onCheckedChange={(c) => form.setValue("isActive", c as boolean)}
                    />
                    <label
                        htmlFor="isActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Active
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isFeatured" 
                        checked={form.watch("isFeatured")}
                        onCheckedChange={(c) => form.setValue("isFeatured", c as boolean)}
                    />
                    <label
                        htmlFor="isFeatured"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Featured
                    </label>
                  </div>
              </div>

              <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? "Update Product" : "Create Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                  </Button>
              </div>
          </form>
      </div>
  );
}
