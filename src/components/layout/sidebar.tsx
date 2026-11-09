"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeftRight, ArrowUpRight, CreditCard, LayoutDashboard, LogOut, RotateCw, Settings, Tags, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui-store";
import { twMerge } from "@/utils/tw-merge";
import { Brand } from "./brand";

const navItems = [
	{ href: "/dashboard", label: "Overview", icon: LayoutDashboard },
	{ href: "/dashboard/accounts", label: "Accounts", icon: Wallet },
	{ href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
	{ href: "/dashboard/categories", label: "Categories", icon: Tags },
	{ href: "/dashboard/recurring", label: "Recurring", icon: RotateCw },
	{ href: "/dashboard/debts", label: "Debts & loans", icon: CreditCard },
];
export function Sidebar() {
	const pathname = usePathname();
	const returnFocus = useRef<HTMLElement | null>(null);
	const { sidebarOpen, toggleSidebar } = useUIStore();
	const { user, signOut } = useAuth();
	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 1024px)");
		const closeOnDesktop = () => {
			if (desktop.matches && useUIStore.getState().sidebarOpen) useUIStore.getState().toggleSidebar();
		};
		closeOnDesktop();
		desktop.addEventListener("change", closeOnDesktop);
		return () => desktop.removeEventListener("change", closeOnDesktop);
	}, []);

	function closeSidebar() {
		if (sidebarOpen) toggleSidebar();
	}
	const content = (
		<>
			<div className="flex h-24 shrink-0 items-center justify-between px-6">
				<Link href="/dashboard" aria-label="Trackwise overview" onClick={closeSidebar}>
					<Brand />
				</Link>
				<Button type="button" variant="ghost" size="icon-sm" className="lg:hidden" onClick={closeSidebar} aria-label="Close navigation">
					<X />
				</Button>
			</div>
			<nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-4">
				<p className="mb-3 px-3 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
				<div className="space-y-1">
					{navItems.map(({ href, label, icon: Icon }) => (
						<Link
							key={href}
							href={href}
							onClick={closeSidebar}
							aria-current={pathname === href ? "page" : undefined}
							className={twMerge(
								"flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium transition-colors",
								pathname === href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<Icon size={18} strokeWidth={1.7} />
							{label}
							{pathname === href && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
						</Link>
					))}
				</div>
				<div className="mt-8 border-t border-border pt-4">
					<Link
						href="/dashboard/settings"
						onClick={closeSidebar}
						aria-current={pathname === "/dashboard/settings" ? "page" : undefined}
						className={twMerge(
							"flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium",
							pathname === "/dashboard/settings" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted",
						)}
					>
						<Settings size={18} strokeWidth={1.7} />
						Settings
					</Link>
				</div>
			</nav>
			<div className="mx-5 mb-6 rounded-xl border border-border bg-background p-4">
				<span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">A little clarity, every day</span>
				<p className="text-sm leading-relaxed">
					Your money.
					<br />
					<span className="font-display font-semibold">A clearer perspective.</span>
				</p>
				<Link
					href="/dashboard/transactions"
					onClick={closeSidebar}
					className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"
				>
					View your activity <ArrowUpRight size={13} />
				</Link>
			</div>
			<div className="flex items-center gap-3 border-t border-border p-5">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
					{user?.email?.charAt(0).toUpperCase() || "U"}
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-xs font-semibold">Personal workspace</p>
					<p className="mt-1 truncate text-[11px] text-muted-foreground">{user?.email}</p>
				</div>
				<Button type="button" variant="ghost" size="icon-sm" onClick={signOut} aria-label="Sign out" title="Sign out">
					<LogOut size={16} />
				</Button>
			</div>
		</>
	);
	return (
		<>
			<aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-sidebar text-sidebar-foreground pt-[env(safe-area-inset-top)] lg:flex">
				{content}
			</aside>
			<DialogPrimitive.Root
				open={sidebarOpen}
				onOpenChange={(open) => {
					if (open !== sidebarOpen) toggleSidebar();
				}}
			>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[3px] lg:hidden" />
					<DialogPrimitive.Content
						onOpenAutoFocus={() => {
							returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
						}}
						onCloseAutoFocus={(event) => {
							event.preventDefault();
							returnFocus.current?.focus();
						}}
						aria-describedby={undefined}
						className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-sidebar text-sidebar-foreground pt-[env(safe-area-inset-top)] outline-none lg:hidden"
					>
						<DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
						{content}
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</>
	);
}
