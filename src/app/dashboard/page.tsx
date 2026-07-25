"use client";
import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { useAccounts } from "@/hooks/use-accounts";
import { useDebts } from "@/hooks/use-debts";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useUIStore } from "@/stores/ui-store";
import { convertCurrency, formatCurrency, getAmountOwed } from "@/utils/currency";

export default function DashboardPage() {
  const { data: accounts = [] } = useAccounts();
  const { data: debts = [] } = useDebts();
  const { data: rate = 36.5 } = useExchangeRate();
  const homeCurrency = useUIStore((s) => s.homeCurrency);

  const totalAssets = accounts.reduce((acc, account) => {
    if (account.type === "credit") return acc;
    const amount = account.currency === homeCurrency ? account.balance : convertCurrency(account.balance, account.currency, homeCurrency, rate);
    return acc + amount;
  }, 0);

  const totalDebts =
    debts.reduce((acc, debt) => {
      const amount =
        debt.currency === homeCurrency ? debt.remaining_balance : convertCurrency(debt.remaining_balance, debt.currency, homeCurrency, rate);
      return acc + amount;
    }, 0) +
    accounts.reduce((acc, account) => {
      if (account.type !== "credit") return acc;
      const owed = getAmountOwed(account);
      const amount = account.currency === homeCurrency ? owed : convertCurrency(owed, account.currency, homeCurrency, rate);
      return acc + amount;
    }, 0);

  const netWorth = totalAssets - totalDebts;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Net Worth"
          value={formatCurrency(netWorth, homeCurrency)}
          icon={<Wallet />}
          trend={netWorth >= 0 ? "positive" : "negative"}
        />

        <StatCard label="Total Assets" value={formatCurrency(totalAssets, homeCurrency)} icon={<TrendingUp />} trend="positive" />

        <StatCard label="Total Debts" value={formatCurrency(totalDebts, homeCurrency)} icon={<TrendingDown />} trend="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg justify-between mb-4">
              Accounts
              <Link href="/dashboard/accounts" className="btn btn-sm btn-ghost">
                View All
              </Link>
            </h2>

            <div className="space-y-3">
              {accounts.slice(0, 5).map((acc) => {
                const isCredit = acc.type === "credit";
                const amountOwed = getAmountOwed(acc);

                return (
                  <div key={acc.id} className="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-300">
                    <div>
                      <p className="font-medium">{acc.name}</p>

                      <p className="text-xs text-base-content/60 capitalize">{acc.type}</p>
                    </div>

                    {isCredit ? (
                      <div className="text-right">
                        <div className="text-sm text-base-content/60">{formatCurrency(acc.available_balance ?? 0, acc.currency)} available</div>

                        <div className={`font-medium text-error`}>{formatCurrency(amountOwed, acc.currency)} owed</div>
                      </div>
                    ) : (
                      <div className="font-medium">{formatCurrency(acc.balance, acc.currency)}</div>
                    )}
                  </div>
                );
              })}
              {accounts.length === 0 && <p className="text-base-content/60 text-center py-4">No accounts added yet.</p>}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg justify-between mb-4">
              Debts
              <Link href="/dashboard/debts" className="btn btn-sm btn-ghost">
                View All
              </Link>
            </h2>

            <div className="space-y-3">
              {debts.slice(0, 5).map((debt) => (
                <div key={debt.id} className="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center">
                      <CreditCard size={16} />
                    </div>

                    <div>
                      <p className="font-medium">{debt.creditor_name}</p>

                      <p className="text-xs text-base-content/60">Due day {debt.due_day}</p>
                    </div>
                  </div>

                  <div className="font-medium text-error">{formatCurrency(debt.remaining_balance, debt.currency)}</div>
                </div>
              ))}

              {debts.length === 0 && <p className="text-base-content/60 text-center py-4">No debts added yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
