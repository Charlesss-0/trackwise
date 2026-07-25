"use client";

import { format } from "date-fns";
import { type SubmitEvent, useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useAccounts } from "@/hooks/use-accounts";
import { useCategories } from "@/hooks/use-categories";
import { useCreateTransaction, useDeleteTransaction, useUpdateTransaction } from "@/hooks/use-transactions";
import type { Currency, RecurringFreq, Transaction, TxnType } from "@/types";

type TransactionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
};

export function TransactionFormModal({ isOpen, onClose, transaction }: TransactionFormModalProps) {
  const isEditing = !!transaction;

  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const [type, setType] = useState<TxnType>(transaction?.type ?? "expense");
  const [amount, setAmount] = useState<string>(transaction?.amount?.toString() ?? "");
  const [currency, setCurrency] = useState<Currency>(transaction?.currency ?? "NIO");
  const [accountId, setAccountId] = useState<string>(transaction?.account_id ?? "");
  const [categoryId, setCategoryId] = useState<string>(transaction?.category_id ?? "");
  const [date, setDate] = useState<string>(transaction?.date ?? format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState<string>(transaction?.note ?? "");
  const [isRecurring, setIsRecurring] = useState<boolean>(transaction?.is_recurring ?? false);
  const [frequency, setFrequency] = useState<RecurringFreq>(transaction?.recurring_frequency ?? "monthly");
  const [recurringDueDay, setRecurringDueDay] = useState<string>(transaction?.recurring_due_day ? String(transaction.recurring_due_day) : "");

  useEffect(() => {
    if (isOpen) {
      setType(transaction?.type ?? "expense");
      setAmount(transaction?.amount?.toString() ?? "");
      setCurrency(transaction?.currency ?? "NIO");
      setAccountId(transaction?.account_id ?? "");
      setCategoryId(transaction?.category_id ?? "");
      setDate(transaction?.date ?? format(new Date(), "yyyy-MM-dd"));
      setNote(transaction?.note ?? "");
      setIsRecurring(transaction?.is_recurring ?? false);
      setFrequency(transaction?.recurring_frequency ?? "monthly");
      setRecurringDueDay(transaction?.recurring_due_day ? String(transaction.recurring_due_day) : "");
    }
  }, [isOpen, transaction]);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const isPending = createTransaction.isPending || updateTransaction.isPending || deleteTransaction.isPending;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const amountNum = Number.parseFloat(amount);
    if (!amountNum || amountNum <= 0) return;
    if (!accountId || !categoryId) return;

    const payload = {
      type,
      amount: amountNum,
      currency,
      account_id: accountId,
      category_id: categoryId,
      date,
      note: note.trim() || null,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? frequency : null,
      recurring_due_day: isRecurring ? Number.parseInt(recurringDueDay, 10) : null,
    };

    if (isEditing && transaction) {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        ...payload,
      });
    } else {
      await createTransaction.mutateAsync(payload);
    }

    handleClose();
  };

  const handleClose = () => {
    setType("expense");
    setAmount("");
    setCurrency("NIO");
    setAccountId("");
    setCategoryId("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setNote("");
    setIsRecurring(false);
    setFrequency("monthly");
    setRecurringDueDay("1");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Edit Transaction" : "Add Transaction"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-control">
          <div className="flex gap-2">
            <button type="button" className={`btn flex-1 ${type === "expense" ? "btn-error" : "btn-ghost"}`} onClick={() => setType("expense")}>
              Expense
            </button>
            <button type="button" className={`btn flex-1 ${type === "income" ? "btn-success" : "btn-ghost"}`} onClick={() => setType("income")}>
              Income
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="form-control flex-1">
            <label className="label" htmlFor="tx-amount">
              <span className="label-text">Amount</span>
            </label>

            <input
              id="tx-amount"
              type="number"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-28">
            <label className="label" htmlFor="tx-currency">
              <span className="label-text">Currency</span>
            </label>

            <select
              id="tx-currency"
              className="select select-bordered w-full"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              <option value="NIO">NIO</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="tx-account">
            <span className="label-text">Account</span>
          </label>

          <select id="tx-account" className="select select-bordered w-full" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="" disabled>
              Select account
            </option>

            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.currency})
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="tx-category">
            <span className="label-text">Category</span>
          </label>

          <select
            id="tx-category"
            className="select select-bordered w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select category
            </option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="tx-date">
            <span className="label-text">Date</span>
          </label>

          <input id="tx-date" type="date" className="input input-bordered w-full" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="tx-note">
            <span className="label-text">Note</span>
          </label>

          <textarea
            id="tx-note"
            className="textarea textarea-bordered w-full"
            placeholder="Optional description"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer" htmlFor="tx-recurring">
            <span className="label-text">Recurring</span>

            <input
              id="tx-recurring"
              type="checkbox"
              className="toggle toggle-primary"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
          </label>
        </div>

        {isRecurring && (
          <div className="flex gap-2">
            <div className="form-control flex-1">
              <label className="label" htmlFor="tx-frequency">
                <span className="label-text">Frequency</span>
              </label>

              <select
                id="tx-frequency"
                className="select select-bordered w-full"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as RecurringFreq)}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="form-control w-24">
              <label className="label" htmlFor="tx-due-day">
                <span className="label-text">Due Day</span>
              </label>

              <input
                id="tx-due-day"
                type="number"
                min="1"
                max="31"
                className="input input-bordered w-full"
                value={recurringDueDay}
                onChange={(e) => setRecurringDueDay(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="modal-action">
          {isEditing && (
            <button
              type="button"
              className="btn btn-error mr-auto"
              onClick={() => {
                if (confirm("Are you sure you want to delete this transaction?")) {
                  deleteTransaction.mutate(transaction);
                  handleClose();
                }
              }}
              disabled={isPending}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isPending}>
            Cancel
          </button>

          <button type="submit" className="btn btn-primary" disabled={isPending || !amount || !accountId || !categoryId}>
            {isPending && <span className="loading loading-spinner loading-sm" />}
            {isEditing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
