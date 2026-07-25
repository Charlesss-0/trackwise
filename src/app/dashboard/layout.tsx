import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <QueryProvider>
      <div className="min-h-screen bg-base-100 flex" data-theme="business">
        <Sidebar />

        <main className="flex-1 lg:pl-64 pb-16 lg:pb-0">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>

        <MobileNav />
      </div>
    </QueryProvider>
  );
}
