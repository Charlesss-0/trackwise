"use client";

import { ArrowLeftRight, CreditCard, LayoutDashboard, LogOut, RotateCw, Settings, Tags, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Wallet },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  { href: "/dashboard/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/recurring", label: "Recurring", icon: RotateCw },
  { href: "/dashboard/debts", label: "Debts", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, signOut } = useAuth();

  const sidebarClass = sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

  return (
    <>
      {sidebarOpen && <button type="button" className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={toggleSidebar} />}

      <aside
        className={`flex flex-col fixed top-0 left-0 z-30 h-screen w-64 bg-base-200 border-r border-base-300 transition-transform duration-300 ease-in-out ${sidebarClass}`}
      >
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="flex items-center justify-between h-16 px-6 border-b border-base-300">
            <Link href="/dashboard" className="text-xl font-bold text-primary tracking-tight">
              Trackwise
            </Link>

            <button type="button" className="lg:hidden btn btn-sm btn-ghost btn-circle" onClick={toggleSidebar}>
              <X size={20} />
            </button>
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-primary text-primary-content font-medium" : "hover:bg-base-300 text-base-content/80"}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-base-300 bg-base-200/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="flex-1 truncate text-sm font-medium text-base-content/80">{user?.email}</div>
          </div>

          <button type="button" onClick={signOut} className="btn btn-outline btn-error btn-sm w-full gap-2">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
