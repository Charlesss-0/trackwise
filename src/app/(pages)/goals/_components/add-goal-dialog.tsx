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
import { DEFAULT_GOAL_PRIORITIES } from '@/data/default-categories'
import { capitalize } from '@/utils/capitalize'
import { useGoalStore } from '@/stores/goals-store'
import { useState } from 'react'

export default function AddGoal({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}): React.ReactNode {
	const { addGoal } = useGoalStore()
	const [formData, setFormData] = useState({
		name: '',
		targetAmount: '',
		deadline: '',
		priority: '',
		monthlyContribution: '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string): void => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const goal: Goal = {
			id: crypto.randomUUID(),
			name: formData.name,
			targetAmount: Number(formData.targetAmount),
			currentAmount: 0,
			deadline: formData.deadline,
			priority: formData.priority,
			monthlyContribution: Number(formData.monthlyContribution),
			isPaid: false,
			contributions: [],
			createdAt: Date.now(),
		}

		addGoal(goal)
		onOpenChange(false)
		setFormData({
			name: '',
			targetAmount: '',
			deadline: '',
			priority: '',
			monthlyContribution: '',
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Goal</DialogTitle>

					<DialogDescription>
						Set up a new financial goal with target amount and deadline.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-2 my-6 [&>fieldset]:flex [&>fieldset]:flex-col [&>fieldset]:gap-2">
						<fieldset>
							<label htmlFor="name">Goal Name</label>

							<input
								type="text"
								id="name"
								name="name"
								placeholder="e.g., New Car"
								value={formData.name}
								onChange={handleChange}
								autoComplete="off"
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="target">Target Amount</label>

							<input
								type="number"
								id="targetAmount"
								name="targetAmount"
								placeholder="0.00"
								value={formData.targetAmount}
								onChange={handleChange}
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="deadline">Deadline</label>

							<input
								type="date"
								id="deadline"
								name="deadline"
								value={formData.deadline}
								onChange={handleChange}
								required
								className="col-span-3 input"
							/>
						</fieldset>

						<fieldset>
							<label htmlFor="priority">Priority</label>

							<Select
								value={formData.priority}
								onValueChange={value => handleSelectChange('priority', value)}
							>
								<SelectTrigger className="col-span-3 input">
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>

								<SelectContent>
									{DEFAULT_GOAL_PRIORITIES.map(category => (
										<SelectItem key={category} value={category}>
											{capitalize(category)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</fieldset>

						<fieldset>
							<label htmlFor="monthly">Monthly Contribution</label>

							<input
								type="number"
								id="monthlyContribution"
								name="monthlyContribution"
								placeholder="0.00"
								value={formData.monthlyContribution}
								onChange={handleChange}
								className="col-span-3 input"
							/>
						</fieldset>
					</div>

					<DialogFooter>
						<Button type="submit">Add Goal</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
