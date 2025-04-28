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

import { Button } from '@/components/ui/button'
import { DEFAULT_EXPENSE_CATEGORIES } from '@/data/default-categories'
import { useExpenseStore } from '@/stores/expenses-store'
import { useState } from 'react'
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
	const [name, setName] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const [category, setCategory] = useState<string>('')
	const [paymentMethod, setPaymentMethod] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const expense: Expense = {
			id: crypto.randomUUID(),
			name,
			amount: Number(amount),
			category,
			paymentMethod,
			createdAt: Date.now(),
		}

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
		setName('')
		setAmount('')
		setCategory('')
		setPaymentMethod('')
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
					<div className="grid gap-4 py-2 my-6">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="name" className="text-right">
								Expense Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder="e.g., Dinner with friends"
								required
								autoComplete="off"
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="amount" className="text-right">
								Amount
							</label>
							<input
								type="number"
								id="amount"
								name="amount"
								value={amount}
								onChange={e => setAmount(e.target.value)}
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="category" className="text-right">
								Category
							</label>
							<Select value={category} onValueChange={setCategory}>
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
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="payment_method" className="text-right">
								Payment Method
							</label>
							<Select value={paymentMethod} onValueChange={setPaymentMethod}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select payment method" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="credit">Credit Card</SelectItem>
									<SelectItem value="debit">Debit Card</SelectItem>
									<SelectItem value="cash">Cash</SelectItem>
									<SelectItem value="transfer">Bank Transfer</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Add Expense
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
