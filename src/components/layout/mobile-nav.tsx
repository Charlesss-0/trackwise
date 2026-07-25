"use client";

import { ArrowLeftRight, CreditCard, LayoutDashboard, Menu, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

const mainItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Wallet },
  { href: "/dashboard/transactions", label: "Add", icon: ArrowLeftRight },
  { href: "/dashboard/debts", label: "Debts", icon: CreditCard },
];

export function MobileNav() {
  const pathname = usePathname();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-base-300 bg-base-200 z-30 pb-safe">
      <div className="flex items-center justify-around h-16">
        {mainItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${isActive ? "text-primary" : "text-base-content/60"}`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={toggleSidebar} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-base-content/60">
          <Menu size={20} />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
}
