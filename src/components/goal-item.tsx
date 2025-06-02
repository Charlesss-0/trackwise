'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/utils/format-date'
import { type JSX } from 'react'

export default function GoalItem({
	goal,
	onEdit,
	onInfo,
	onContribute,
}: {
	goal: Goal
	onEdit: () => void
	onInfo: () => void
	onContribute: () => void
}): JSX.Element {
	return (
		<Card className="bg-base-100 hover:cursor-pointer" onClick={onEdit}>
			<CardHeader className="flex justify-between text-xs">
				<div className="flex flex-col gap-1">
					<span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
					<span className="text-neutral">Deadline: {formatDate(goal.deadline)}</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-base-200 size-9"
					onClick={e => {
						e.stopPropagation()
						onInfo()
					}}
				>
					<Info size={14} />
				</Button>
			</CardHeader>
			<CardContent className="flex-col gap-2 text-xs">
				<div className="flex justify-between">
					<span>Progress</span>
					<span>
						${goal.currentAmount ? goal.currentAmount.toFixed(2) : '0.00'} / $
						{goal.targetAmount.toFixed(2)}
					</span>
				</div>
				<Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
			</CardContent>
			<CardFooter>
				<Button
					variant="secondary"
					className="w-full text-xs rounded-full"
					onClick={e => {
						e.stopPropagation()
						onContribute()
					}}
				>
					Contribute
				</Button>
			</CardFooter>
		</Card>
	)
}
