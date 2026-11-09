"use client";

import { format, parseISO } from "date-fns";
import { ArrowDownRight, ArrowLeftRight, ArrowUpRight, Plus } from "lucide-react";
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
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionWithRelations } from "@/types";
import { convertCurrency, formatCurrency } from "@/utils/currency";

export default function TransactionsPage() {
	const { data: transactions, isLoading, error } = useTransactions();
	const { data: exchangeRate } = useExchangeRate();
	const [modalOpen, setModalOpen] = useState(false);
	const [txToEdit, setTxToEdit] = useState<TransactionWithRelations | null>(null);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<LoadingSpinner size="lg" />
			</div>
		);

	return (
		<div className="space-y-7">
			<PageHeader title="Transactions" description="The details behind your money. Review and manage your everyday activity.">
				<Button
					type="button"
					onClick={() => {
						setTxToEdit(null);
						setModalOpen(true);
					}}
					variant="default"
					size="sm"
				>
					<Plus size={16} /> Add Transaction
				</Button>
			</PageHeader>

			<ErrorNotice error={error} />

			<Card className="overflow-hidden">
				<div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
					<h2 className="font-display font-semibold">All transactions</h2>
					<Badge>{transactions?.length ?? 0} transactions</Badge>
				</div>

				<div className="overflow-x-auto">
					<Table className="activity-table">
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Account</TableHead>
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
									<TableCell data-label="Date" className="whitespace-nowrap">
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
											{format(parseISO(tx.date), "MMM d, yyyy")}
										</Button>
									</TableCell>

									<TableCell data-label="Category">
										<div className="flex items-center gap-2">
											{tx.category && (
												<>
													<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
														<CategoryIcon name={tx.category.icon} color={tx.category.color} size={14} />
													</span>
													<span>{tx.category?.name}</span>
												</>
											)}
										</div>
									</TableCell>

									<TableCell data-label="Account">{tx.account?.name}</TableCell>

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
											{tx.currency !== tx.account?.currency && exchangeRate && tx.account?.currency && (
												<span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ml-1">
													{formatCurrency(convertCurrency(tx.amount, tx.currency, tx.account?.currency, exchangeRate), tx.account?.currency)}
												</span>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
							{transactions?.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="text-center p-0">
										<EmptyState
											icon={ArrowLeftRight}
											title="Your story starts with a transaction"
											description="Record your first income or expense to start seeing your activity here."
											actionLabel="Add transaction"
											onAction={() => {
												setTxToEdit(null);
												setModalOpen(true);
											}}
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
