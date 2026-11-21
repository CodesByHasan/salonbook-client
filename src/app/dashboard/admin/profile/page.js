import ProfileForm from "@/components/dashboard/ProfileForm";
import PageHeader from "@/components/shared/PageHeader";
import { getSession } from "@/lib/session";

export const metadata = { title: "My Profile" };

export default async function AdminProfilePage() {
  const { user } = await getSession();

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Update your name, photo and phone number." />
      <ProfileForm user={{ name: user.name, email: user.email, image: user.image, phone: user.phone }} />
    </div>
  );
}