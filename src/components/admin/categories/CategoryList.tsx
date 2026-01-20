"use client";

import { useState } from "react";
import { useAdminCategories, useAdminCategoryDelete, useAdminCategoryRestore } from "@/src/hooks/use-admin-categories";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Edit, Trash2, RotateCcw, Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/src/components/ui/select";

export function CategoryList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "deleted">("active");

  const { data, isLoading } = useAdminCategories({
    page,
    limit: 100,
    search,
    status,
  });

  const deleteCategory = useAdminCategoryDelete();
  const restoreCategory = useAdminCategoryRestore();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const categories = data?.categories || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: any) => (
                <TableRow key={category.id} className={category.deletedAt ? "opacity-60 bg-muted/50" : ""}>
                  <TableCell className="font-medium">
                    {category.name}
                    {category.deletedAt && <Badge variant="destructive" className="ml-2">Deleted</Badge>}
                  </TableCell>
                  <TableCell>{category.parent?.name || "-"}</TableCell>
                  <TableCell>{category._count?.products || 0}</TableCell>
                  <TableCell>{category._count?.children || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {category.deletedAt ? (
                       <Button
                       variant="outline"
                       size="icon"
                       onClick={() => {
                           if(confirm("Restore this category?")) restoreCategory.mutate(category.id)
                       }}
                       title="Restore"
                     >
                       <RotateCcw className="h-4 w-4" />
                     </Button> 
                    ) : (
                        <>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                                if(confirm("Are you sure you want to delete this category?")) deleteCategory.mutate(category.id)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
