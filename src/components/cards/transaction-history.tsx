'use client'

import {
	BanknoteArrowDown,
	BanknoteArrowUp,
	ChevronsUpDown,
	Ellipsis,
	Pencil,
	Trash,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { useExpenseStore } from '@/stores/expenses-store'
import { useIncomeStore } from '@/stores/income-store'
import { useTransactionsStore } from '@/stores/transactions-store'

const TABLE_HEADERS = [
	{
		name: 'Transaction',
		icon: <ChevronsUpDown className="text-neutral" size={16} />,
	},
	{
		name: 'Date',
		icon: <ChevronsUpDown className="text-neutral" size={16} />,
	},
	{
		name: 'Category',
		icon: <ChevronsUpDown className="text-neutral" size={16} />,
	},
	{
		name: 'Amount',
		icon: <ChevronsUpDown className="text-neutral" size={16} />,
	},
	{
		name: 'Type',
		icon: <ChevronsUpDown className="text-neutral" size={16} />,
	},
	{
		name: 'Action',
		icon: null,
	},
]

export default function TransactionHistory(): React.ReactNode {
	const { transactions, deleteTransaction } = useTransactionsStore()
	const { deleteIncome } = useIncomeStore()
	const { deleteExpense } = useExpenseStore()
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
	const formatDate = (date: number): string => formattedDate.format(new Date(date))

	const removeTransaction = (id: string): void => {
		deleteTransaction(id)
		deleteIncome(id)
		deleteExpense(id)
	}

	return (
		<Card className="col-span-1 md:col-span-3">
			<h2 className="text-lg font-medium text-neutral">Transaction History</h2>
			<CardContent className="relative h-full p-0 overflow-y-auto border rounded-lg scrollbar-hide max-h-92 border-base-300 bg-base-100 dark:bg-base-100-dark dark:border-base-300-dark">
				<table className="min-w-full border-collapse table-fixed">
					<thead className="sticky top-0 z-10 text-center bg-base-300 dark:bg-base-300-dark">
						<tr>
							{TABLE_HEADERS.map((header, index) => (
								<th key={index} className="px-6 py-4 text-left">
									<span className="flex items-center gap-2 font-semibold text-neutral">
										{header.name}
										{header.icon}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="text-left">
						{transactions && transactions.length > 0 ? (
							transactions
								.slice()
								.sort((a, b) => b.timestamp - a.timestamp)
								.map((transaction, index) => (
									<tr
										key={transaction.id}
										className={cn(
											'border-b border-base-300 dark:border-base-300-dark text-sm',
											index === transactions.length - 1 ? 'border-b-0' : '',
											index % 2 === 0
												? 'bg-base-100 dark:bg-base-100-dark'
												: 'bg-base-200 dark:bg-base-200-dark'
										)}
									>
										<td className="px-6">
											{transaction.name.charAt(0).toUpperCase() + transaction.name.slice(1)}
										</td>
										<td className="px-6">{formatDate(transaction.timestamp)}</td>
										<td className="px-6">
											{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
										</td>
										<td className="px-6">${transaction.amount}</td>
										<td className="px-6">
											{transaction.isExpense ? (
												<div className="flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-destructive/20 w-max">
													<BanknoteArrowDown size={16} className="text-destructive" />
													<span className="font-semibold text-destructive">Expense</span>
												</div>
											) : (
												<div className="flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-green-primary/20 w-max">
													<BanknoteArrowUp size={16} className="text-green-primary" />
													<span className="font-semibold text-green-primary">Income</span>
												</div>
											)}
										</td>
										<td className="px-6 py-3">
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														size="icon"
														className="bg-base-100 dark:bg-base-100-dark"
													>
														<Ellipsis size={16} />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-max">
													<ul className="space-y-2">
														<li>
															<Button
																variant="ghost"
																className="hover:base-200 dark:hover:bg-base-300-dark w-full flex justify-between gap-4 rounded-sm"
															>
																<span>Edit</span>
																<Pencil size={16} />
															</Button>
														</li>
														<li>
															<Button
																variant="ghost"
																className="hover:base-200 dark:hover:bg-base-300-dark w-full flex justify-between gap-4 rounded-sm"
																onClick={() => removeTransaction(transaction.id)}
															>
																<span>Delete</span>
																<Trash size={16} />
															</Button>
														</li>
													</ul>
												</PopoverContent>
											</Popover>
										</td>
									</tr>
								))
						) : (
							<tr>
								<td colSpan={TABLE_HEADERS.length}>
									<p className="flex items-center justify-center h-40 text-sm font-medium text-neutral">
										No transactions yet.
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</CardContent>
		</Card>
	)
}
