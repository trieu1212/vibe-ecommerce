"use client";

import { useState } from "react";
import { useAdminProducts, useAdminProductDelete, useAdminProductRestore } from "@/src/hooks/use-admin-products";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"; // Assuming you have these shadcn components, if not I'll just use divs or create them
import { Badge } from "@/src/components/ui/badge";
import { Edit, Trash2, RotateCcw, Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate, formatPrice } from "@/src/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/src/components/ui/select";

export function ProductList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "deleted">("active");

  const { data, isLoading } = useAdminProducts({
    page,
    limit: 10,
    search,
    status,
  });

  const deleteProduct = useAdminProductDelete();
  const restoreProduct = useAdminProductRestore();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
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
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => (
                <TableRow key={product.id} className={product.deletedAt ? "opacity-60 bg-muted/50" : ""}>
                  <TableCell className="font-medium">
                    {product.name}
                    {product.deletedAt && <Badge variant="destructive" className="ml-2">Deleted</Badge>}
                  </TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {product.deletedAt ? (
                       <Button
                       variant="outline"
                       size="icon"
                       onClick={() => {
                           if(confirm("Restore this product?")) restoreProduct.mutate(product.id)
                       }}
                       title="Restore"
                     >
                       <RotateCcw className="h-4 w-4" />
                     </Button> 
                    ) : (
                        <>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                                if(confirm("Are you sure you want to delete this product?")) deleteProduct.mutate(product.id)
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

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-end gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
            >
                Previous
            </Button>
            <div className="flex items-center text-sm">
                Page {page} of {pagination.totalPages}
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
            >
                Next
            </Button>
        </div>
      )}
    </div>
  );
}
