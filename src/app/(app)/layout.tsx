import { get_session_user } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { redirect } from "next/navigation";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await get_session_user();
  if (!user) {
    redirect("/login");
  }
  return <AppShell user={user}>{children}</AppShell>;
}
