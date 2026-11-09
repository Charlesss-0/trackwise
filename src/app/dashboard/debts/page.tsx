"use client";

import { CreditCard, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DebtFormModal } from "@/components/debts/debt-form-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorNotice } from "@/components/ui/feedback";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { useDebts, useDeleteDebt } from "@/hooks/use-debts";
import type { Debt } from "@/types/database";
import { formatCurrency } from "@/utils/currency";

export default function DebtsPage() {
	const { data: debts, isLoading, error } = useDebts();
	const deleteDebt = useDeleteDebt();
	const [modalOpen, setModalOpen] = useState(false);
	const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<LoadingSpinner size="lg" />
			</div>
		);

	return (
		<div className="space-y-7">
			<PageHeader title="Debts & loans" description="Keep track of what you owe and the progress you’re making.">
				<Button
					type="button"
					onClick={() => {
						setDebtToEdit(null);
						setModalOpen(true);
					}}
					variant="default"
					size="sm"
				>
					<Plus size={16} /> Add Debt
				</Button>
			</PageHeader>
			<ErrorNotice error={error || deleteDebt.error} />

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				{debts?.map((debt) => {
					const progress = ((debt.total_amount - debt.remaining_balance) / debt.total_amount) * 100;

					return (
						<Card key={debt.id}>
							<div className="p-5 sm:p-6">
								<div className="flex justify-between items-start gap-3">
									<div>
										<h2 className="flex items-center gap-2 font-display font-semibold text-lg">{debt.creditor_name}</h2>

										<p className="text-sm text-muted-foreground">Due on day {debt.due_day} of every month</p>
									</div>

									<div className="flex gap-2">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={() => {
												setDebtToEdit(debt);
												setModalOpen(true);
											}}
										>
											<Pencil size={14} />

											<span className="sr-only">Edit</span>
										</Button>

										<DeleteButton
											type="button"
											variant="ghost"
											size="icon-sm"
											className="text-destructive"
											message="Delete this debt?"
											onConfirm={() => {
												deleteDebt.mutate(debt.id);
											}}
										>
											<Trash2 size={14} />

											<span className="sr-only">Delete</span>
										</DeleteButton>
									</div>
								</div>

								<div className="mt-6 flex flex-wrap justify-between items-end gap-5">
									<div>
										<p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Remaining</p>

										<p className="font-display text-2xl font-semibold tracking-tight tabular-nums text-destructive mt-1">
											{formatCurrency(debt.remaining_balance, debt.currency)}
										</p>
									</div>

									<div className="text-right">
										<p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Monthly Payment</p>

										<p className="text-lg font-semibold mt-1">{formatCurrency(debt.monthly_payment, debt.currency)}</p>
									</div>
								</div>

								<div className="mt-6">
									<div className="flex flex-wrap justify-between gap-2 text-xs mb-3 text-muted-foreground">
										<span>Paid: {formatCurrency(debt.total_amount - debt.remaining_balance, debt.currency)}</span>

										<span>Total: {formatCurrency(debt.total_amount, debt.currency)}</span>
									</div>

									<progress aria-label="Payment progress" className="balance-progress text-success w-full h-2" value={progress} max="100"></progress>
								</div>
							</div>
						</Card>
					);
				})}

				{debts?.length === 0 && (
					<Card className="col-span-full">
						<EmptyState
							icon={CreditCard}
							title="Nothing owed. A little peace of mind."
							description="No debts found. You are debt free! Add any loans you want to keep track of here."
						/>
					</Card>
				)}
			</div>

			<DebtFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} debt={debtToEdit} />
		</div>
	);
}
