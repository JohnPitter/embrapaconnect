import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-off-white">
      <DashboardSidebar />
      <div className="ml-60 flex flex-1 flex-col min-h-screen">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
