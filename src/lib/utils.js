import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

// Today as "YYYY-MM-DD" in Asia/Dhaka (UTC+6, no daylight saving).
export const todayInDhaka = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());

export const formatPrice = (price) => `৳${Number(price).toLocaleString("en-US")}`;

// "14:00" -> "2:00 PM"
export const formatSlot = (slot) => {
  const [hour, minute] = slot.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};

// Builds "a=1&b=2", skipping empty values.
export const buildQuery = (params) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  return search.toString();
};

// Only allow redirects to pages inside this site (blocks "//evil.com").
export const safeRedirect = (value) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : null;

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "U";
