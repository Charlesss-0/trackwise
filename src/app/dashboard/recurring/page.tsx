"use client";

import { ArrowDownRight, ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorNotice } from "@/components/ui/feedback";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRecurringTransactions } from "@/hooks/use-transactions";
import type { TransactionWithRelations } from "@/types";
import { formatCurrency } from "@/utils/currency";

export default function RecurringPage() {
	const { data: transactions, isLoading, error } = useRecurringTransactions();
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [txToEdit, setTxToEdit] = useState<TransactionWithRelations | null>(null);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<LoadingSpinner size="lg" />
			</div>
		);

	return (
		<div className="space-y-7">
			<PageHeader title="Recurring payments" description="A clear view of the transactions that repeat, and when they’re due."></PageHeader>

			<ErrorNotice error={error} />

			<Card>
				<div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
					<h2 className="font-display font-semibold">Payment schedule</h2>

					<Badge>{transactions?.length ?? 0} recurring</Badge>
				</div>

				<div className="overflow-x-auto">
					<Table className="activity-table">
						<TableHeader>
							<TableRow>
								<TableHead>Frequency</TableHead>
								<TableHead>Due Date</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Note</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{transactions?.map((tx) => (
								<TableRow
									key={tx.id}
									className="cursor-pointer"
									onClick={() => {
										setTxToEdit(tx);
										setModalOpen(true);
									}}
								>
									<TableCell data-label="Frequency" className="capitalize">
										<Button
											type="button"
											variant="link"
											size="sm"
											className="h-auto p-0 font-medium text-foreground capitalize"
											onClick={(event) => {
												event.stopPropagation();
												setTxToEdit(tx);
												setModalOpen(true);
											}}
											aria-label={`Edit transaction: ${tx.note || tx.category?.name || tx.date}`}
										>
											{tx.recurring_frequency}
										</Button>
									</TableCell>

									<TableCell data-label="Due date">{tx.recurring_due_day ? `Day ${tx.recurring_due_day}` : "Various"}</TableCell>

									<TableCell data-label="Category">
										<div className="flex items-center gap-2">
											{tx.category && (
												<>
													<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
														<CategoryIcon name={tx.category.icon} color={tx.category.color} size={14} />
													</span>
													<span>{tx.category.name}</span>
												</>
											)}
										</div>
									</TableCell>

									<TableCell data-label="Note" className="max-w-64 truncate text-muted-foreground">
										{tx.note}
									</TableCell>

									<TableCell data-label="Amount" className="text-right whitespace-nowrap">
										<div
											className={`flex flex-wrap items-center justify-end gap-1 font-semibold tabular-nums ${tx.type === "income" ? "text-success" : ""}`}
										>
											<span className="sr-only">{tx.type === "income" ? "Income" : "Expense"}</span>
											{tx.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
											{formatCurrency(tx.amount, tx.currency)}
										</div>
									</TableCell>
								</TableRow>
							))}
							{transactions?.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="text-center p-0">
										<EmptyState
											icon={ArrowLeftRight}
											title="No recurring payments yet"
											description="Mark a transaction as recurring to see its frequency and due date here."
										/>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</Card>

			<TransactionFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} transaction={txToEdit} />
		</div>
	);
}
