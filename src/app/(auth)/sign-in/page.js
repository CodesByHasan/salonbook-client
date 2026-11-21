import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/SignInForm";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = safeRedirect(redirectParam);

  // Already signed in: go straight to where they belong.
  const session = await getSession();
  if (session) redirect(redirectTo ?? dashboardPath(session.user.role));

  return <SignInForm redirectTo={redirectTo} />;
}