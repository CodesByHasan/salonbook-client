import { authClient } from "@/lib/auth-client";

const MAX_SIZE = 4 * 1024 * 1024; // matches the server limit

// Uploads an image to Express (/api/upload -> ImgBB) and returns its URL. Throws a readable Error.
export async function uploadImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > MAX_SIZE) throw new Error("Image must be 4 MB or smaller.");

  const { data, error } = await authClient.token();
  if (error || !data?.token) throw new Error("Your session expired. Please sign in again.");

  const body = new FormData();
  body.append("image", file);

  let res;
  try {
    res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${data.token}` }, body });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data?.url) throw new Error(json?.message || "Image upload failed. Please try again.");

  return json.data.url;
}