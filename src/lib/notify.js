import { toast } from "sonner";

// Shows a toast for a server action result. Returns true on success.
// A 401 (expired session) sends the user to sign-in. Never use alert().
export function notify(result, router) {
  if (result.success) {
    toast.success(result.message);
    return true;
  }

  toast.error(result.message);
  if (result.status === 401 && router) router.push("/sign-in?redirect=/dashboard");
  return false;
}