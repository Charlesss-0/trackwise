'use client'

import { DEFAULT_EXPENSE_CATEGORIES, FREQUENCIES } from '@/data/constants'
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
import { capitalize } from '@/utils/capitalize'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'
import { useState } from 'react'

export default function AddFixedExpense({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): React.ReactNode {
	const { addFixedExpense } = useFixedExpenseStore()
	const [name, setName] = useState<string>('')
	const [targetAmount, setTargetAmount] = useState<string>('')
	const [category, setCategory] = useState<string>('')
	const [frequency, setFrequency] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const fixedExpense: FixedExpense = {
			id: crypto.randomUUID(),
			name,
			targetAmount: Number(targetAmount),
			currentAmount: 0,
			category,
			isRecurring: true,
			frequency,
			isPaid: false,
			createdAt: Date.now(),
		}

		addFixedExpense(fixedExpense)
		onOpenChange(false)
		setName('')
		setTargetAmount('')
		setCategory('')
		setFrequency('')
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Fixed Expense</DialogTitle>

					<DialogDescription>
						Add a recurring expense with target amount and frequency
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-2 my-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="name">Name</label>

							<input
								type="text"
								id="name"
								name="name"
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder="e.g., Rent"
								autoComplete="off"
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="target">Target Amount</label>

							<input
								type="number"
								id="target"
								name="target"
								value={targetAmount}
								onChange={e => setTargetAmount(e.target.value)}
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="category">Category</label>

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

						<fieldset>
							<label htmlFor="frequency">Frequency</label>
							<Select value={frequency} onValueChange={setFrequency} required>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select frequency" />
								</SelectTrigger>

								<SelectContent>
									{FREQUENCIES.map(frequency => (
										<SelectItem key={frequency} value={frequency}>
											{capitalize(frequency)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>
					</div>

					<DialogFooter>
						<Button type="submit">Add Fixed Expense</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
