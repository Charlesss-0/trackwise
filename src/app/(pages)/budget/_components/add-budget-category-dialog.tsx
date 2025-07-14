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
import React, { useState, type JSX } from 'react'

export default function AddBudgetCategoryDialog({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): JSX.Element {
	const { addCategory } = useBudgetStore()
	const [formData, setFormData] = useState({
		name: '',
		budgetAmount: '',
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const category: BudgetCategory = {
			id: crypto.randomUUID(),
			name: formData.name,
			budgetAmount: formData.budgetAmount,
			spentAmount: '0',
			createdAt: Date.now(),
		}

		addCategory(category)
		onOpenChange(false)
		setFormData({
			name: '',
			budgetAmount: '',
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Budget Category</DialogTitle>

					<DialogDescription>Add a new budget category to track your expenses.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-2 my-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="name">Category Name</label>

							<input
								type="text"
								id="name"
								name="name"
								placeholder="e.g., Groceries"
								autoComplete="off"
								value={formData.name}
								onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="budgeted">Budget Amount</label>

							<input
								type="number"
								id="budgeted"
								name="budgeted"
								placeholder="0.00"
								value={formData.budgetAmount}
								onChange={e => setFormData(prev => ({ ...prev, budgetAmount: e.target.value }))}
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<DialogFooter>
							<Button type="submit">Add Category</Button>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
