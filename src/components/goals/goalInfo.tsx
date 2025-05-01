'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Progress } from '../ui/progress'
import { capitalize } from '@/utils/capitalize'
import { formatDate } from '@/utils/format-date'
import { useGoalStore } from '@/stores/goals-store'

export default function GoalInfo({
	selectedGoalId,
	open,
	onOpenChange,
	deleteGoal,
	deleteExpense,
	closeModal,
}: {
	selectedGoalId: string
	open: boolean
	onOpenChange: (open: boolean) => void
	deleteGoal: (id: string) => void
	deleteExpense: (id: string) => void
	closeModal: () => void
}): React.ReactNode {
	const { goals } = useGoalStore()
	const goal = goals.find(goal => goal.id === selectedGoalId)
	const progress = goal && (goal.currentAmount / goal.targetAmount) * 100

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogTitle>{goal?.name}</DialogTitle>
				{goal && (
					<>
						<div className="flex gap-2 justify-between text-sm font-medium">
							<span className="text-neutral">Target Amount</span>
							<span>${goal.targetAmount.toFixed(2)}</span>
						</div>
						<div className="flex gap-2 justify-between text-sm font-medium">
							<span className="text-neutral">Current Amount</span>
							<span>${goal.currentAmount.toFixed(2)}</span>
						</div>
						<div className="flex gap-2 justify-between text-sm font-medium">
							<span className="text-neutral">Deadline</span>
							<span>{formatDate(goal.deadline)}</span>
						</div>
						<div className="flex gap-2 justify-between text-sm font-medium">
							<span className="text-neutral">Priority</span>
							<span>{capitalize(goal.priority)}</span>
						</div>
						<div className="flex flex-col gap-2">
							<Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
							<span className="text-neutral text-sm text-center">
								{progress?.toFixed(1)}% Complete
							</span>
						</div>
					</>
				)}
				<div className="flex justify-end gap-4 mt-4">
					<Button
						variant="destructive"
						onClick={() => {
							deleteGoal(selectedGoalId)
							deleteExpense(selectedGoalId)
							closeModal()
						}}
					>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
