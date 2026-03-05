import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-off-white overflow-hidden">
      <AdminSidebar />
      <div className="ml-60 flex min-h-0 flex-1 flex-col">
        <main className="flex-1 min-h-0 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
