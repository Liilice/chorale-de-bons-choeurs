import Admin from "@/components/admin/Admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = (await cookies()).get("admin_session");

  if (!session) {
    redirect("/admin/login");
  }

  return <Admin />;
}