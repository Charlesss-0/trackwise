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

import { Button } from '../ui/button'
import { DEFAULT_INCOME_TYPES } from '@/data/default-categories'
import { useIncomeStore } from '@/stores/income-store'
import { useState } from 'react'
import { useTransactionsStore } from '@/stores/transactions-store'

export default function AddIncome({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): React.ReactNode {
	const { addIncome } = useIncomeStore()
	const { addTransaction } = useTransactionsStore()
	const [amount, setAmount] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [frequency, setFrequency] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const income: Income = {
			id: crypto.randomUUID(),
			amount: Number(amount),
			type,
			frequency,
			createdAt: Date.now(),
		}

		const transaction: Transaction = {
			id: income.id,
			name: income.type,
			category: income.type,
			amount: income.amount,
			isExpense: false,
			createdAt: income.createdAt,
		}

		addIncome(income)
		addTransaction(transaction)
		onOpenChange(false)
		setAmount('')
		setType('')
		setFrequency('')
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Income</DialogTitle>
					<DialogDescription>
						Add your income details. You can specify the type and frequency of your income.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-2 my-6">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="amount" className="text-right">
								Amount
							</label>
							<input
								type="number"
								value={amount}
								onChange={e => setAmount(e.target.value)}
								id="amount"
								name="amount"
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="type" className="text-right">
								Type
							</label>
							<Select value={type} onValueChange={setType}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select income type" />
								</SelectTrigger>
								<SelectContent>
									{DEFAULT_INCOME_TYPES.map(type => (
										<SelectItem key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="frequency" className="text-right">
								Frequency
							</label>
							<Select value={frequency} onValueChange={setFrequency}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select frequency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="monthly">Monthly</SelectItem>
									<SelectItem value="quarterly">Quarterly</SelectItem>
									<SelectItem value="annually">Annually</SelectItem>
									<SelectItem value="one-time">One-time</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Add Income
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
