"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useCreateDebt, useDeleteDebt, useUpdateDebt } from "@/hooks/use-debts";
import type { Currency, Debt } from "@/types";

type DebtFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
	debt?: Debt | null;
};

export function DebtFormModal({ isOpen, onClose, debt }: DebtFormModalProps) {
	const isEditing = !!debt;

	const [creditorName, setCreditorName] = useState(debt?.creditor_name ?? "");
	const [totalAmount, setTotalAmount] = useState(debt?.total_amount?.toString() ?? "");
	const [remainingBalance, setRemainingBalance] = useState(debt?.remaining_balance?.toString() ?? "");
	const [monthlyPayment, setMonthlyPayment] = useState(debt?.monthly_payment?.toString() ?? "");
	const [dueDay, setDueDay] = useState(debt?.due_day?.toString() ?? "1");
	const [currency, setCurrency] = useState<Currency>(debt?.currency ?? "USD");

	useEffect(() => {
		if (isOpen) {
			setCreditorName(debt?.creditor_name ?? "");
			setTotalAmount(debt?.total_amount?.toString() ?? "");
			setRemainingBalance(debt?.remaining_balance?.toString() ?? "");
			setMonthlyPayment(debt?.monthly_payment?.toString() ?? "");
			setDueDay(debt?.due_day?.toString() ?? "1");
			setCurrency(debt?.currency ?? "USD");
		}
	}, [isOpen, debt]);

	const createDebt = useCreateDebt();
	const updateDebt = useUpdateDebt();
	const deleteDebt = useDeleteDebt();
	const isPending = createDebt.isPending || updateDebt.isPending || deleteDebt.isPending;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!creditorName.trim()) return;

		const total = Number.parseFloat(totalAmount);
		const remaining = Number.parseFloat(remainingBalance);
		const monthly = Number.parseFloat(monthlyPayment);
		const day = Number.parseInt(dueDay);

		if (total <= 0 || remaining < 0 || monthly <= 0 || day < 1 || day > 31) return;

		if (isEditing && debt) {
			await updateDebt.mutateAsync({
				id: debt.id,
				creditor_name: creditorName.trim(),
				total_amount: total,
				remaining_balance: remaining,
				monthly_payment: monthly,
				due_day: day,
				currency,
			});
		} else {
			await createDebt.mutateAsync({
				creditor_name: creditorName.trim(),
				total_amount: total,
				remaining_balance: remaining,
				monthly_payment: monthly,
				due_day: day,
				currency,
			});
		}

		handleClose();
	};

	const handleClose = () => {
		if (!isEditing) {
			setCreditorName("");
			setTotalAmount("");
			setRemainingBalance("");
			setMonthlyPayment("");
			setDueDay("1");
			setCurrency("USD");
		}
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Edit Debt" : "Add Debt"}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="form-control">
					<label className="label" htmlFor="creditor">
						<span className="label-text">Creditor Name</span>
					</label>
					<input
						id="creditor"
						type="text"
						className="input input-bordered w-full"
						placeholder="e.g. Chase Visa"
						value={creditorName}
						onChange={(e) => setCreditorName(e.target.value)}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="form-control">
						<label className="label" htmlFor="total-amount">
							<span className="label-text">Total Amount</span>
						</label>
						<input
							id="total-amount"
							type="number"
							step="0.01"
							min="0.01"
							className="input input-bordered w-full"
							value={totalAmount}
							onChange={(e) => {
								setTotalAmount(e.target.value);
								if (!isEditing && !remainingBalance) setRemainingBalance(e.target.value);
							}}
							required
						/>
					</div>

					<div className="form-control">
						<label className="label" htmlFor="remaining">
							<span className="label-text">Remaining Balance</span>
						</label>
						<input
							id="remaining"
							type="number"
							step="0.01"
							min="0"
							className="input input-bordered w-full"
							value={remainingBalance}
							onChange={(e) => setRemainingBalance(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="form-control">
						<label className="label" htmlFor="monthly">
							<span className="label-text">Monthly Payment</span>
						</label>
						<input
							id="monthly"
							type="number"
							step="0.01"
							min="0.01"
							className="input input-bordered w-full"
							value={monthlyPayment}
							onChange={(e) => setMonthlyPayment(e.target.value)}
							required
						/>
					</div>

					<div className="form-control">
						<label className="label" htmlFor="due-day">
							<span className="label-text">Due Day (1-31)</span>
						</label>
						<input
							id="due-day"
							type="number"
							min="1"
							max="31"
							className="input input-bordered w-full"
							value={dueDay}
							onChange={(e) => setDueDay(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="form-control">
					<label className="label" htmlFor="debt-currency">
						<span className="label-text">Currency</span>
					</label>
					<select
						id="debt-currency"
						className="select select-bordered w-full"
						value={currency}
						onChange={(e) => setCurrency(e.target.value as Currency)}
					>
						<option value="USD">USD (Dollar)</option>
						<option value="NIO">NIO (Córdoba)</option>
					</select>
				</div>

				<div className="modal-action">
					{isEditing && (
						<button
							type="button"
							className="btn btn-error mr-auto"
							onClick={() => {
								if (confirm("Are you sure you want to delete this debt?")) {
									deleteDebt.mutate(debt.id);
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
					<button type="submit" className="btn btn-primary" disabled={isPending || !creditorName.trim()}>
						{isPending && <span className="loading loading-spinner loading-sm" />}
						{isEditing ? "Save Changes" : "Add Debt"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
