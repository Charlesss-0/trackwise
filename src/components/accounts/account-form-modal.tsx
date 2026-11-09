"use client";

import { type SubmitEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/confirm-dialog";
import { ErrorNotice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { useCreateAccount, useDeleteAccount, useUpdateAccount } from "@/hooks/use-accounts";
import type { Account, AccountType, Currency } from "@/types";
import { formatCurrency } from "@/utils/currency";

type AccountFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
	account?: Account | null;
};

export function AccountFormModal({ isOpen, onClose, account }: AccountFormModalProps) {
	const isEditing = !!account;

	const [name, setName] = useState<string>(account?.name ?? "");
	const [type, setType] = useState<AccountType>(account?.type ?? "debit");
	const [currency, setCurrency] = useState<Currency>(account?.currency ?? "NIO");
	const [balance, setBalance] = useState<string>(account?.balance?.toString() ?? "0");
	const [creditLimit, setCreditLimit] = useState<string>(account?.credit_limit?.toString() ?? "");
	const [availableBalance, setAvailableBalance] = useState<string>(account?.available_balance?.toString() ?? "0");

	useEffect(() => {
		if (isOpen) {
			setName(account?.name ?? "");
			setType(account?.type ?? "debit");
			setCurrency(account?.currency ?? "NIO");
			setBalance(account?.balance.toString() ?? "0");
			setCreditLimit(account?.credit_limit?.toString() ?? "0");
			setAvailableBalance(account?.available_balance?.toString() ?? "");
		}
	}, [isOpen, account]);

	const isCredit = type === "credit";

	const amountOwed = useMemo(() => {
		if (!isCredit) return null;
		const limit = Number.parseFloat(creditLimit) || 0;
		const available = Number.parseFloat(availableBalance) || 0;
		return limit - available;
	}, [isCredit, creditLimit, availableBalance]);

	const creditValidationError = useMemo(() => {
		if (!isCredit) return "";
		const limit = Number.parseFloat(creditLimit);
		const available = Number.parseFloat(availableBalance);

		if (limit || available) return "";
		if (limit < 0) return "Credit limit cannot be negative";
		if (available < 0) return "Available balance cannot be negative";
		if (available > limit) return "Available balance cannot exceed credit limit";

		return "";
	}, [isCredit, creditLimit, availableBalance]);

	const createAccount = useCreateAccount();
	const updateAccount = useUpdateAccount();
	const deleteAccount = useDeleteAccount();
	const isPending = createAccount.isPending || updateAccount.isPending || deleteAccount.isPending;

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!name.trim()) return;

		if (isCredit) {
			if (creditValidationError) return;
			const limit = Number.parseFloat(creditLimit) || 0;
			const available = Number.parseFloat(availableBalance) || 0;
			const owed = limit - available;

			if (isEditing && account) {
				await updateAccount.mutateAsync({
					id: account.id,
					name: name.trim(),
					type,
					currency,
					balance: owed,
					credit_limit: limit,
					available_balance: available,
				});
			} else {
				await createAccount.mutateAsync({
					name: name.trim(),
					type,
					currency,
					balance: owed,
					credit_limit: limit,
					available_balance: available,
				});
			}
		} else {
			const balanceNum = Number.parseFloat(balance) || 0;
			if (balanceNum < 0) return;

			if (isEditing && account) {
				await updateAccount.mutateAsync({
					id: account.id,
					name: name.trim(),
					type,
					currency,
					balance: balanceNum,
					credit_limit: null,
					available_balance: null,
				});
			} else {
				await createAccount.mutateAsync({
					name: name.trim(),
					type,
					currency,
					balance: balanceNum,
					credit_limit: null,
					available_balance: null,
				});
			}
		}

		handleClose();
	};

	const handleClose = () => {
		setName("");
		setType("debit");
		setCurrency("NIO");
		setBalance("0");
		setCreditLimit("");
		setAvailableBalance("");
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Edit Account" : "Add Account"}>
			<form
				onSubmit={(event) => {
					void handleSubmit(event).catch(() => {});
				}}
				className="flex flex-col gap-4"
			>
				<div className="field">
					<Label htmlFor="account-name">
						<span className="text-sm">Account Name</span>
					</Label>

					<Input
						id="account-name"
						type="text"
						className="w-full"
						placeholder="e.g. BAC Savings"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div className="field">
					<Label htmlFor="account-type">
						<span className="text-sm">Type</span>
					</Label>

					<NativeSelect id="account-type" className="w-full" value={type} onChange={(e) => setType(e.target.value as AccountType)}>
						<option value="debit">Debit</option>
						<option value="credit">Credit Card</option>
						<option value="cash">Cash</option>
						<option value="savings">Savings</option>
					</NativeSelect>
				</div>

				<div className="field">
					<Label htmlFor="account-currency">
						<span className="text-sm">Currency</span>
					</Label>

					<NativeSelect id="account-currency" className="w-full" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
						<option value="NIO">NIO (Córdoba)</option>
						<option value="USD">USD (Dollar)</option>
					</NativeSelect>
				</div>

				{isCredit ? (
					<>
						<div className="field">
							<Label htmlFor="account-credit-limit">
								<span className="text-sm">Credit Limit</span>
							</Label>

							<Input
								id="account-credit-limit"
								type="number"
								step="0.01"
								min="0"
								className="w-full"
								placeholder="e.g. 5000"
								value={creditLimit}
								onChange={(e) => setCreditLimit(e.target.value)}
								required
							/>
						</div>

						<div className="field">
							<Label htmlFor="account-available-balance">
								<span className="text-sm">Available Balance</span>
							</Label>

							<Input
								id="account-available-balance"
								type="number"
								step="0.01"
								min="0"
								className="w-full"
								placeholder="e.g. 2500"
								value={availableBalance}
								onChange={(e) => setAvailableBalance(e.target.value)}
								required
							/>

							{creditValidationError && (
								<div>
									<span className="text-xs text-destructive">{creditValidationError}</span>
								</div>
							)}
						</div>

						{amountOwed !== null && (
							<div className="field">
								<Label htmlFor="account-amount-owed">
									<span className="text-sm">Amount Owed</span>
								</Label>

								<Input
									id="account-amount-owed"
									type="text"
									className="w-full text-destructive font-medium"
									value={formatCurrency(amountOwed, currency)}
									readOnly
									tabIndex={-1}
								/>
							</div>
						)}
					</>
				) : (
					<div className="field">
						<Label htmlFor="account-balance">
							<span className="text-sm">{isEditing ? "Balance" : "Initial Balance"}</span>
						</Label>

						<Input
							id="account-balance"
							type="number"
							step="0.01"
							className="w-full"
							value={balance}
							onChange={(e) => setBalance(e.target.value)}
							min={0}
						/>
					</div>
				)}

				<ErrorNotice error={createAccount.error || updateAccount.error || deleteAccount.error} />
				<div className="form-actions">
					{isEditing && (
						<DeleteButton
							type="button"
							variant="destructive"
							size="default"
							className="mr-auto"
							message="Are you sure you want to delete this account?"
							onConfirm={() => {
								deleteAccount.mutate(account.id);
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

					<Button type="submit" variant="default" size="default" disabled={isPending || !name.trim() || (isCredit && !!creditValidationError)}>
						{isPending && <LoadingSpinner size="sm" />}
						{isEditing ? "Save Changes" : "Add Account"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
