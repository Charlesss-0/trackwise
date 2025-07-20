'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useBudgetStore } from '@/stores/budget-store'
import React, { useEffect, useState, type JSX } from 'react'

export default function UpdateBudgetCategoryDialog({
	id,
	open,
	onOpenChange,
}: {
	id: string
	open: boolean
	onOpenChange: (open: boolean) => void
}): JSX.Element {
	const { budgetCategory, updateBudgetCategory } = useBudgetStore()
	const [formData, setFormData] = useState({
		name: '',
		budgeted: '',
	})

	const budgetCategoryToUpdate = budgetCategory.find(category => category.id === id)

	useEffect(() => {
		if (budgetCategoryToUpdate && open) {
			setFormData({
				name: budgetCategoryToUpdate.name,
				budgeted: budgetCategoryToUpdate.budgetAmount.toString(),
			})
		}
	}, [budgetCategoryToUpdate, open])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		if (!budgetCategoryToUpdate) return

		const updatedBudgetCategory: BudgetCategory = {
			...budgetCategoryToUpdate,
			name: formData.name,
			budgetAmount: formData.budgeted,
		}

		updateBudgetCategory(id, updatedBudgetCategory)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Budget Category</DialogTitle>

					<DialogDescription>Update the details of a budget category.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 my-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="name">Name</label>

							<input
								type="text"
								id="name"
								name="name"
								autoComplete="off"
								value={formData.name}
								onChange={handleChange}
								className="col-span-3 input"
								required
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="budgeted">Budget Amount</label>

							<input
								type="number"
								id="budgeted"
								name="budgeted"
								value={formData.budgeted}
								onChange={handleChange}
								className="col-span-3 input"
								required
							/>
						</fieldset>
					</div>

					<DialogFooter>
						<Button type="submit">Save</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
