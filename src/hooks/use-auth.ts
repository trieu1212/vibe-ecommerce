"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/auth";
import { toast } from "sonner";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Đăng nhập thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Đăng nhập thất bại");
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Đăng ký thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Đăng ký thất bại");
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    toast.success("Đã đăng xuất");
  };
}
