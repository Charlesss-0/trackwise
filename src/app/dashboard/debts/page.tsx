"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DebtFormModal } from "@/components/debts/debt-form-modal";
import { useDebts, useDeleteDebt } from "@/hooks/use-debts";
import type { Debt } from "@/types/database";
import { formatCurrency } from "@/utils/currency";

export default function DebtsPage() {
  const { data: debts, isLoading } = useDebts();
  const deleteDebt = useDeleteDebt();
  const [modalOpen, setModalOpen] = useState(false);
  const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debts & Loans</h1>
        <button
          type="button"
          onClick={() => {
            setDebtToEdit(null);
            setModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} /> Add Debt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {debts?.map((debt) => {
          const progress = ((debt.total_amount - debt.remaining_balance) / debt.total_amount) * 100;

          return (
            <div key={debt.id} className="card bg-base-200 border border-base-300">
              <div className="card-body p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-lg">{debt.creditor_name}</h2>
                    <p className="text-sm text-base-content/60">Due on day {debt.due_day} of every month</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-square btn-sm btn-ghost"
                      onClick={() => {
                        setDebtToEdit(debt);
                        setModalOpen(true);
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-square btn-sm btn-ghost text-error"
                      onClick={() => {
                        if (confirm("Delete this debt?")) {
                          deleteDebt.mutate(debt.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wider">Remaining</p>
                    <p className="text-2xl font-bold text-error mt-1">{formatCurrency(debt.remaining_balance, debt.currency)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wider">Monthly Payment</p>
                    <p className="text-lg font-semibold mt-1">{formatCurrency(debt.monthly_payment, debt.currency)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Paid: {formatCurrency(debt.total_amount - debt.remaining_balance, debt.currency)}</span>
                    <span>Total: {formatCurrency(debt.total_amount, debt.currency)}</span>
                  </div>
                  <progress className="progress progress-success w-full h-2" value={progress} max="100"></progress>
                </div>
              </div>
            </div>
          );
        })}
        {debts?.length === 0 && (
          <div className="col-span-full py-12 text-center text-base-content/60 bg-base-200 rounded-box border border-base-300 border-dashed">
            <p>No debts found. You are debt free!</p>
          </div>
        )}
      </div>

      <DebtFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} debt={debtToEdit} />
    </div>
  );
}
