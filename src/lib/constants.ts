export const APP_NAME = "Vibe E-commerce";
export const APP_DESCRIPTION = "Premium online shopping experience";

export const ITEMS_PER_PAGE = 12;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const ORDER_STATUS_LABELS = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
} as const;
