'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DEFAULT_EXPENSE_CATEGORIES } from '@/data/default-categories'
import { capitalize } from '@/utils/capitalize'
import { useExpenseStore } from '@/stores/expenses-store'
import { useTransactionsStore } from '@/stores/transactions-store'

export default function AddExpense({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): React.ReactNode {
	const { addExpense } = useExpenseStore()
	const { addTransaction } = useTransactionsStore()
	const [expense, setExpense] = useState<Expense>({
		id: crypto.randomUUID(),
		name: '',
		amount: '',
		category: '',
		paymentMethod: '',
		createdAt: Date.now(),
	})

	const paymentMethods = useMemo(() => ['credit', 'debit', 'cash', 'transfer'], [])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const transaction: Transaction = {
			id: expense.id,
			name: expense.name,
			createdAt: expense.createdAt,
			category: expense.category,
			amount: expense.amount,
			isExpense: true,
		}

		addExpense(expense)
		addTransaction(transaction)
		onOpenChange(false)
		setExpense({
			id: '',
			name: '',
			amount: '',
			category: '',
			paymentMethod: '',
			createdAt: Date.now(),
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Expense</DialogTitle>

					<DialogDescription>
						Add your expense details including category and payment method.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 my-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="name">Expense Name</label>

							<input
								type="text"
								id="name"
								name="name"
								value={expense.name}
								onChange={e => setExpense({ ...expense, name: e.target.value })}
								placeholder="e.g., Dinner with friends"
								required
								autoComplete="off"
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="amount">Amount</label>

							<input
								type="number"
								id="amount"
								name="amount"
								value={expense.amount}
								onChange={e => setExpense({ ...expense, amount: e.target.value })}
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="category">Category</label>

							<Select
								value={expense.category}
								onValueChange={category => setExpense({ ...expense, category })}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select category" />
								</SelectTrigger>

								<SelectContent>
									{DEFAULT_EXPENSE_CATEGORIES.map(category => (
										<SelectItem key={category} value={category}>
											{category.charAt(0).toUpperCase() + category.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>

						<fieldset>
							<label htmlFor="payment_method">Payment Method</label>

							<Select
								value={expense.paymentMethod}
								onValueChange={paymentMethod => setExpense({ ...expense, paymentMethod })}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select payment method" />
								</SelectTrigger>

								<SelectContent>
									{paymentMethods.map(paymentMethod => (
										<SelectItem key={paymentMethod} value={paymentMethod}>
											{capitalize(paymentMethod)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>
					</div>

					<DialogFooter>
						<Button type="submit">Add Expense</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
