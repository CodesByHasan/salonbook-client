export const SITE = {
  name: "SalonBook",
  description: "Discover professional salon services and book your next appointment with ease.",
  email: "hello@salonbook.com",
  phone: "+880 1700-000000",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh",
  hours: "Every day, 10:00 AM – 9:00 PM",
  socials: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "WhatsApp", href: "https://wa.me/8801700000000" },
  ],
};

// Admin creates services with these categories (the value is what the API stores).
export const SERVICE_CATEGORIES = [
  { value: "hair", label: "Hair" },
  { value: "skin", label: "Skin Care" },
  { value: "nails", label: "Nails" },
  { value: "makeup", label: "Makeup" },
  { value: "spa", label: "Spa & Massage" },
  { value: "bridal", label: "Bridal" },
];

export const getCategoryLabel = (value) =>
  SERVICE_CATEGORIES.find((category) => category.value === value)?.label ??
  (value ? value[0].toUpperCase() + value.slice(1) : "General");

export const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "asc", label: "Price: Low to High" },
  { value: "desc", label: "Price: High to Low" },
];

// Predefined time slots (HH:mm, 24-hour): 10:00 ... 20:00. Same format the API expects.
export const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);

export const PAGE_SIZE = 12;

// Where each role lands after sign-in. Better Auth's default role "user" = customer.
export const dashboardPath = (role) => (role === "admin" ? "/dashboard/admin" : "/dashboard/customer");