"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  avatar: string | null;
  deletedAt: string | null;
  createdAt: string;
}

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: "ADMIN" | "USER";
  status?: "active" | "deleted" | "all";
}

export function useAdminUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);

      const response = await apiClient.get(`/admin/users?${params.toString()}`);
      return response.data;
    },
  });
}

export function useAdminUserDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to delete user");
    }
  });
}

export function useAdminUserRestore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/admin/users/${id}/restore`, {});
      return response.data;
    },
    onSuccess: () => {
      toast.success("User restored successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to restore user");
    }
  });
}

export function useAdminUserUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "ADMIN" | "USER" }) => {
      const response = await apiClient.put(`/admin/users/${id}`, { role });
      return response.data;
    },
    onSuccess: () => {
      toast.success("User role updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.error || "Failed to update role");
    }
  });
}
