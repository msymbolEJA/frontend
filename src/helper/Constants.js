export const BASE_URL = "http://45.76.57.100:8080/";
export const BASE_URL_MAPPING = "http://45.76.57.100:8080/etsy/mapping/";
export const BELKY_STOCK_BASE_URL = "http://45.76.57.100:8080/etsy/stock/";
export const STORE_NAME = "Belky";

export const tagsData = [
  "pending",
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
  "shipped",
];

export const nonAdminTagsData = [
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
];

export const statusData = [
  "pending",
  "awaiting",
  "in_progress",
  "ready",
  "in_transit",
  "cancelled",
  "shipped",
];

export const USER_TYPE = {
  ADMIN: "admin",
  SHOP_MANAGER: "shop_manager",
  SHOP_PACKER: "shop_packer",
  WORKSHOP_MANAGER: "workshop_manager",
  WORKSHOP_PACKER: "workshop_packer",
};

export const sortingArrayAdmin = [
  "PENDING",
  "AWAITING",
  "IN PROGRESS",
  "READY",
  "IN TRANSIT",
  "SHIPPED",
  "CANCELLED",
];

export const sortingArrayUser = [
  "PENDING",
  "AWAITING",
  "IN PROGRESS",
  "READY",
  "IN TRANSIT",
  "CANCELLED",
];

export const repeatReasons = {
  MANUFACTURING_ERROR: "MANUFACTURING ERROR",
  DISCOLORATION: "DISCOLORATION",
  BREAK_OFF: "BREAK OFF",
  LOST_IN_MAIL: "LOST IN MAIL",
  SECOND: "SECOND",
};
