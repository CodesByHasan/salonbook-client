import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

// Asia/Dhaka is UTC+6 all year (no daylight saving).
const dhaka = (options) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", ...options });
const toDate = (value) =>
  new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+06:00` : value);

// Today as "YYYY-MM-DD" in Asia/Dhaka.
export const todayInDhaka = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());

// "2026-12-01" or an ISO date -> "1 Dec 2026"
export const formatDate = (value) =>
  value ? dhaka({ day: "numeric", month: "short", year: "numeric" }).format(toDate(value)) : "—";

// ISO date -> "1 Dec 2026, 2:30 pm"
export const formatDateTime = (value) =>
  value
    ? dhaka({ day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(toDate(value))
    : "—";

export const formatPrice = (price) => `৳${Number(price).toLocaleString("en-US")}`;

export const formatMoney = (amount, currency = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount);

// "14:00" -> "2:00 PM"
export const formatSlot = (slot) => {
  const [hour, minute] = slot.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};

// "cs_test_a1b2...x9y8z7" -> "…x9y8z7"
export const shortId = (id) => (id ? `…${String(id).slice(-8)}` : "—");

// Builds "a=1&b=2", skipping empty values.
export const buildQuery = (params) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  return search.toString();
};

// Only allow redirects to pages inside this site (blocks "//evil.com").
// Auth pages are rejected too: "/sign-in?redirect=/sign-in" would redirect forever for a signed-in user.
export const safeRedirect = (value) =>
  typeof value === "string" &&
  value.startsWith("/") &&
  !value.startsWith("//") &&
  !value.includes("\\") &&
  !/^\/(sign-in|sign-up)(?:[/?#]|$)/.test(value)
    ? value
    : null;

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "U";
