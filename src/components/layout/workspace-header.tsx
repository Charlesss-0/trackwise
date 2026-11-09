"use client";
import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";

const titles: Record<string, string> = {
	dashboard: "Overview",
	accounts: "Accounts",
	transactions: "Transactions",
	categories: "Categories",
	recurring: "Recurring",
	debts: "Debts & loans",
	settings: "Settings",
};
export function WorkspaceHeader() {
	const path = usePathname().split("/").pop() || "dashboard";
	const { homeCurrency, toggleSidebar } = useUIStore();
	return (
		<header className="flex h-[72px] items-center justify-between gap-3 border-b border-border bg-card/60 px-4 sm:px-8">
			<div className="flex items-center gap-2 text-xs">
				<Button type="button" size="icon-sm" variant="ghost" className="lg:hidden" aria-label="Open navigation" onClick={toggleSidebar}>
					<Menu />
				</Button>
				<span className="hidden text-muted-foreground sm:inline">Personal workspace</span>
				<ChevronRight size={13} className="hidden text-muted-foreground sm:block" />
				<span className="font-medium">{titles[path]}</span>
			</div>
			<span className="rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] text-muted-foreground">
				Home currency <span className="ml-2 font-semibold text-foreground">{homeCurrency}</span>
			</span>
		</header>
	);
}
