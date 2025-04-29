'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/utils/format-date'

export default function GoalItem({ goal }: { goal: Goal }): React.ReactNode {
	return (
		<Card className="bg-base-100 dark:bg-base-100-dark hover:cursor-pointer">
			<CardHeader className="flex justify-between text-xs">
				<div className="flex flex-col gap-1">
					<span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
					<span className="text-neutral">Deadline: {formatDate(goal.deadline)}</span>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-base-200 dark:hover:bg-base-300-dark size-9"
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
				<Button variant="secondary" className="w-full text-xs rounded-sm">
					Contribute
				</Button>
			</CardFooter>
		</Card>
	)
}
