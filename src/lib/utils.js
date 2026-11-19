import { clsx } from "clsx";
import { API_URL } from "./api.js";

export const cn = (...args) => clsx(...args);

const taka = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });
export const formatPrice = (n) => `৳${taka.format(n ?? 0)}`;
export const formatNumber = (n) => new Intl.NumberFormat("en-US").format(n ?? 0);
export const compactNumber = (n) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n ?? 0);

export const formatDate = (d, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(d).toLocaleDateString("en-GB", opts);
export const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** Images uploaded to the API are stored as "/api/images/:id"; external URLs are used as-is. */
export const imageSrc = (url) => (url?.startsWith("/api/") ? `${API_URL}${url}` : url);

/** Smaller TheMealDB thumbnails for cards (the CDN supports /small and /medium variants). */
export const thumb = (url, size = "medium") => (url?.includes("themealdb.com") ? `${url}/${size}` : imageSrc(url));

export const initials = (name = "") => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export const priceLevelLabel = (level) => "৳".repeat(level ?? 1);

export const STATUS_LABELS = {
  PENDING: "Pending", CONFIRMED: "Confirmed", PREPARING: "Preparing", OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered", CANCELLED: "Cancelled", APPROVED: "Approved", REJECTED: "Rejected",
  NEW: "New", READ: "Read", RESOLVED: "Resolved",
};

export const PAYMENT_LABELS = { CASH_ON_DELIVERY: "Cash on delivery", CARD: "Card", MOBILE_WALLET: "Mobile wallet" };

/** Decodes a JWT payload without verifying it (used only to schedule auto-logout at expiry). */
export function tokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
