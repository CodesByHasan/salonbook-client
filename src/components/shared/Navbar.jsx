import { getSession } from "@/lib/session";
import NavbarView from "./NavbarView";

// Reads the session on the server, so there is no "logged out" flicker on refresh.
export default async function Navbar() {
  const session = await getSession();

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role: session.user.role ?? "user",
      }
    : null;

  return <NavbarView user={user} />;
}
