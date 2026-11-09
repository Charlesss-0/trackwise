"use client";

import { format } from "date-fns";
import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/confirm-dialog";
import { ErrorNotice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
			<form
				onSubmit={(event) => {
					void handleSubmit(event).catch(() => {});
				}}
				className="flex flex-col gap-4"
			>
				<div className="field">
					<div className="flex gap-2">
						<Button
							type="button"
							variant={type === "expense" ? "secondary" : "ghost"}
							aria-pressed={type === "expense"}
							className="flex-1"
							onClick={() => setType("expense")}
						>
							Expense
						</Button>
						<Button
							type="button"
							variant={type === "income" ? "secondary" : "ghost"}
							aria-pressed={type === "income"}
							className="flex-1"
							onClick={() => setType("income")}
						>
							Income
						</Button>
					</div>
				</div>

				<div className="flex gap-2">
					<div className="field flex-1">
						<Label htmlFor="tx-amount">
							<span className="text-sm">Amount</span>
						</Label>

						<Input
							id="tx-amount"
							type="number"
							step="0.01"
							min="0.01"
							className="w-full"
							placeholder="0.00"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
						/>
					</div>

					<div className="field w-28">
						<Label htmlFor="tx-currency">
							<span className="text-sm">Currency</span>
						</Label>

						<NativeSelect id="tx-currency" className="w-full" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
							<option value="NIO">NIO</option>
							<option value="USD">USD</option>
						</NativeSelect>
					</div>
				</div>

				<div className="field">
					<Label htmlFor="tx-account">
						<span className="text-sm">Account</span>
					</Label>

					<NativeSelect id="tx-account" className="w-full" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
						<option value="" disabled>
							Select account
						</option>

						{accounts.map((acc) => (
							<option key={acc.id} value={acc.id}>
								{acc.name} ({acc.currency})
							</option>
						))}
					</NativeSelect>
				</div>

				<div className="field">
					<Label htmlFor="tx-category">
						<span className="text-sm">Category</span>
					</Label>

					<NativeSelect id="tx-category" className="w-full" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
						<option value="" disabled>
							Select category
						</option>

						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</NativeSelect>
				</div>

				<div className="field">
					<Label htmlFor="tx-date">
						<span className="text-sm">Date</span>
					</Label>

					<Input id="tx-date" type="date" className="w-full" value={date} onChange={(e) => setDate(e.target.value)} required />
				</div>

				<div className="field">
					<Label htmlFor="tx-note">
						<span className="text-sm">Note</span>
					</Label>

					<Textarea
						id="tx-note"
						className="w-full"
						placeholder="Optional description"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						rows={2}
					/>
				</div>

				<div className="field">
					<Label className="justify-between rounded-lg border border-border bg-muted/40 p-3 cursor-pointer" htmlFor="tx-recurring">
						<span className="text-sm">Recurring</span>

						<Switch id="tx-recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
					</Label>
				</div>

				{isRecurring && (
					<div className="flex gap-2">
						<div className="field flex-1">
							<Label htmlFor="tx-frequency">
								<span className="text-sm">Frequency</span>
							</Label>

							<NativeSelect id="tx-frequency" className="w-full" value={frequency} onChange={(e) => setFrequency(e.target.value as RecurringFreq)}>
								<option value="weekly">Weekly</option>
								<option value="biweekly">Biweekly</option>
								<option value="monthly">Monthly</option>
								<option value="yearly">Yearly</option>
							</NativeSelect>
						</div>

						<div className="field w-24">
							<Label htmlFor="tx-due-day">
								<span className="text-sm">Due Day</span>
							</Label>

							<Input
								id="tx-due-day"
								type="number"
								min="1"
								max="31"
								className="w-full"
								value={recurringDueDay}
								onChange={(e) => setRecurringDueDay(e.target.value)}
							/>
						</div>
					</div>
				)}

				<ErrorNotice error={createTransaction.error || updateTransaction.error || deleteTransaction.error} />
				<div className="form-actions">
					{isEditing && (
						<DeleteButton
							type="button"
							variant="destructive"
							size="default"
							className="mr-auto"
							message="Are you sure you want to delete this transaction?"
							onConfirm={() => {
								deleteTransaction.mutate(transaction);
								handleClose();
							}}
							disabled={isPending}
						>
							Delete
						</DeleteButton>
					)}
					<Button type="button" variant="ghost" size="default" onClick={handleClose} disabled={isPending}>
						Cancel
					</Button>

					<Button type="submit" variant="default" size="default" disabled={isPending || !amount || !accountId || !categoryId}>
						{isPending && <LoadingSpinner size="sm" />}
						{isEditing ? "Save Changes" : "Add Transaction"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
