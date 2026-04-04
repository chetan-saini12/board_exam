import { requireAuth } from "@/lib/auth";
import AdminSidebar from "./Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen pt-16 bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 md:ml-56 p-4 md:p-8">{children}</main>
    </div>
  );
}
