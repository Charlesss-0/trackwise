"use client";

import { CreditCard, Landmark, Pencil, Plus, RefreshCw, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AccountFormModal } from "@/components/accounts/account-form-modal";
import { SortableAccountCard, SortableAccountGrid } from "@/components/accounts/sortable-account-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorNotice } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { useAccounts, useUpdateAccount } from "@/hooks/use-accounts";
import { useReorderAccounts } from "@/hooks/use-reorder-accounts";
import type { Account } from "@/types/database";
import { formatCurrency, getAmountOwed } from "@/utils/currency";

export default function AccountsPage() {
	const { data: accounts, isLoading, error } = useAccounts();
	const [modalOpen, setModalOpen] = useState(false);
	const [accountToEdit, setAccountToEdit] = useState<Account | undefined>(undefined);
	const [quickUpdateId, setQuickUpdateId] = useState<string | null>(null);
	const [quickUpdateValue, setQuickUpdateValue] = useState("");
	const updateAccount = useUpdateAccount();
	const accountOrder = useReorderAccounts();
	const quickUpdateInput = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (quickUpdateId) quickUpdateInput.current?.focus();
	}, [quickUpdateId]);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<LoadingSpinner size="lg" />
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
		<div className="space-y-7">
			<PageHeader title="Accounts" description="Your balances, thoughtfully organized. Manage every account in one place.">
				<Button
					type="button"
					onClick={() => {
						setAccountToEdit(undefined);
						setModalOpen(true);
					}}
					variant="default"
					size="sm"
				>
					<Plus size={16} /> Add Account
				</Button>
			</PageHeader>

			<ErrorNotice error={error || updateAccount.error || accountOrder.error} />
			{(accounts?.length ?? 0) > 1 && (
				<div className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
					{accountOrder.isPending ? (
						<>
							<LoadingSpinner size="xs" />
							Saving account order…
						</>
					) : (
						"Drag a handle to arrange your accounts."
					)}
				</div>
			)}

			<SortableAccountGrid accounts={accounts ?? []} onReorder={accountOrder.reorder} disabled={accountOrder.isPending}>
				{accounts?.map((acc) => {
					const isCredit = acc.type === "credit";
					const amountOwed = getAmountOwed(acc);
					const utilization = isCredit && acc.credit_limit ? (amountOwed / acc.credit_limit) * 100 : 0;

					return (
						<SortableAccountCard key={acc.id} account={acc} disabled={accountOrder.isPending}>
							{(dragHandle) => (
								<>
									<button
										type="button"
										aria-label={`Edit ${acc.name}`}
										className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
										onClick={() => {
											setAccountToEdit(acc);
											setModalOpen(true);
										}}
									/>
									<div className="p-5 sm:p-6">
										<div className="mb-5 flex items-center justify-between">
											<span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
												{isCredit ? <CreditCard size={19} /> : <Landmark size={19} />}
											</span>

											<div className="flex items-center gap-2">
												<span className="text-xs font-medium text-muted-foreground">{acc.currency}</span>
												{dragHandle}
											</div>
										</div>

										<h2 className="flex flex-wrap items-center gap-2 font-display font-semibold text-base justify-between wrap-break-word">
											{acc.name}
											<div
												className={`inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium   capitalize ${isCredit ? "text-destructive" : acc.type === "debit" ? "text-success" : ""}`}
											>
												{acc.type}
											</div>
										</h2>

										{isCredit ? (
											<div className="mt-2 space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Available</span>
													<span className="font-medium tabular-nums">{formatCurrency(acc.available_balance ?? 0, acc.currency)}</span>
												</div>

												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Credit Limit</span>
													<span className="font-medium tabular-nums">{formatCurrency(acc.credit_limit ?? 0, acc.currency)}</span>
												</div>

												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">Amount Owed</span>
													<span className="font-medium text-destructive">{formatCurrency(amountOwed, acc.currency)}</span>
												</div>

												{acc.credit_limit != null && acc.credit_limit > 0 && (
													<div className="mt-1">
														<div className="flex justify-between text-xs mb-1">
															<span className="text-muted-foreground">Utilization</span>
															<span className="text-muted-foreground">{Math.round(utilization)}%</span>
														</div>
														<progress
															aria-label="Credit utilization"
															className={`balance-progress w-full ${utilization > 80 ? "text-destructive" : utilization > 50 ? "text-warning" : "text-success"}`}
															value={utilization}
															max={100}
														/>
													</div>
												)}

												{quickUpdateId === acc.id ? (
													<div className="relative z-20 flex gap-2 pt-3">
														<Input
															type="number"
															className="min-w-0 flex-1"
															value={quickUpdateValue}
															onChange={(e) => setQuickUpdateValue(e.target.value)}
															min={0}
															max={acc.credit_limit ?? undefined}
															step="0.01"
															aria-label="Available balance"
															ref={quickUpdateInput}
															onKeyDown={(e) => {
																if (e.key === "Enter") void handleQuickUpdate(acc).catch(() => {});
																if (e.key === "Escape") setQuickUpdateId(null);
															}}
														/>

														<Button
															type="button"
															variant="default"
															size="sm"
															onClick={() => {
																void handleQuickUpdate(acc).catch(() => {});
															}}
															disabled={updateAccount.isPending}
														>
															Save
														</Button>
													</div>
												) : (
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="relative z-20 w-full mt-4 gap-2 border border-border"
														onClick={(e) => {
															e.stopPropagation();
															startQuickUpdate(acc);
														}}
													>
														<RefreshCw size={12} /> Update Balance
													</Button>
												)}
											</div>
										) : (
											<div className="mt-5">
												<p className="mb-1 text-xs text-muted-foreground">Current balance</p>

												<p className="font-display text-3xl font-semibold tracking-tight tabular-nums">{formatCurrency(acc.balance, acc.currency)}</p>

												<div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
													<span>Manage account</span>
													<Pencil size={13} />
												</div>
											</div>
										)}
									</div>
								</>
							)}
						</SortableAccountCard>
					);
				})}

				{accounts?.length === 0 && (
					<Card className="col-span-full">
						<EmptyState
							icon={Wallet}
							title="Your accounts start here"
							description="Add a bank account, credit card, or cash balance to see your money in one place."
							actionLabel="Add account"
							onAction={() => {
								setAccountToEdit(undefined);
								setModalOpen(true);
							}}
						/>
					</Card>
				)}
			</SortableAccountGrid>

			<AccountFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} account={accountToEdit} />
		</div>
	);
}
