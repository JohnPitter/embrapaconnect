import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-off-white overflow-hidden">
      <DashboardSidebar />
      <div className="ml-60 flex min-h-0 flex-1 flex-col">
        <main className="flex-1 min-h-0 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
