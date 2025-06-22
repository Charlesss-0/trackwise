'use client'

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
import { DEFAULT_EXPENSE_CATEGORIES } from '@/data/default-categories'
import { useFixedExpenseStore } from '@/stores/fixed-expenses-store'

export default function EditFixedExpense({
	id,
	open,
	onOpenChange,
}: {
	id: string
	open: boolean
	onOpenChange: (open: boolean) => void
}): JSX.Element {
	const { fixedExpenses, updateFixedExpense } = useFixedExpenseStore()
	const [formData, setFormData] = useState({
		name: '',
		targetAmount: '',
		category: '',
		dueDate: '',
		frequency: '',
	})

	const fixedExpense = fixedExpenses.find(fixedExpense => fixedExpense.id === id)

	useEffect(() => {
		if (fixedExpense && open) {
			setFormData({
				name: fixedExpense.name,
				targetAmount: fixedExpense.targetAmount.toString(),
				category: fixedExpense.category,
				dueDate: fixedExpense.dueDate,
				frequency: fixedExpense.frequency,
			})
		}
	}, [fixedExpense, open])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string): void => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		if (!fixedExpense) return

		const updatedExpense: FixedExpense = {
			...fixedExpense,
			name: formData.name,
			targetAmount: Number(formData.targetAmount),
			category: formData.category,
			dueDate: formData.dueDate,
			frequency: formData.frequency,
		}

		updateFixedExpense(id, updatedExpense)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Fixed Expense</DialogTitle>
					<DialogDescription>
						Edit your fixed expense details including category and payment method.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-2 my-6 ">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="name" className="text-right">
								Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="e.g., Rent"
								autoComplete="off"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="targetAmount" className="text-right">
								Target Amount
							</label>
							<input
								type="number"
								id="targetAmount"
								name="targetAmount"
								value={formData.targetAmount}
								onChange={handleChange}
								placeholder="0.00"
								required
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
							<label htmlFor="dueDate" className="text-right">
								Due Date
							</label>
							<input
								type="date"
								id="dueDate"
								name="dueDate"
								value={formData.dueDate}
								onChange={handleChange}
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="frequency" className="text-right">
								Frequency
							</label>
							<Select
								value={formData.frequency}
								onValueChange={value => handleSelectChange('frequency', value)}
								required
							>
								<SelectTrigger id="frequency" className="col-span-3">
									<SelectValue placeholder="Select frequency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="monthly">Monthly</SelectItem>
									<SelectItem value="quarterly">Quarterly</SelectItem>
									<SelectItem value="annually">Annually</SelectItem>
								</SelectContent>
							</Select>
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
