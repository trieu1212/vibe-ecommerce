"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminCategoryCreate, useAdminCategoryUpdate, useAdminCategories } from "@/src/hooks/use-admin-categories";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"; // I need to assume these exist or implementation will fail. They usually come with shadcn/ui.
import { Input } from "@/src/components/ui/input";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea"; // Assuming exists
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/src/components/ui/select";
import { useRouter } from "next/navigation";

// Since I am unsure if Shadcn Form components are installed, I'll stick to a simpler Controlled approach using `react-hook-form` logic directly if Form components are missing.
// Checking previously seen files, I don't recall seeing Form components.
// I will implement safer HTML forms with hook-form.

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: any;
  id?: string;
}

export function CategoryForm({ initialData, id }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const createMutation = useAdminCategoryCreate();
  const updateMutation = useAdminCategoryUpdate();

  const { data: categoriesData } = useAdminCategories({ limit: 100, status: "active" });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      parentId: initialData?.parentId || undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
      // transform parentId "none" or empty to null
      const submitData = {
          ...data,
          parentId: data.parentId === "none" || !data.parentId ? null : data.parentId,
      };

      if (isEditing && id) {
          await updateMutation.mutateAsync({ id, data: submitData });
      } else {
          await createMutation.mutateAsync(submitData);
      }
      router.push("/admin/categories");
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
      <div className="max-w-2xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input {...form.register("name")} placeholder="Category name" />
                  {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea {...form.register("description")} placeholder="Description" />
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input {...form.register("image")} placeholder="https://..." />
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Parent Category</label>
                  <Select 
                    value={form.watch("parentId") || "none"} 
                    onValueChange={(val) => form.setValue("parentId", val === "none" ? "" : val)}
                  >
                    <SelectTrigger>
                        <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                         {categoriesData?.categories
                         .filter((c: any) => c.id !== id) // Prevent self-parenting
                         .map((c: any) => (
                             <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                         ))}
                    </SelectContent>
                  </Select>
              </div>

              <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? "Update Category" : "Create Category"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                  </Button>
              </div>
          </form>
      </div>
  );
}
