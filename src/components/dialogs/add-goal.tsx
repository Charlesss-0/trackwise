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
	const [name, setName] = useState<string>('')
	const [targetAmount, setTargetAmount] = useState<string>('')
	const [deadline, setDeadline] = useState<string>('')
	const [priority, setPriority] = useState<string>('')
	const [monthlyContribution, setMonthlyContribution] = useState<string>('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()

		const goal: Goal = {
			id: crypto.randomUUID(),
			name,
			targetAmount: Number(targetAmount),
			currentAmount: 0,
			deadline: Number(deadline),
			priority,
			monthlyContribution: Number(monthlyContribution),
			contributions: [],
			createdAt: Date.now(),
		}

		addGoal(goal)
		onOpenChange(false)
		setName('')
		setTargetAmount('')
		setDeadline('')
		setPriority('')
		setMonthlyContribution('')
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
					<div className="grid gap-4 py-2 my-6">
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="name" className="text-right">
								Goal Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								placeholder="e.g., New Car"
								autoComplete="off"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="target" className="text-right">
								Target Amount
							</label>
							<input
								type="number"
								id="target"
								name="target"
								placeholder="0.00"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="deadline" className="text-right">
								Deadline
							</label>
							<input
								type="date"
								id="deadline"
								name="deadline"
								required
								className="col-span-3 input"
							/>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="priority" className="text-right">
								Priority
							</label>
							<Select>
								<SelectTrigger className="col-span-3 input">
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">High</SelectItem>
									<SelectItem value="2">Medium</SelectItem>
									<SelectItem value="3">Low</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>
						<fieldset className="grid items-center grid-cols-4 gap-2">
							<label htmlFor="monthly" className="text-right">
								Monthly Contribution
							</label>
							<input
								type="number"
								id="monthly"
								name="monthly"
								placeholder="0.00"
								className="col-span-3 input"
							/>
						</fieldset>
					</div>
					<DialogFooter>
						<Button type="submit" variant="secondary">
							Add Goal
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
