/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
'use client'

import { Calendar, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'

import AddFixedExpense from '@/components/dialogs/add-fixed-expense'
import { Button } from '@/components/ui/button'
import EditFixedExpense from '@/components/dialogs/edit-fixed-expense'
import { Progress } from '@/components/ui/progress'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { useState } from 'react'

export default function FixedExpenses(): React.ReactNode {
	const { fixedExpenses, deleteFixedExpense, updateFixedExpense } = useFixedExpenseStore()
	const [addFixedExpenseOpen, setAddFixedExpenseOpen] = useState<boolean>(false)
	const [deleteFixedExpenseOpen, setDeleteFixedExpenseOpen] = useState<boolean>(false)
	const [editFixedExpenseOpen, setEditFixedExpenseOpen] = useState<boolean>(false)
	const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
	const [amount, setAmount] = useState<string>('')

	const formatDate = (date: string): string => {
		const [year, month, day] = date.split('-')

		return `${day} ${new Date(`${year}-${month}-${day}`).toLocaleString('default', {
			month: 'long',
		})} ${year}`
	}

	const handlePaymentSubmit = (id: string, e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const fixedExpense = fixedExpenses.find(fixedExpense => fixedExpense.id === id)
		if (!fixedExpense) return

		updateFixedExpense(id, {
			...fixedExpense,
			currentAmount: Number(amount),
		})
		setAddPaymentOpen(false)
	}

	return (
		<>
			<Card className="relative max-h-[400px]">
				<h2 className="text-lg font-medium text-neutral">Fixed Expenses</h2>
				<div className="h-full overflow-y-auto space-y-4 scrollbar-hide rounded-md">
					{fixedExpenses.length > 0 ? (
						fixedExpenses.map(fixedExpense => (
							<div key={fixedExpense.id}>
								<Card
									className="rounded-md bg-base-100 dark:bg-base-100-dark hover:cursor-pointer"
									onClick={() => setEditFixedExpenseOpen(true)}
								>
									<CardHeader className="flex justify-between">
										<div className="flex flex-col gap-1">
											<span className="text-base-content dark:text-base-content-dark">
												{fixedExpense.name}
											</span>
											<span className="text-sm font-medium text-neutral">
												{fixedExpense.category.charAt(0).toUpperCase() +
													fixedExpense.category.slice(1)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="flex items-center gap-2 text-sm font-medium text-neutral">
												<Calendar size={16} />
												{formatDate(fixedExpense.dueDate)}
											</span>
											<Button
												variant="ghost"
												size="icon"
												className="hover:bg-base-200 dark:hover:bg-base-300-dark"
												onClick={e => {
													e.stopPropagation()
													setDeleteFixedExpenseOpen(true)
												}}
											>
												<Trash2 size={16} className="text-red-400" />
												<span className="sr-only">Delete</span>
											</Button>
										</div>
									</CardHeader>
									<CardContent className="flex-col gap-2">
										<div className="flex justify-between">
											<span>Progress</span>
											<span>
												$
												{fixedExpense.currentAmount
													? fixedExpense.currentAmount.toFixed(2)
													: '0.00'}{' '}
												/ ${fixedExpense.targetAmount.toFixed(2)}
											</span>
										</div>
										<Progress
											value={(fixedExpense.currentAmount / fixedExpense.targetAmount) * 100}
										/>
									</CardContent>
									<CardFooter>
										{addPaymentOpen ? (
											// eslint-disable-next-line jsx-a11y/click-events-have-key-events
											<form
												className="flex gap-2 items-center"
												onSubmit={e => handlePaymentSubmit(fixedExpense.id, e)}
												onClick={e => e.stopPropagation()}
											>
												<input
													type="number"
													value={amount}
													onChange={e => setAmount(e.target.value)}
													placeholder="Enter amount"
													className="input w-full"
												/>
												<Button type="submit" variant="secondary">
													Pay
												</Button>
												<Button
													variant="ghost"
													className="hover:bg-base-200 dark:hover:bg-base-300-dark"
													onClick={() => setAddPaymentOpen(false)}
												>
													Cancel
												</Button>
											</form>
										) : (
											<Button
												variant="secondary"
												className="w-full rounded-sm"
												onClick={e => {
													e.stopPropagation()
													setAddPaymentOpen(true)
												}}
											>
												Add Payment
											</Button>
										)}
									</CardFooter>
								</Card>
								<Dialog open={deleteFixedExpenseOpen} onOpenChange={setDeleteFixedExpenseOpen}>
									<DialogContent>
										<DialogTitle className="text-sm font-medium text-base-content dark:text-base-content-dark">
											Are you sure you want to delete this fixed expense?
										</DialogTitle>
										<div className="mt-4 flex justify-end gap-4">
											<Button variant="secondary" onClick={() => setDeleteFixedExpenseOpen(false)}>
												Cancel
											</Button>
											<Button
												variant="destructive"
												onClick={() => {
													deleteFixedExpense(fixedExpense.id)
													setDeleteFixedExpenseOpen(false)
												}}
											>
												Delete
											</Button>
										</div>
									</DialogContent>
								</Dialog>
								<EditFixedExpense
									id={fixedExpense.id}
									open={editFixedExpenseOpen}
									onOpenChange={setEditFixedExpenseOpen}
								/>
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center h-full mb-6">
							<p className="text-sm font-medium text-neutral">No fixed expenses set yet.</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => setAddFixedExpenseOpen(true)}
							>
								Add Fixed Expense
							</Button>
						</div>
					)}
					{fixedExpenses.length > 0 && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 top-4 hover:bg-base-300 dark:hover:bg-base-300-dark"
							onClick={() => setAddFixedExpenseOpen(true)}
						>
							<Plus size={16} />
						</Button>
					)}
				</div>
			</Card>

			<AddFixedExpense open={addFixedExpenseOpen} onOpenChange={setAddFixedExpenseOpen} />
		</>
	)
}
