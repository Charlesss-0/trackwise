"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { AccountFormModal } from "@/components/accounts/account-form-modal";
import { useAccounts, useUpdateAccount } from "@/hooks/use-accounts";
import type { Account } from "@/types/database";
import { formatCurrency, getAmountOwed } from "@/utils/currency";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const [modalOpen, setModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | undefined>(undefined);
  const [quickUpdateId, setQuickUpdateId] = useState<string | null>(null);
  const [quickUpdateValue, setQuickUpdateValue] = useState("");
  const updateAccount = useUpdateAccount();

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const handleQuickUpdate = async (acc: Account) => {
    const newAvailable = Number.parseFloat(quickUpdateValue);
    if (Number.isNaN(newAvailable) || newAvailable < 0 || (acc.credit_limit != null && newAvailable > acc.credit_limit)) return;
    const newBalance = (acc.credit_limit ?? 0) - newAvailable;
    await updateAccount.mutateAsync({
      id: acc.id,
      available_balance: newAvailable,
      balance: newBalance,
    });
    setQuickUpdateId(null);
    setQuickUpdateValue("");
  };

  const startQuickUpdate = (acc: Account) => {
    setQuickUpdateId(acc.id);
    setQuickUpdateValue(acc.available_balance?.toString() ?? "");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button
          type="button"
          onClick={() => {
            setAccountToEdit(undefined);
            setModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} /> Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts?.map((acc) => {
          const isCredit = acc.type === "credit";
          const amountOwed = getAmountOwed(acc);
          const utilization = isCredit && acc.credit_limit ? (amountOwed / acc.credit_limit) * 100 : 0;

          return (
            <div
              key={acc.id}
              className="card bg-base-200 border border-base-300 cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                setAccountToEdit(acc);
                setModalOpen(true);
              }}
            >
              <div className="card-body p-5">
                <h2 className="card-title text-base justify-between">
                  {acc.name}
                  <div
                    className={`badge badge-sm badge-outline capitalize ${isCredit ? "badge-error" : acc.type === "debit" ? "badge-success" : ""}`}
                  >
                    {acc.type}
                  </div>
                </h2>

                {isCredit ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Available</span>
                      <span className="font-medium">{formatCurrency(acc.available_balance ?? 0, acc.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Credit Limit</span>
                      <span className="font-medium">{formatCurrency(acc.credit_limit ?? 0, acc.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Amount Owed</span>
                      <span className="font-medium text-error">{formatCurrency(amountOwed, acc.currency)}</span>
                    </div>
                    {acc.credit_limit != null && acc.credit_limit > 0 && (
                      <div className="mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-base-content/50">Utilization</span>
                          <span className="text-base-content/50">{Math.round(utilization)}%</span>
                        </div>
                        <progress
                          className={`progress w-full ${utilization > 80 ? "progress-error" : utilization > 50 ? "progress-warning" : "progress-success"}`}
                          value={utilization}
                          max={100}
                        />
                      </div>
                    )}
                    {quickUpdateId === acc.id ? (
                      <div className="flex gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          className="input input-bordered input-sm flex-1"
                          value={quickUpdateValue}
                          onChange={(e) => setQuickUpdateValue(e.target.value)}
                          min={0}
                          max={acc.credit_limit ?? undefined}
                          step="0.01"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleQuickUpdate(acc);
                            if (e.key === "Escape") setQuickUpdateId(null);
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleQuickUpdate(acc)}
                          disabled={updateAccount.isPending}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs w-full mt-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          startQuickUpdate(acc);
                        }}
                      >
                        <RefreshCw size={12} /> Update Balance
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-2xl font-bold mt-2">{formatCurrency(acc.balance, acc.currency)}</p>
                )}
              </div>
            </div>
          );
        })}
        {accounts?.length === 0 && (
          <div className="col-span-full py-12 text-center text-base-content/60 bg-base-200 rounded-box border border-base-300 border-dashed">
            <p>No accounts found. Create one to get started.</p>
          </div>
        )}
      </div>

      <AccountFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} account={accountToEdit} />
    </div>
  );
}
