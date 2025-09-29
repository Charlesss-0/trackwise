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
import { DEFAULT_GOAL_PRIORITIES } from '@/data/constants'
import { capitalize } from '@/utils/capitalize'
import { useGoalStore } from '@/stores/goals-store'

export default function UpdateGoal({
	id,
	open,
	onOpenChange,
}: {
	id: string
	open: boolean
	onOpenChange: (open: boolean) => void
}): JSX.Element {
	const { goals, updateGoal } = useGoalStore()
	const [formData, setFormData] = useState({
		name: '',
		targetAmount: '',
		deadline: '',
		priority: '',
		monthlyContribution: '',
	})

	const goal = goals.find(goal => goal.id === id)

	useEffect(() => {
		if (goal && open) {
			setFormData({
				name: goal.name,
				targetAmount: goal.targetAmount.toString(),
				deadline: goal.deadline,
				priority: goal.priority,
				monthlyContribution: goal.monthlyContribution.toString(),
			})
		}
	}, [goal, open])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string): void => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		if (!goal) return

		const updatedGoal: Goal = {
			...goal,
			name: formData.name,
			targetAmount: Number(formData.targetAmount),
			deadline: formData.deadline,
			priority: formData.priority,
			monthlyContribution: Number(formData.monthlyContribution),
		}

		updateGoal(id, updatedGoal)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Goal</DialogTitle>

					<DialogDescription>Update the details of a goal.</DialogDescription>
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
							<label htmlFor="targetAmount">Target Amount</label>

							<input
								type="number"
								id="targetAmount"
								name="targetAmount"
								value={formData.targetAmount}
								onChange={handleChange}
								className="col-span-3 input"
								required
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
								<SelectTrigger id="priority" className="col-span-3">
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>

								<SelectContent>
									{DEFAULT_GOAL_PRIORITIES.map(priority => (
										<SelectItem key={priority} value={priority}>
											{capitalize(priority)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
