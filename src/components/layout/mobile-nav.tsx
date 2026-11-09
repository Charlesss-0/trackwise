"use client";
import { ArrowLeftRight, CreditCard, LayoutDashboard, Menu, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

const mainItems = [
	{ href: "/dashboard", label: "Overview", icon: LayoutDashboard },
	{ href: "/dashboard/accounts", label: "Accounts", icon: Wallet },
	{ href: "/dashboard/transactions", label: "Activity", icon: ArrowLeftRight },
	{ href: "/dashboard/debts", label: "Debts", icon: CreditCard },
];
export function MobileNav() {
	const pathname = usePathname();
	const { toggleSidebar, sidebarOpen } = useUIStore();
	return (
		<nav
			aria-label="Mobile navigation"
			className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sidebar pb-[env(safe-area-inset-bottom)] lg:hidden"
		>
			<div className="flex h-16 items-center justify-around">
				{mainItems.map(({ href, label, icon: Icon }) => (
					<Link
						key={href}
						href={href}
						aria-current={pathname === href ? "page" : undefined}
						className={`flex h-full w-16 flex-col items-center justify-center gap-1 text-[10px] font-medium ${pathname === href ? "text-sidebar-primary" : "text-muted-foreground"}`}
					>
						<span className={`rounded-lg px-3 py-1 ${pathname === href ? "bg-sidebar-accent" : ""}`}>
							<Icon size={18} />
						</span>
						{label}
					</Link>
				))}
				<button
					type="button"
					onClick={toggleSidebar}
					aria-expanded={sidebarOpen}
					className="flex h-full w-16 flex-col items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground"
				>
					<Menu size={18} />
					Menu
				</button>
			</div>
		</nav>
	);
}
