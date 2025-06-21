'use client'

import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_TYPES } from '@/data/default-categories'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { type JSX, useEffect, useState } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { capitalize } from '@/utils/capitalize'
import { useExpenseStore } from '@/stores/expenses-store'
import { useIncomeStore } from '@/stores/income-store'
import { useTransactionsStore } from '@/stores/transactions-store'

export default function UpdateTransactionDialog({
	id,
	open,
	onOpenChange,
}: {
	id: string
	open: boolean
	onOpenChange: (open: boolean) => void
}): JSX.Element {
	const { transactions, updateTransaction } = useTransactionsStore()
	const { income, updateIncome } = useIncomeStore()
	const { expenses, updateExpense } = useExpenseStore()
	const [formData, setFormData] = useState({
		name: '',
		category: '',
		amount: '',
		isExpense: false,
	})

	const options = formData.isExpense ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_TYPES
	const transaction = transactions.find(t => t.id === id)

	useEffect(() => {
		if (transaction && open) {
			setFormData({
				name: transaction.name,
				amount: String(transaction.amount),
				category: transaction.category,
				isExpense: transaction.isExpense,
			})
		}
	}, [transaction, open])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string): void => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const updatedTransaction: Transaction = {
			...formData,
			id,
			name: formData.name,
			category: formData.category,
			amount: Number(formData.amount),
			isExpense: formData.isExpense,
			createdAt: Date.now(),
		}

		const existingIncome = income.find(inc => inc.id === id)
		const existingExpense = expenses.find(exp => exp.id === id)

		if (existingIncome) {
			updateIncome(id, {
				...existingIncome,
				...updatedTransaction,
			})
		}

		if (existingExpense) {
			updateExpense(id, {
				...existingExpense,
				...updatedTransaction,
			})
		}

		updateTransaction(id, updatedTransaction)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Transaction</DialogTitle>
					<DialogDescription>Update the details of a transaction.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-2 my-6">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="name" className="text-right">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								autoComplete="off"
								value={formData.name}
								onChange={handleChange}
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="category" className="text-right">
								Category
							</label>
							<Select
								value={formData.category}
								onValueChange={value => handleSelectChange('category', value)}
							>
								<SelectTrigger id="category" className="col-span-3">
									<SelectValue placeholder="Select category">{formData.category}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{options.map(option => (
										<SelectItem key={option} value={option}>
											{capitalize(option)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="amount" className="text-right">
								Amount
							</label>
							<input
								type="number"
								id="amount"
								name="amount"
								value={formData.amount}
								onChange={handleChange}
								className="col-span-3 input"
							/>
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
