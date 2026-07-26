"use client";

import { format, parseISO } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { TransactionFormModal } from "@/components/transactions/transaction-form-modal";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionWithRelations } from "@/types";
import { convertCurrency, formatCurrency } from "@/utils/currency";

export default function TransactionsPage() {
	const { data: transactions, isLoading } = useTransactions();
	const { data: exchangeRate } = useExchangeRate();
	const [modalOpen, setModalOpen] = useState(false);
	const [txToEdit, setTxToEdit] = useState<TransactionWithRelations | null>(null);

	if (isLoading)
		return (
			<div className="flex justify-center p-12">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Transactions</h1>
				<button
					type="button"
					onClick={() => {
						setTxToEdit(null);
						setModalOpen(true);
					}}
					className="btn btn-primary btn-sm"
				>
					<Plus size={16} /> Add Transaction
				</button>
			</div>

			<div className="card bg-base-200 border border-base-300 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="table table-zebra w-full">
						<thead>
							<tr>
								<th>Date</th>
								<th>Category</th>
								<th>Account</th>
								<th>Note</th>
								<th className="text-right">Amount</th>
							</tr>
						</thead>
						<tbody>
							{transactions?.map((tx) => (
								<tr
									key={tx.id}
									className="hover cursor-pointer"
									onClick={() => {
										setTxToEdit(tx);
										setModalOpen(true);
									}}
								>
									<td className="whitespace-nowrap">{format(parseISO(tx.date), "MMM d, yyyy")}</td>
									<td>
										<div className="flex items-center gap-2">
											{tx.category && (
												<>
													<div
														className="w-3 h-3 rounded-full"
														style={{
															backgroundColor: tx.category?.color,
														}}
													/>
													<span>{tx.category?.name}</span>
												</>
											)}
										</div>
									</td>
									<td>{tx.account?.name}</td>
									<td className="max-w-50 truncate text-base-content/70">{tx.note}</td>
									<td className="text-right whitespace-nowrap">
										<div className={`flex items-center justify-end gap-1 font-medium ${tx.type === "income" ? "text-success" : ""}`}>
											{tx.type === "income" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
											{formatCurrency(tx.amount, tx.currency)}
											{tx.currency !== tx.account?.currency && exchangeRate && tx.account?.currency && (
												<span className="badge badge-sm badge-ghost ml-1">
													{formatCurrency(convertCurrency(tx.amount, tx.currency, tx.account?.currency, exchangeRate), tx.account?.currency)}
												</span>
											)}
										</div>
									</td>
								</tr>
							))}
							{transactions?.length === 0 && (
								<tr>
									<td colSpan={5} className="text-center py-8 text-base-content/60">
										No transactions found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<TransactionFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} transaction={txToEdit} />
		</div>
	);
}
