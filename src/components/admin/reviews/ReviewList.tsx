"use client";

import { useState } from "react";
import { useAdminReviews, useAdminReviewDelete } from "@/src/hooks/use-admin-reviews";
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
import { Trash2, Search, Loader2, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/src/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

export function ReviewList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminReviews({
    page,
    limit: 20,
    search,
  });

  const deleteReview = useAdminReviewDelete();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const reviews = data?.reviews || [];
  const pagination = data?.pagination;

  const getProductImage = (imagesStr: string) => {
      try {
          const images = JSON.parse(imagesStr);
          return images[0] || "";
      } catch (e) {
          return "";
      }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[40%]">Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review: any) => (
                <TableRow key={review.id}>
                  <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={review.user?.avatar || ""} />
                            <AvatarFallback>{review.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{review.user?.name}</span>
                            <span className="text-xs text-muted-foreground">{review.user?.email}</span>
                        </div>
                      </div>
                  </TableCell>
                  <TableCell>
                      <Link href={`/products/${review.product?.slug}`} target="_blank" className="flex items-center gap-2 hover:underline">
                        <div className="h-8 w-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                           {/* Simple img or specialized component */} 
                           <img src={getProductImage(review.product?.images)} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-sm truncate max-w-[150px]">{review.product?.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                        {review.rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                      <p className="text-sm line-clamp-2" title={review.comment}>{review.comment}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(review.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                            if(confirm("Delete this review permanently?")) deleteReview.mutate(review.id)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
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
