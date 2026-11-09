import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
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
			<div className="min-h-screen bg-background flex pt-[env(safe-area-inset-top)]">
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-card focus:p-3"
				>
					Skip to content
				</a>
				<Sidebar />

				<div className="min-w-0 flex-1 lg:pl-60 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
					<WorkspaceHeader />
					<main id="main-content">
						<div className="max-w-360 mx-auto p-4 py-6 sm:p-8 lg:p-9">{children}</div>
					</main>
				</div>

				<MobileNav />
			</div>
		</QueryProvider>
	);
}
