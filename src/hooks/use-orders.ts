"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        images: string;
        slug: string;
    };
}

export interface Order {
    id: string;
    status: string;
    totalAmount: number;
    shippingFee: number;
    paymentMethod: string;
    shippingInfo: string;
    createdAt: string;
    items: OrderItem[];
}

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await apiClient.get("/orders");
            return response.data;
        },
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/orders", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
    });
}
