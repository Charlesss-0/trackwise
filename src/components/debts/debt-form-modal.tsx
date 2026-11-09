"use client";

import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/confirm-dialog";
import { ErrorNotice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
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
			<form
				onSubmit={(event) => {
					void handleSubmit(event).catch(() => {});
				}}
				className="flex flex-col gap-4"
			>
				<div className="field">
					<Label htmlFor="creditor">
						<span className="text-sm">Creditor Name</span>
					</Label>
					<Input
						id="creditor"
						type="text"
						className="w-full"
						placeholder="e.g. Chase Visa"
						value={creditorName}
						onChange={(e) => setCreditorName(e.target.value)}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="field">
						<Label htmlFor="total-amount">
							<span className="text-sm">Total Amount</span>
						</Label>
						<Input
							id="total-amount"
							type="number"
							step="0.01"
							min="0.01"
							className="w-full"
							value={totalAmount}
							onChange={(e) => {
								setTotalAmount(e.target.value);
								if (!isEditing && !remainingBalance) setRemainingBalance(e.target.value);
							}}
							required
						/>
					</div>

					<div className="field">
						<Label htmlFor="remaining">
							<span className="text-sm">Remaining Balance</span>
						</Label>
						<Input
							id="remaining"
							type="number"
							step="0.01"
							min="0"
							className="w-full"
							value={remainingBalance}
							onChange={(e) => setRemainingBalance(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="field">
						<Label htmlFor="monthly">
							<span className="text-sm">Monthly Payment</span>
						</Label>
						<Input
							id="monthly"
							type="number"
							step="0.01"
							min="0.01"
							className="w-full"
							value={monthlyPayment}
							onChange={(e) => setMonthlyPayment(e.target.value)}
							required
						/>
					</div>

					<div className="field">
						<Label htmlFor="due-day">
							<span className="text-sm">Due Day (1-31)</span>
						</Label>
						<Input
							id="due-day"
							type="number"
							min="1"
							max="31"
							className="w-full"
							value={dueDay}
							onChange={(e) => setDueDay(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="field">
					<Label htmlFor="debt-currency">
						<span className="text-sm">Currency</span>
					</Label>
					<NativeSelect id="debt-currency" className="w-full" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
						<option value="USD">USD (Dollar)</option>
						<option value="NIO">NIO (Córdoba)</option>
					</NativeSelect>
				</div>

				<ErrorNotice error={createDebt.error || updateDebt.error || deleteDebt.error} />
				<div className="form-actions">
					{isEditing && (
						<DeleteButton
							type="button"
							variant="destructive"
							size="default"
							className="mr-auto"
							message="Are you sure you want to delete this debt?"
							onConfirm={() => {
								deleteDebt.mutate(debt.id);
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
					<Button type="submit" variant="default" size="default" disabled={isPending || !creditorName.trim()}>
						{isPending && <LoadingSpinner size="sm" />}
						{isEditing ? "Save Changes" : "Add Debt"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
