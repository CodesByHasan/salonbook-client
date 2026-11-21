import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata = { title: "Create Account" };

export default async function SignUpPage({ searchParams }) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = safeRedirect(redirectParam);

  const session = await getSession();
  if (session) redirect(redirectTo ?? dashboardPath(session.user.role));

  return <SignUpForm redirectTo={redirectTo} />;
}